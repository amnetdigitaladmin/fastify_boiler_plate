import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";
import UserSessionsRepository from '../models/repositories/userSessions.repo';

declare module 'fastify' {
  interface FastifyRequest {
    meta?: {
      userId: string;
      roleId: number;
    };
  }
}

const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers['jwt'] as string;
  try {
    if (token) {
      let verifiedUser: any = await jwt.verify(token, process.env.JWT_SECRET_KEY!);
      if (verifiedUser) {
        request.meta = verifiedUser;
        request.meta = { ...verifiedUser, roleId: verifiedUser.roleId };
        const sessionActive = await UserSessionsRepository.isSessionActive(verifiedUser.userId);
        if (!sessionActive) {
          return reply.status(401).send({ message: 'Session Expired please login again' });
        }
      } else {
        const decoded: any = jwtDecode(token);
        const sessionDetails: any = await UserSessionsRepository.isSessionActive(decoded.userId);
        sessionDetails.id = +sessionDetails.id;
        sessionDetails.updated_by = '';
        sessionDetails.is_active = false;
        await UserSessionsRepository.save(sessionDetails);
        return reply.status(401).send({ message: 'Session Expired please login again' });
      }
    } else {
      return reply.status(401).send({ message: 'Token must be sent!' });
    }
  } catch (error) {
    console.log(error);
    return reply.status(401).send({ message: 'Invalid Token' });
  }
};

export default verifyToken;
