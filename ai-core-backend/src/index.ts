// import fastify from 'fastify';
// import dotenv from 'dotenv';
// import { aiRoutes } from './routes/ai';
// import { authRoutes } from './routes/auth';
// import { healthRoutes } from './routes/health';
// import { errorHandler } from './middleware/errorHandler';
// import { authMiddleware } from './middleware/auth';

// dotenv.config();

// const server = fastify({
//   logger: {
//     level: 'info',
//     transport: {
//       target: 'pino-pretty'
//     }
//   }
// });

// // Register middleware
// server.register(authMiddleware);
// server.register(errorHandler);


// // Register routes
// server.register(healthRoutes, { prefix: '/health' });
// server.register(authRoutes, { prefix: '/auth' });
// server.register(aiRoutes, { prefix: '/ai' });

// // CORS configuration
// server.register(require('@fastify/cors'), {
//   origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
//   credentials: true
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Shutting down server gracefully...');
//   await server.close();
//   process.exit(0);
// });

// const start = async () => {
//   try {
//     const port = parseInt(process.env.PORT || '3001');
//     await server.listen({ port, host: '0.0.0.0' });
//     console.log(`🚀 AI Core Backend running on port ${port}`);
//   } catch (err) {
//     server.log.error(err);
//     process.exit(1);
//   }
// };

// start();

// import fastify from 'fastify';
// import dotenv from 'dotenv';
// import { aiRoutes } from './routes/ai';
// import { authRoutes } from './routes/auth';
// import { healthRoutes } from './routes/health';
// import { errorHandler } from './middleware/errorHandler';
// import { authMiddleware } from './middleware/auth';
// import { rootRoutes } from './routes/root';
// import path from 'path';  // Add this import for path module
// import fastifyStatic from '@fastify/static';  // Import the static plugin

// dotenv.config();

// const server = fastify({
//   logger: {
//     transport: {
//       target: 'pino-pretty',
//       options: {
//         colorize: true,  // Enables colored output
//         translateTime: 'HH:MM:ss',  // Custom timestamp format
//         ignore: 'pid,hostname'  // Ignores unnecessary fields
//       }
//     }
//   }
// });

// // Register middleware
// server.register(authMiddleware);
// server.register(errorHandler);
// server.register(rootRoutes);
// // Register routes
// server.register(healthRoutes, { prefix: '/health' });
// server.register(authRoutes, { prefix: '/auth' });
// server.register(aiRoutes, { prefix: '/ai' });

// // CORS configuration
// server.register(require('@fastify/cors'), {
//   origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
//   credentials: true
// });

// server.register(require('@fastify/static'), { root: path.join(__dirname, 'public') });

// server.setNotFoundHandler((request, reply) => {
//   reply.code(404).send({ error: 'Route not found', url: request.url });
// });

// server.register(fastifyStatic, {
//   root: path.join(__dirname, 'public'),  // Now path is defined
//   prefix: '/public/'  // Optional: Prefix for static routes
// });

// // Graceful shutdown handler
// process.on('SIGINT', async () => {
//   console.log('Shutting down server...');
//   await server.close();
//   process.exit(0);
// });

// const start = async () => {
//   try {
//     const port = parseInt(process.env.PORT || '3001');
//     await server.listen({ port, host: '0.0.0.0' });
//     console.log(`🚀 AI Core Backend running on port ${port}`);
//   } catch (err) {
//     server.log.error(err);
//     process.exit(1);
//   }
// };

// start();

import fastify from 'fastify';
import dotenv from 'dotenv';
import { aiRoutes } from './routes/ai';
import { authRoutes } from './routes/auth';
import { healthRoutes } from './routes/health';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { rootRoutes } from './routes/root';
import path from 'path';  // For handling file paths
import fastifyStatic from '@fastify/static';  // For serving static files

dotenv.config();

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,  // Enables colored output
        translateTime: 'HH:MM:ss',  // Custom timestamp format
        ignore: 'pid,hostname'  // Ignores unnecessary fields
      }
    }
  }
});

// Register middleware
server.register(authMiddleware);
server.register(errorHandler);

// Register routes
server.register(rootRoutes);
server.register(healthRoutes, { prefix: '/health' });
server.register(authRoutes, { prefix: '/auth' });
server.register(aiRoutes, { prefix: '/ai' });

// CORS configuration
server.register(require('@fastify/cors'), {
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true
});

// Register static file serving (single registration to avoid duplicates)
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),  // Path to your public folder
  prefix: '/public/',  // URL prefix for static assets
});

// Custom 404 handler
server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({ error: 'Route not found', url: request.url });
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await server.close();
  process.exit(0);
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 AI Core Backend running on port ${port}`);
    // console.log(process.env.GROK_API_KEY);
    // console.log(process.env.OPENROUTER_API_KEY)
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
