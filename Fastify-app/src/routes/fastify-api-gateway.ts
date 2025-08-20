import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import userService from '../controllers/fastify-user.service';
//import userService from '../controllers/User.service';
import roleService from '../controllers/role.service';
import AuthService from '../controllers/auth.service';
import jwt from 'jsonwebtoken';
import verifyToken from '../middlewares/auth';
import schema from '../helpers/utils/validate-schemas';
import { ValidateJoi } from '../middlewares/joi-validator';
import { userSchema } from '../models/schemavalidations/schema-validations';
//import passport from 'passport';
//import { OIDCStrategy } from 'passport-azure-ad';
// import FastifyRequest from 'fastify'
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
//import { azureADConfig } from '../config/azure-ad';
//import fastifySession from '@fastify/session';



export const fastifyAPIGateway: FastifyPluginAsync = async (fastify) => {

    //fastify.get('/auth/azure', passport.authenticate('azuread-openidconnect'));
    
  // Auth routes
  fastify.post("/login", (request, reply) => {
    return AuthService.Login(request, reply);
  });

  // User routes
  fastify.get('/users', async (request, reply) => {
    return userService.getAllUsers(request, reply);
  });

  fastify.get("/user/:id", {
    preHandler: verifyToken,
    handler: async (request, reply) => {
      return userService.getUserById(request, reply);
    }
  });
  //Add User Details
  fastify.post("/users/adduser", {
    preHandler: [verifyToken, ValidateJoi(schema.userSchema)],
    handler: async (request: any, reply: any) => {
      return userService.addUser(request, reply);
    }
  });
  fastify.post("/roles/addrole", {
    preHandler: [verifyToken, ValidateJoi(schema.roleSchema)],
    handler: async (request: any, reply: any) => {
      return roleService.AddRole(request, reply);
    }
  })
  fastify.get("/roles", {
    preHandler: [verifyToken, ValidateJoi(schema.roleSchema)],
    handler: async (request: any, reply: any) => {
      return roleService.getAllRoles(request, reply);
    }
  })
  // Get role by ID
  fastify.get("/roles/:id", {
    preHandler: [verifyToken],
    handler: async (request: any, reply: any) => {
      return roleService.getRoleById(request, reply);
    }
  });

  // Update role by ID
  fastify.put("/roles/updaterole/:id", {
    preHandler: [verifyToken, ValidateJoi(schema.roleSchema)],
    handler: async (request: any, reply: any) => {
      return roleService.updateRole(request, reply);
    }
  });

  // Delete role by ID
  fastify.delete("/roles/deleterole/:id", {
    preHandler: [verifyToken],
    handler: async (request: any, reply: any) => {
      return roleService.deleteRole(request, reply);
    }
  });

}; 