import { FastifyPluginCallback } from 'fastify';

export const authMiddleware: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.addHook('preHandler', async (request, reply) => {
    // Your auth logic here (e.g., check JWT)
    if (!request.headers.authorization) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
  done();
};
