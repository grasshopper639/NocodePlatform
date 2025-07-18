import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { router, TaskRequest } from '../core/router';
import { promptManager } from '../core/promptManager';
import { outputParser } from '../core/parser';
import { AIClientManager } from '../clients/aiClientManager'; // Updated import path (ensure this matches your structure)

export async function aiRoutes(fastify: FastifyInstance) {
  // Generate code endpoint
  fastify.post('/generate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const aiClientManager = new AIClientManager(); // Instantiation moved here to resolve constructor error

      // Validate request
      const taskRequest = router.validateRequest(request.body);
      
      // Route to appropriate model
      const routing = router.selectModel(taskRequest);
      
      // Build prompt
      const prompt = promptManager.buildPrompt(taskRequest, routing.model);
      
      // Generate code
      const response = await aiClientManager.generateCode(routing.model, prompt);
      
      // Parse output
      const parsedOutput = outputParser.parseCodeOutput(response.content);
      
      // Validate output
      const validation = outputParser.validateOutput(parsedOutput);
      
      return reply.send({
        success: true,
        data: {
          output: parsedOutput,
          routing: routing,
          usage: response.usage,
          validation: validation
        }
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  // Debug code endpoint
  fastify.post('/debug', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const aiClientManager = new AIClientManager(); // Instantiation moved here to resolve constructor error

      const debugRequest = {
        ...request.body as any,
        taskType: 'debug' as const
      };
      
      const taskRequest = router.validateRequest(debugRequest);
      const routing = router.selectModel(taskRequest);
      const prompt = promptManager.buildPrompt(taskRequest, routing.model);
      
      const response = await aiClientManager.generateCode(routing.model, prompt);
      const parsedOutput = outputParser.parseDebugOutput(response.content);
      
      return reply.send({
        success: true,
        data: {
          output: parsedOutput,
          routing: routing,
          usage: response.usage
        }
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  // Model capabilities endpoint
  fastify.get('/capabilities', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      success: true,
      data: {
        models: ['grok-4', 'kimi-k2'],
        taskTypes: ['frontend', 'backend', 'debug', 'auto'],
        features: {
          'grok-4': {
            maxTokens: 256000,
            supportsImages: true,
            strengths: ['backend', 'debug', 'complex-reasoning']
          },
          'kimi-k2': {
            maxTokens: 128000,
            supportsImages: false,
            strengths: ['frontend', 'ui', 'components']
          }
        }
      }
    });
  });
}
