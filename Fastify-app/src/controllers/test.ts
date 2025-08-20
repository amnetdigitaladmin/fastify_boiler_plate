/** *
@author
Amnet Digital
@date
2024-05-10
@Service
API Service
@usage
 Path Directory and Token Validation .
*/
 
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
//import session from 'express-session';
import jwt from 'jsonwebtoken';
//import type { Context, ServiceSchema } from "moleculer";
//import type { ApiSettingsSchema, GatewayResponse, IncomingRequest, Route } from "moleculer-web";
//import ApiGateway from "moleculer-web";
import passport from 'passport';
//import jwksClient from "jwks-rsa";
import { jwtDecode } from "jwt-decode";
import  {Server} from "socket.io";
//import { middlewares } from 'moleculer.config';
//const { MoleculerError } = require("moleculer").Errors;
import { OIDCStrategy } from 'passport-azure-ad';
const idmetadata = `${process.env.CLOUD_INSTANCE}${process.env.AZURE_TENANT_ID}/.well-known/openid-configuration`;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const azureADConfig: any = {
    identityMetadata: idmetadata,
    clientID: clientId,
    clientSecret,
    responseType: process.env.RESPONSE_TYPE,
    responseMode: process.env.RESPONSE_MODE,
    redirectUrl: process.env.REDIRECT_URI,
    allowHttpForRedirectUrl: true, // Set to true for local development
    isB2C: false, // Set to true if using Azure AD B2C
    validateIssuer: true,  // Set to true if you want to validate the issuer
    passReqToCallback: true,
    useCookieInsteadOfSession: false, // Use cookies for session management
    scope: ['profile', 'email'], // Specify the required scopes
    loggingLevel: 'info', // Adjust logging level as needed,
    nonceLifetime: null,
    nonceMaxAmount: 6,
    clockSkew: 300,
    loggingNoPII: true,
    accessTokenAcceptedVersion: 2
};
const callbackFunction: any = (req: Request, iss: any, sub: any, profile: any, accessToken: any, refreshToken: any, done: any) => {
    if (accessToken) {
        console.log(`Received accessToken - ${accessToken}`);
    }
    if (refreshToken) {
        console.log(`Received refreshToken - ${refreshToken}`);
    }
    if (!profile.oid) {
        // console.log( 'Received accessToken - ' + accessToken );
        return done(new Error("No oid found"), null);
    }
    if (profile) {
        console.log(`profile - ${JSON.stringify(profile)}`);
    }
    return done(null, profile);
};
 
passport.use(new OIDCStrategy(azureADConfig, callbackFunction));
dotenv.config();
interface Meta {
    userAgent?: string | null | undefined;
    employee_id?: string | null | undefined;
    roles?: any | null | undefined;
    roleDescriptions?:string | null | undefined;
    $statusCode?:number|null,
    email:string | null | undefined;
    activeRoleId:number|null
    activeRoleDescription:string | null | undefined;
}
 
const ApiService: ServiceSchema<ApiSettingsSchema> = {
    name: "api",
    mixins: [fastify-api-gateway],  
    settings: {
        port: process.env.PORT != null ? Number(process.env.PORT) : 3000,
        // ip: "0.0.0.0",
        use: [],
        middleware: false,
        routes: [
            {
                path: "/api",
                whitelist: ["**"],
                use: [
                    cookieParser(),
                    session({ secret: 'SeedWorks' }),
                    passport.initialize(),
                    passport.session(),
                ],
                cors: { origin: "*", methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], allowedHeaders: "*", exposedHeaders: [] },
                mergeParams: true,
                authorization: false,
                authentication: true,
                autoAliases: true,
                aliases: {
                    "GET /userlogin": [
                        passport.authenticate("azuread-openidconnect")
                    ],
                    "POST /auth/callback": ["azurelogin.authenticate"],
                },
                callOptions: {},
                bodyParsers: {
                    json: {
                        strict: false,
                        limit: "50MB",
                    },
                    urlencoded: {
                        extended: true,
                        limit: "50MB",
                        parameterLimit: 50000 * 10
                    },
                },
 
                mappingPolicy: "all", // Available values: "all", "restrict"
                logging: true,
            },
        ],
        log4XXResponses: false,
        logRequestParams: null,
        logResponseData: null,
        assets: {
            folder: "public",
            options: {},
        },
    },
 
    methods: {
        async authenticate(
            ctx: Context <null, Meta>,
            route: Route,
            req: IncomingRequest,
        ): Promise<any> {
            let currentUrl: any = req.url;
            const myurlvalue = currentUrl.split("/");
            if( myurlvalue && myurlvalue.length>=3){
                currentUrl ="";
                currentUrl ='/'+myurlvalue[1]+'/'+myurlvalue[2];
            }
            const urls: any = ['/userlogin', '/auth/callback', '/superadmin/login',"/auth/rolerights","/auth/mobile_login",'/sap/employee', '/sap/material', '/sap/warehouse', '/sap/inventory/warehouses', '/sap/inventory/lotinfo', '/sap/sales', '/sap/salesreturns','/quality/optimize_distribution','/sap/salesorders','/sap/croplist','/sap/variety','/plan/cropstateslist','/plan/salesplancreate','/sap/inventory'];    
            if (urls.includes(currentUrl)) {
                return "Done";
            } else {
                if(! req.headers["session"] &&  req.headers["session"] != ""){      
                    throw new fastify-api-gateway.Errors.BadRequestError("session is missing in headers", null);        
                }
                const auth: any = req.headers["session"];          
                let session: any = await ctx.call('auth.getSession',{session:auth})
                if (session &&  session.data && session.data.hasOwnProperty('token')) {
                    const decoded:any = jwt.decode(session.data.token, { complete: true });
                    const result:any ={unique_name:decoded?.payload.unique_name}
                    if(result && result.hasOwnProperty('unique_name')){
                        let userRoles: any = await ctx.call('role.getUserRolesByUserIdForAuthorization',{employee_id:session.data.employee_id})
                        let userNames: any = await ctx.call('role.getUserRoleDescriptionsByUserIdForAuthorization',{employee_id:session.data.employee_id})  
                            ctx.meta.email = result.unique_name                
                            ctx.meta.employee_id = session.data.employee_id
                            ctx.meta.roleDescriptions = userNames &&  userNames.data && userNames.data.length > 0?userNames.data:[]
                            ctx.meta.roles = userRoles.data;
                            ctx.meta.activeRoleId = session.data.roleId;
                            ctx.meta.activeRoleDescription = session.data.role_description;
                        return result
                    }else{
                        throw new fastify-api-gateway.Errors.UnAuthorizedError('Session Expired',null)
                    }
                    // return { result }
                }else{
                    throw new fastify-api-gateway.Errors.BadRequestError("Invalid session or Expired Please Login Again", null);
                }
            }
            // const auth: any = req.headers["session"];
            // if (noToken == "Valid") {
            //  return null;
            // } else if (noToken == "Not Valid") {// && currentUrl.includes('/role') || currentUrl.includes('/user') || currentUrl.includes('/plan/croplist') || currentUrl.includes('/quality/warehouses') || currentUrl.includes('/plan/variety') && currentUrl.includes('/plan/plans')) {
            // if (auth) {
            //  try {
            //      const result = jwt.verify(auth, process.env.JWT_SECRET!);
            //      return { result }
            //  } catch (err) {
            //      throw new ApiGateway.Errors.UnAuthorizedError(
            //          ApiGateway.Errors.ERR_INVALID_TOKEN,
            //          null,
            //      );
            //  }
            // } else {
            //  throw new ApiGateway.Errors.UnAuthorizedError(
            //      ApiGateway.Errors.ERR_INVALID_TOKEN,
            //      null,
            //  );
            // }
            // let sessionId = req.headers["session"];              
            // let session: any = await SessionRepo.getSession(auth);
            // if(session && session.hasOwnProperty('token')){
            //  const decoded = jwt.decode(session.token, { complete: true });
            //  const verifyOptions:any = { algorithms: ['RS256'], header: decoded?.header };
            //  const client = jwksClient({ jwksUri: 'https://login.microsoftonline.com/common/discovery/keys' });
            //  const key = await client.getSigningKey(decoded?.header.kid).then((key:any) => key.publicKey|| key.rsaPublicKey);
            //  const result = jwt.verify(session.token, key, verifyOptions);
            //   return {result}
 
            // }
            // } else if (noToken == "Not Valid" && currentUrl.includes('/plan')) {
            //  if (auth) {
            //      try {
            //          const result = jwt.verify(auth, process.env.JWT_SECRET!);
            //          return { result }
            //      } catch (err) {
            //          throw new ApiGateway.Errors.UnAuthorizedError(
            //              ApiGateway.Errors.ERR_INVALID_TOKEN,
            //              null,
            //          );
            //      }
            //  } else {
            //      throw new ApiGateway.Errors.UnAuthorizedError(
            //          ApiGateway.Errors.ERR_INVALID_TOKEN,
            //          null,
            //      );
            //  }
            // }
            // else {
            //  throw new ApiGateway.Errors.UnAuthorizedError(
            //      ApiGateway.Errors.ERR_INVALID_TOKEN,
            //      null,
            //  );
 
 
            // }
        },
        async authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest): Promise<any> {
            try {
                let currentUrl: any = req.url;
                const urls: any = ['/userlogin', '/auth/callback', '/superadmin/login',"/auth/rolerights","/auth/mobile_login",'/sap/employee', '/sap/material', '/sap/warehouse', '/sap/inventory/warehouses', '/sap/inventory/lotinfo', '/sap/sales', '/sap/salesreturns','/sap/salesorders'];
                if (urls.includes(currentUrl)) {
                    return null;
                }              
                let action = req.$action.name
                let sessionId = req.headers["session"];
                let session: any = await ctx.call('auth.getSession',{session:sessionId})
                if (session && session.data &&  session.data.hasOwnProperty('employee_id')) {                  
                    let userRoles: any = await ctx.call('role.getUserRolesByUserIdForAuthorization',{employee_id:session.data.employee_id})
                    if (userRoles && userRoles.data && userRoles.data.length > 0) {
                        let userRights: any = await ctx.call('auth.getUserRights',{userRoles:userRoles.data})                      
                        if (userRights && userRights.data && userRights.data.length > 0 && userRights.data.includes(action)) {
                            let userNames: any = await ctx.call('role.getUserRoleDescriptionsByUserIdForAuthorization',{employee_id:session.data.employee_id})  
                            ctx.meta.email = ctx.meta.email                            
                            ctx.meta.employee_id = session.data.employee_id
                            ctx.meta.roleDescriptions = userNames &&  userNames.data && userNames.data.length > 0?userNames.data:[]
                            ctx.meta.roles = userRoles.data;
                            ctx.meta.activeRoleId = session.roleId;
                            ctx.meta.activeRoleDescription = session.role_description;
                            await ctx.call('auth.UpdateLastActive',{sessionId:sessionId})
                            return true
                        } else {
                             throw new fastify-api-gateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
                        }
                    }else{
                     throw new fastify-api-gateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
                    }
                }else{
                  throw new fastify-api-gateway.Errors.BadRequestError("Invalid session or Exxpired Please Login Again", null);  
                }
            } catch (err) {
                throw new fastify-api-gateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
            }
        }      
    },
    events: {
        //* notification.send event to send notification to client
        'notification.send'(notification: any) {
            if (this.io) this.io.emit(notification.employee_id, notification);
        }
    },
    async started() {
        this.io = new Server(this.server,{
            cors: {
                origin: "*", methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], allowedHeaders: "*", exposedHeaders: []
            }
          });      
        this.io.on("connection", (socket:any) => {
          console.log("Socket connected: " + socket.id);        
   
        socket.on("disconnect", () => {
            console.log("Socket disconnected: " + socket.id);
        })
        });
        return await this.io;
      },
 
};
 
export default ApiService;