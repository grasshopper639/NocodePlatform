import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check route
  fastify.get('/', async (request, reply) => {
    // You can add custom checks here, e.g., database connection[2]
    return { status: 'ok', uptime: process.uptime() }; // Returns server uptime as an example[3]
  });
}
