import { GrokClient, KimiClient } from './aiClients';
import { Model } from '../core/router';

export class AIClientManager {  // <-- Must be a class and exported
  private grokClient: GrokClient;
  private kimiClient: KimiClient;

  constructor() {
    this.grokClient = new GrokClient(process.env.GROK_API_KEY!);
    this.kimiClient = new KimiClient(process.env.OPENROUTER_API_KEY!);
  }

  async generateCode(model: Model, prompt: any): Promise<any> {
    switch (model) {
      case 'grok-4':
        return this.grokClient.generate(prompt);
      case 'kimi-k2':
        return this.kimiClient.generate(prompt);
      default:
        throw new Error(`Unsupported model: ${model}`);
    }
  }
}
