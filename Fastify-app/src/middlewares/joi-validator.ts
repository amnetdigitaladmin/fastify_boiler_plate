import { FastifyRequest, FastifyReply } from 'fastify';
import { ObjectSchema } from 'joi';

// Fastify-compatible validator for payload objects
export const ValidateJoi = (schema: ObjectSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await schema.validateAsync(request.body);
    } catch (error: any) {
      return reply.status(400).send({ error: error.details[0].message });
    }
  };
};