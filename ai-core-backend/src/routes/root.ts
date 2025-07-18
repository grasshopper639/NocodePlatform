import { FastifyInstance } from 'fastify';

export async function rootRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return { message: 'Welcome to No-Code Platform API', version: '1.0.0' };
  });
}
