// import axios from 'axios';

// // Interface for a standardized response from any model
// interface AIResponse {
//   content: string;
//   usage: {
//     promptTokens: number;
//     completionTokens: number;
//     totalTokens: number;
//   };
// }

// // --- Client for Grok 4 ---
// export class GrokClient {
//   private apiKey: string;
//   private baseURL = 'https://api.x.ai/v1'; // Official xAI endpoint

//   constructor(apiKey: string) {
//     if (!apiKey) throw new Error("Grok API key is required.");
//     this.apiKey = apiKey;
//   }

//   async generate(prompt: any): Promise<AIResponse> {
//     try {
//       const response = await axios.post(
//         `${this.baseURL}/chat/completions`,
//         {
//           model: 'grok-4',
//           messages: prompt.messages,
//           max_tokens: prompt.maxTokens || 4000,
//           temperature: prompt.temperature || 0.7,
//           response_format: { type: 'json_object' }
//         },
//         {
//           headers: { 'Authorization': `Bearer ${this.apiKey}` }
//         }
//       );
//       return {
//         content: response.data.choices[0].message.content,
//         usage: response.data.usage
//       };
//     } catch (error: unknown) {
//     if (error instanceof Error) {
//             console.error('Grok API Error:', error.message);
//         } else if (typeof error === 'object' && error !== null && 'response' in error) {
//             console.error('Grok API Error:', (error as any).response?.data);
//         } else {
//             console.error('Grok API Error: Unknown error', error);
//         }
//         throw new Error('Grok API failed');
//     }
//   }
// }

// // --- Client for Kimi K2 via OpenRouter ---
// export class KimiClient {
//   private apiKey: string;
//   private baseURL = 'https://openrouter.ai/api/v1';

//   constructor(apiKey: string) {
//     if (!apiKey) throw new Error("OpenRouter API key is required for Kimi.");
//     this.apiKey = apiKey;
//   }

//   async generate(prompt: any): Promise<AIResponse> {
//     try {
//       const response = await axios.post(
//         `${this.baseURL}/chat/completions`,
//         {
//           model: 'moonshot/kimi-k2',
//           messages: prompt.messages,
//           max_tokens: prompt.maxTokens || 4000,
//           temperature: prompt.temperature || 0.7,
//           response_format: { type: 'json_object' }
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${this.apiKey}`,
//             'HTTP-Referer': 'https://your-app-domain.com', // Replace with your app's domain
//             'X-Title': 'My No-Code Platform'
//           }
//         }
//       );
//       return {
//         content: response.data.choices[0].message.content,
//         usage: response.data.usage
//       };
      
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             console.error('Kimi (OpenRouter) API Error:', error.message);
//         } else if (typeof error === 'object' && error !== null && 'response' in error) {
//             console.error('Kimi (OpenRouter) API Error:', (error as any).response?.data);
//         } else {
//             console.error('Kimi (OpenRouter) API Error: Unknown error', error);
//         }
//         throw new Error('Kimi API failed');
//     }
//   }
// }
import axios from 'axios';

// Interface for a standardized response from any model
interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// --- Client for Grok 4 ---
export class GrokClient {
  private apiKey: string;
  private baseURL = 'https://api.x.ai/v1'; // Official xAI endpoint

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("Grok API key is required.");
    this.apiKey = apiKey;
  }

  async generate(prompt: { messages: { role: string; content: string }[]; maxTokens?: number; temperature?: number }): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'grok-4',
          messages: prompt.messages,
          max_tokens: prompt.maxTokens || 4000,
          temperature: prompt.temperature || 0.7,
          response_format: { type: 'json_object' }
        },
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }
      );
      console.log('Grok API Response Status:', response.status); // Added logging for debugging
      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Grok API Error:', error.message);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        console.error('Grok API Error:', (error as any).response?.data, 'Status:', (error as any).response?.status);
      } else {
        console.error('Grok API Error: Unknown error', error);
      }
      throw new Error('Grok API failed');
    }
  }
}

// --- Client for Kimi K2 via OpenRouter ---
export class KimiClient {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("OpenRouter API key is required for Kimi.");
    this.apiKey = apiKey;
  }

  async generate(prompt: { messages: { role: string; content: string }[]; maxTokens?: number; temperature?: number }): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'moonshotai/kimi-k2',
          messages: prompt.messages,
          max_tokens: prompt.maxTokens || 4000,
          temperature: prompt.temperature || 0.7,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://your-app-domain.com', // Replace with your app's domain
            'X-Title': 'My No-Code Platform'
          }
        }
      );
      console.log('Kimi API Response Status:', response.status); // Added logging for debugging
      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Kimi (OpenRouter) API Error:', error.message);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        console.error('Kimi (OpenRouter) API Error:', (error as any).response?.data, 'Status:', (error as any).response?.status);
      } else {
        console.error('Kimi (OpenRouter) API Error: Unknown error', error);
      }
      throw new Error('Kimi API failed');
    }
  }
}
