import { FastifyInstance } from 'fastify';

export async function authRoutes(fastify: FastifyInstance) {
  // Example login route
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };
    // TODO: Implement actual auth logic (e.g., check database)
    if (username === 'test' && password === 'test') {
      return { token: 'fake-jwt-token' };
    }
    return reply.code(401).send({ error: 'Invalid credentials' });
  });

  // Example register route
  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };
    // TODO: Save to database
    return { message: 'User registered successfully' };
  });
}
