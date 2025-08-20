
import { FastifyRequest, FastifyReply } from 'fastify';
import UserRepository from '../models/repositories/user.repo';
import generator from "generate-password";
import common from "../helpers/utils/common";
import logger from '../middlewares/logger'
//import redisClient from '../config/redis';
import { integer } from 'aws-sdk/clients/cloudfront';

class FastifyUserService {
  // Get all users
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
    const query = request.query as any
      const users = await UserRepository.getAllUsers();
      console.log(users);
      return reply.status(200).send({ status: 'success', data: users });
    } catch (error) {
      return reply.status(500).send({ status: 'failed', message: 'Internal Server Error' });
    }
  }
  
  // async addUser(request: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     const params = request.body as any;
  //     await UserRepository.save(params);
  //     return reply.status(200).send({ status: 'success', message: 'User Created Successfully' });
  //   } catch (error) {
  //     return reply.status(500).send({ status: 'failed', message: 'Internal Server Error' });
  //   }
  // }
  async addUser(request: FastifyRequest, reply: FastifyReply) {
  try {
  logger.info({ params: '', init: "AddUser" }, "add user method called");
      let params: any = request.body;
      params.created_by = request.meta?.userId;
      let userInfo: any = await UserRepository.getUserByemail(params.email);
      if (userInfo && userInfo.email) {
        return reply.status(400).send({ status: 'Failed', message: "Email already exists" });
      }
      params.full_name = `${params.first_name || ''} ${params.last_name || ''}`.trim();
      let password: any = generator.generate({ length: 10, numbers: true });
      let userPassword = password;
      params.password = password;
      params.EncryptPassword = await common.stringToBinary64(password);
      await UserRepository.save(params);
      params.userPassword = userPassword
      //await EmailService.sendInvitation(params);
      return reply.status(200).send({ status: 'success', message: 'User Created Successfully' });
    } catch (error) {
          return reply.status(500).send({ status: 'failed', message: 'Internal Server Error' });
        }
      }
  public async getUserById(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: integer };
      const cacheKey:any = `user:${id}`;
      // Try to get from cache
      //const cached = await redisClient.get(cacheKey);
      //if (cached) {
      //  return res.status(200).send({ status: 'success', data: JSON.parse(cached) });
      //}
      // Not in cache, fetch from DB
      let userId: any = +id;
      let usersInfo: any = await UserRepository.getById(userId);
      if (usersInfo && usersInfo.id) {
        delete usersInfo.password;
        delete usersInfo.EncryptPassword;
        // Set cache
        //await redisClient.setEx(cacheKey, 3600, JSON.stringify(usersInfo)); // 1 hour
      } else {
        usersInfo = {};
      }
      res.status(200).send({ status: 'success', data: usersInfo });
    } catch (error) {
      logger.error({ params: '', error: "getUserById" }, "getUserById method error: " + JSON.stringify(error));
      return res.status(500).send({ status: "failed", message: "Internal Server Error" });
    }
  }

  public async getUserByoId(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: integer };
      const cacheKey:any = `user:${id}`;
      // Try to get from cache
      //const cached = await redisClient.get(cacheKey);
      //if (cached) {
      //  return res.status(200).send({ status: 'success', data: JSON.parse(cached) });
      //}
      // Not in cache, fetch from DB
      let userId: any = +id;
      let usersInfo: any = await UserRepository.getById(userId);
      if (usersInfo && usersInfo.id) {
        delete usersInfo.password;
        delete usersInfo.EncryptPassword;
        // Set cache
        //await redisClient.setEx(cacheKey, 3600, JSON.stringify(usersInfo)); // 1 hour
      } else {
        usersInfo = {};
      }
      res.status(200).send({ status: 'success', data: usersInfo });
    } catch (error) {
      logger.error({ params: '', error: "getUserById" }, "getUserById method error: " + JSON.stringify(error));
      return res.status(500).send({ status: "failed", message: "Internal Server Error" });
    }
  }

  public async getUserByEmail(req: FastifyRequest, res: FastifyReply) {
    try {
      console.log("getUserByEmail", req.params);
      const { email } = req.params as { email: string };
      const cacheKey:any = `user:${email}`;
      // Try to get from cache
      //const cached = await redisClient.get(cacheKey);
      //if (cached) {
      //  return res.status(200).send({ status: 'success', data: JSON.parse(cached) });
      //}
      // Not in cache, fetch from DB
      let usersInfo: any = await UserRepository.getUserByemail(email);
      if (usersInfo && usersInfo.id) {
        delete usersInfo.password;
        delete usersInfo.EncryptPassword;
        // Set cache
        //await redisClient.setEx(cacheKey, 3600, JSON.stringify(usersInfo)); // 1 hour
      } else {
        usersInfo = {};
      }
      res.status(200).send({ status: 'success', data: usersInfo });
    } catch (error) {
      logger.error({ params: '', error: "getUserByEmail" }, "getUserByEmail method error: " + JSON.stringify(error));
      return res.status(500).send({ status: "failed", message: "Internal Server Error" });
    }
  }
}

export default new FastifyUserService();