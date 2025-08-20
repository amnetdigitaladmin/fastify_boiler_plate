import { FastifyRequest, FastifyReply } from 'fastify';
import UserRepository  from '../models/repositories/user.repo';
import UserSessionsRepository  from '../models/repositories/userSessions.repo';
import logger from '../middlewares/logger';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import moment from 'moment';
import generator from "generate-password";
import { userType } from "../helpers/utils/enum";

class AADAuthService {
    public async(req: FastifyRequest, res: FastifyReply) {
        try {
            logger.info({ userEmail: (req.body as any).email, init: "Login"}, "login method called");
        } catch (error) {
            logger.error({ error: error }, "login method error");
        }
    }
}
export default new AADAuthService();