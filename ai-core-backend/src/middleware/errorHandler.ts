import { FastifyPluginCallback } from 'fastify';

export const errorHandler: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });
  done();
};
