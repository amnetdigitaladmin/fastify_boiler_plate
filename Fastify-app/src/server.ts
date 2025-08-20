import { FastifyRequest, FastifyReply, fastify, FastifyInstance } from 'fastify';
import session from '@fastify/session';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import database from './config/db';
import { fastifyAPIGateway } from './routes/fastify-api-gateway';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import UserSessionsRepository from './models/repositories/userSessions.repo';
import UserRepository from './models/repositories/user.repo';
import userService from './controllers/fastify-user.service';
import logger from './middlewares/logger';
dotenv.config();

const app: FastifyInstance = fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 3002;

// Swagger configuration
const swaggerOptions = {
  swagger: {
    info: {
      title: 'Fastify API Documentation',
      description: 'API documentation for Fastify backend application',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    host: `localhost:${PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' }
    ],
    definitions: {
      User: {
        type: 'object',
        required: ['email', 'name', 'mobile', 'type'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          name: { type: 'string', minLength: 3, maxLength: 30, description: 'User name' },
          mobile: { type: 'string', pattern: '^[0-9]{10}$', description: 'User mobile number (10 digits)' },
          type: { type: 'string', description: 'User type' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email' },
          password: { type: 'string', description: 'User password' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Error message' }
        }
      }
    }
  }
};
// Register plugins
app.register(cors, {
  origin: '*',
  credentials: true,
});
app.register(helmet);
app.register(rateLimit, {
  max: 100,
  timeWindow: '15 minute'
});
// Register Swagger
app.register(swagger, swaggerOptions);
app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
});

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in environment variables');
}

// Register cookie plugin first
app.register(cookie);

// Register session plugin
app.register(session, {
  secret: SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
});

// Function to get user info from Microsoft Graph
async function getUserInfo(accessToken:any) {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

// Simple in-memory session store (use Redis or database in production)
const sessions = new Map();

// Session middleware
const sessionMiddleware = async (request:FastifyRequest,reply:FastifyReply) => {
  const sessionId = request.headers['x-session-id'] || request.cookies?.sessionId;
  
  if (sessionId && sessions.has(sessionId)) {
    (request as any).session = sessions.get(sessionId);
    (request as any).user = (request as any).session.user;
  } else {
    (request as any).session = { id: null, user: null };
    (request as any).user = null;
  }
  
  // Add session management methods
  (request as any).session.destroy = () => {
    if (sessionId) {
      sessions.delete(sessionId);
      reply.clearCookie('sessionId');
    }
  };
  
  (request as any).session.save = (user:any) => {
    const newSessionId = Math.random().toString(36).substring(2, 15);
    const session = { id: newSessionId, user: user };
    sessions.set(newSessionId, session);
    reply.setCookie('sessionId', newSessionId, {
      path: '/',
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    (request as any).session = session;
    (request as any).user = user;
  };
};

// Register session middleware
app.addHook('onRequest', sessionMiddleware);

// Azure AD Configuration
const config = {
  clientID: process.env.AZURE_CLIENT_ID || '',
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  tenantID: process.env.AZURE_TENANT_ID,
  redirectUrl: process.env.REDIRECT_URL || 'http://localhost:3002/auth/callback',
  authorizationURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`,
  tokenURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
  scope: 'User.Read',
  resource: process.env.AZURE_RESOURCE || 'https://graph.microsoft.com'
};

// Routes
app.get('/', async (request, reply) => {
  reply.type('text/html').send('Home page. <a href="/auth/azuread">Login with Azure AD</a>');
});

app.get('/auth/azure', async (request, reply) => { 
  // Generate state parameter for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in session for validation
  //request.session.state = state;
  
  // Build Azure AD authorization URL
  const authUrl = new URL(config.authorizationURL);
  authUrl.searchParams.set('client_id', config.clientID);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', config.redirectUrl);
  authUrl.searchParams.set('scope', config.scope);
  authUrl.searchParams.set('response_mode', 'query');
  //authUrl.searchParams.set('state', state);
  
  // Redirect to Azure AD
  reply.redirect(authUrl.toString());
});

app.get('/auth/callback', async (request, reply) => {
  try {
    const { code,  error } = request.query as { code: string; error: string };
    console.log("code", code);
    // Check for errors
    if (error) {
      return { error: 'Authentication failed', details: error };
    }
    
    // Validate state parameter
    // if (!state || state !== request.session.state) {
    //   return { error: 'Invalid state parameter' };
    // }
    
    // Check for authorization code
    if (!code) {
      return { error: 'No authorization code received' };
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch(config.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientID || '',
        client_secret: config.clientSecret || '',
        code: code,
        redirect_uri: config.redirectUrl,
        grant_type: 'authorization_code',
        scope: config.scope
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Failed to exchange code for token: ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Get user info using the access token
    const userInfo = await getUserInfo(accessToken);
    const user = {
      id: userInfo.id,
      displayName: userInfo.displayName,
      email: userInfo.mail || userInfo.userPrincipalName,
      accessToken: accessToken,
      refreshToken: tokenData.refresh_token
    };
    /* JWT token generation start */
    //let userDetail:any = await userService.getUserByEmail(user.email,reply);
    //let emailrequest : any = { email: user.email };
    let userDetail :any = await UserRepository.getByemail(user.email.toLowerCase());
    console.log("userDetail", userDetail);
    const token = jwt.sign(
      { userId: userDetail.id, email: userDetail.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRE!) }
    );
    if (token) {
      let obj: any = {
        last_active_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        is_active: true,
        expires_at: moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
        user_id: userDetail.id,
        created_by: userDetail.id
      };
      await UserSessionsRepository.save(obj);
    }
    /* JWT token generation end */
    // Save user session
    //request.session.save(user as any);
    console.log("284");
    // Clear the state from session
    //delete request.session.state;
    
    // Return success response
    // return { 
    //   message: 'Authentication successful!',
    //   user: user,
    //   //sessionId: request.session.sessionId,
    //   token: token,
    //   //note: 'You can now access protected routes like /dashboard'
    // };
    logger.info({ userId: userDetail.id, success: "Login" }, "login method success");
              return reply
                .status(200)
                .send({
                  token: token,
                  user_info: userDetail,              
                  message: "User Logged in Successfully",
                });
    
  } catch (error) {
    console.error('OAuth2 callback error:', error);
    return { error: 'Authentication failed', details: error as string };
  }
});

app.get('/auth/logout', async (request, reply) => {
  request.session.destroy();
  return { message: 'Logged out successfully' };
});
// Error handler
app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({ 
    success: false,
    error: error.message || 'Server Error' 
  });
});



app.register(fastifyAPIGateway);

// Start server
const start = async () => {
  try {
    await database; // Ensure DB is connected
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Fastify server running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();