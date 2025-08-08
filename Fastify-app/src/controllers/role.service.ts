import { FastifyRequest, FastifyReply } from 'fastify';
 import { Irole } from '../models/schemas/role';
import RoleRepo from '../models/repositories/roles.repo';
import common from "../helpers/utils/common";
import logger from '../middlewares/logger';
import * as _ from 'lodash';

class roleService { 
    public async getAllRoles(request: FastifyRequest, reply:FastifyReply){
        try {
            logger.info({ userId: request.meta?.userId, init: "getAllRoles" }, "Get All Roles method called");
            let rolesInfo: any = await RoleRepo.getRolesForImport();
            if (rolesInfo && rolesInfo.length > 0) {
                return reply.status(200).send({ status: 'success', data: rolesInfo });
            } else {
                return reply.status(200).send({ status: 'success', data: [] });
            }
        } catch (error: any) {
            logger.error({ userId: request.meta?.userId, error: "getAllRoles" }, "Get All Roles method error: " + JSON.stringify(error));
            return reply.status(500).send({ message: "Internal server error" });
        }
    };

    public async AddRole(request: FastifyRequest, reply: FastifyReply) {
    try {
        logger.info({ userId: request.meta?.userId, init: "createRole" }, "Create Role method called");
        let params: any = request.body as Irole;

        if (!params || !params?.name) {
            return reply.status(400).send({ status: 'error', message: 'Role name is required' });
        }
        // Set metadata (if needed)
        params.created_by = request.meta?.userId || 'system';
        const createdRole = await RoleRepo.createRole(params);
        if (createdRole) {
            return reply.status(201).send({ status: 'success', data: createdRole });
        } else {
            return reply.status(400).send({ status: 'error', message: 'Role creation failed' });
        }

    } catch (error: any) {
        logger.error({ userId: request.meta?.userId, error: "createRole" }, "Create Role method error: " + JSON.stringify(error));
        return reply.status(500).send({ message: "Internal server error" });
    }
}

// public async updateRole(request: FastifyRequest, reply: FastifyReply) {
//     try {
//         logger.info({ userId: request.meta?.userId, init: "updateRole" }, "Update Role method called");
//         const roleId = (request.params as any).id;
//         const params: any = request.body;

//         if (!roleId || !params || !params.name) {
//             return reply.status(400).send({ status: 'error', message: 'Role ID and name are required' });
//         }
//         let usersInfo: any = await RoleRepo.getById(roleId);
//         usersInfo = { ...usersInfo, ...params }; 
//         usersInfo.updated_by = request.meta?.userId || 'system';
//         const updatedRole = await RoleRepo.UpdateRole(usersInfo);

//         if (updatedRole) {
//             return reply.status(200).send({ status: 'success', data: updatedRole });
//         } else {
//             return reply.status(404).send({ status: 'error', message: 'Role not found or update failed' });
//         }
//     } catch (error: any) {
//         logger.error({ userId: request.meta?.userId, error: "updateRole" }, "Update Role method error: " + JSON.stringify(error));
//         return reply.status(500).send({ message: "Internal server error" });
//     }
// }


public async getRoleById(request: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info({ userId: request.meta?.userId, init: "getRoleById" }, "getRoleById method called");
      
      const id = +(request.params as any).id;
      const roleInfo = await RoleRepo.getRoleById(id);

      return reply.status(200).send({ status: 'success', data: roleInfo || [] });
    } catch (error) {
      logger.error({ userId: request.meta?.userId, error: "getRoleById" }, "getRoleById method error: " + JSON.stringify(error));
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

//   public async getRoleByNameAndUser(request: FastifyRequest, reply: FastifyReply) {
//     try {
//       logger.info({ userId: request.meta?.userId, init: "getRoleByNameAndUser" }, "getRoleByNameAndUser method called");

//       const roleName = (request.params as any).name;
//       const userId = +(request.params as any).customerId;

//       const roleInfo = await RoleRepo.getRoleByNameAndUser(roleName, userId);
//       return reply.status(200).send({ status: 'success', data: roleInfo || [] });

//     } catch (error) {
//       logger.error({ userId: request.meta?.userId, error: "getRoleByNameAndUser" }, "getRoleByNameAndUser method error: " + JSON.stringify(error));
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   }

  public async updateRole(request: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info({ userId: request.meta?.userId, init: "UpdateRole" }, "Update Role method called");
       const roleId = (request.params as any).id;
      const params: any = request.body;
      params.updated_by = request.meta?.userId;
      params.updated_at = new Date();
       let roleInfo: any = await RoleRepo.getRoleById(roleId);
        roleInfo = { ...roleInfo, ...params }; 
        const updatedRole = await RoleRepo.updateRole(roleInfo)

    //   const updated = await RoleRepo.updateRole(params);
      if (updatedRole) {
        return reply.status(200).send({ status: 'success', message: 'Role Updated Successfully' });
      } else {
        return reply.status(404).send({ status: 'error', message: 'Role not found or update failed' });
      }

    } catch (error) {
      logger.error({ userId: request.meta?.userId, error: "UpdateRole" }, "Update Role method error: " + JSON.stringify(error));
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  public async deleteRole(request: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info({ userId: request.meta?.userId, init: "deleteRole" }, "Delete Role method called");

      const id = +(request.params as any).id;
      const result = await RoleRepo.deleteRole(id);

      if (result) {
        return reply.status(200).send({ status: 'success', message: 'Role deleted Successfully' });
      } else {
        return reply.status(404).send({ status: 'error', message: 'Role not found or deletion failed' });
      }

    } catch (error) {
      logger.error({ userId: request.meta?.userId, error: "deleteRole" }, "Delete Role method error: " + JSON.stringify(error));
      return reply.status(500).send({ message: "Internal server error" });
    }
}
}

export default new roleService();