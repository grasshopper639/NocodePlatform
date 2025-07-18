import { z } from 'zod';

// Model capabilities configuration
const modelCapabilities = {
  'kimi-k2': {
    strengths: ['react', 'vue', 'angular', 'tailwind', 'css', 'html', 'frontend', 'ui', 'ux', 'component', 'website', 'animation', 'responsive'],
    costPerToken: 0.0001,
    maxTokens: 128000,
    supportsImages: false
  },
  'grok-4': {
    strengths: ['javascript', 'typescript', 'python', 'java', 'logic', 'algorithm', 'backend', 'api', 'debug', 'error', 'database', 'sql', 'complex-reasoning'],
    costPerToken: 0.0002,
    maxTokens: 256000,
    supportsImages: true
  }
};

export type Model = keyof typeof modelCapabilities;
export type TaskType = 'frontend' | 'backend' | 'debug' | 'auto';

const TaskSchema = z.object({
  prompt: z.string().min(1),
  taskType: z.enum(['frontend', 'backend', 'debug', 'auto']),
  context: z.string().optional(),
  maxTokens: z.number().optional(),
  temperature: z.number().min(0).max(1).optional()
});

export type TaskRequest = z.infer<typeof TaskSchema>;

export class IntelligentRouter {
  private getKeywordScore(prompt: string, keywords: string[]): number {
    const lowerPrompt = prompt.toLowerCase();
    const matches = keywords.filter(keyword => lowerPrompt.includes(keyword));
    return matches.length / keywords.length;
  }

  private estimateCost(prompt: string, model: Model): number {
    const tokenCount = prompt.split(' ').length * 1.3; // Rough estimation
    return tokenCount * modelCapabilities[model].costPerToken;
  }

  public selectModel(request: TaskRequest): {
    model: Model;
    reasoning: string;
    estimatedCost: number;
  } {
    const { prompt, taskType } = request;

    // Explicit task type routing
    if (taskType === 'frontend') {
      return {
        model: 'kimi-k2',
        reasoning: 'Explicit frontend task - Kimi K2 specialized for UI/UX',
        estimatedCost: this.estimateCost(prompt, 'kimi-k2')
      };
    }

    if (taskType === 'backend' || taskType === 'debug') {
      return {
        model: 'grok-4',
        reasoning: 'Backend/debug task - Grok 4 excels at complex logic',
        estimatedCost: this.estimateCost(prompt, 'grok-4')
      };
    }

    // Auto-routing based on content analysis
    const kimiScore = this.getKeywordScore(prompt, modelCapabilities['kimi-k2'].strengths);
    const grokScore = this.getKeywordScore(prompt, modelCapabilities['grok-4'].strengths);

    if (kimiScore > grokScore) {
      return {
        model: 'kimi-k2',
        reasoning: `Frontend keywords detected (score: ${kimiScore.toFixed(2)})`,
        estimatedCost: this.estimateCost(prompt, 'kimi-k2')
      };
    }

    return {
      model: 'grok-4',
      reasoning: `Default to Grok 4 for general/complex tasks (score: ${grokScore.toFixed(2)})`,
      estimatedCost: this.estimateCost(prompt, 'grok-4')
    };
  }

  public validateRequest(request: any): TaskRequest {
    return TaskSchema.parse(request);
  }
}

export const router = new IntelligentRouter();
