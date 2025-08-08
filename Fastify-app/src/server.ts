import fastify,{FastifyPluginAsync} from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import database from './config/db';
//import { APIGATEWAY } from './routes/api-gateway';
import { fastifyAPIGateway } from './routes/fastify-api-gateway';

dotenv.config();

const app = fastify({
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
app.register(cookie);
const apiGatewayPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(fastifyAPIGateway, { prefix: '/v1' });
  };
  
  // Register Swagger
app.register(swagger, swaggerOptions);
app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
});


  // Register the plugin
  app.register(apiGatewayPlugin);

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({ error: error.message || 'Server Error' });
});

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




