import { TaskRequest, Model } from './router';

interface PromptExample {
  user: string;
  assistant: string;
}

interface PromptTemplate {
  system: string;
  examples: PromptExample[];
}

export class PromptManager {
  private templates: Record<Model, Record<string, PromptTemplate>> = {
    'kimi-k2': {
      'frontend': {
        system: `You are an expert React developer specializing in modern frontend development.
        Your task is to generate clean, functional, and responsive React components using TypeScript and Tailwind CSS.
        
        IMPORTANT RULES:
        - ALWAYS respond with a JSON object containing a 'jsx' key
        - Generate self-contained functional components
        - Use modern React hooks and patterns
        - Ensure components are fully responsive
        - Include proper TypeScript types
        - Follow accessibility best practices
        - The user is likely non-technical, so interpret requests generously`,
        examples: [
          {
            user: "Create a pricing card component with title, price, and features list",
            assistant: `{
              "jsx": "import React from 'react';\\n\\ninterface PricingCardProps {\\n  title: string;\\n  price: string;\\n  features: string[];\\n}\\n\\nconst PricingCard: React.FC<PricingCardProps> = ({ title, price, features }) => {\\n  return (\\n    <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow'>\\n      <h3 className='text-xl font-bold text-gray-900 mb-2'>{title}</h3>\\n      <div className='text-3xl font-bold text-blue-600 mb-4'>{price}</div>\\n      <ul className='space-y-2'>\\n        {features.map((feature, index) => (\\n          <li key={index} className='flex items-center text-gray-700'>\\n            <svg className='w-4 h-4 text-green-500 mr-2' fill='currentColor' viewBox='0 0 20 20'>\\n              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd'/>\\n            </svg>\\n            {feature}\\n          </li>\\n        ))}\\n      </ul>\\n    </div>\\n  );\\n};\\n\\nexport default PricingCard;"
            }`
          }
        ]
      }
    },
    'grok-4': {
      'backend': {
        system: `You are an expert backend developer specializing in Node.js, TypeScript, and API development.
        Your task is to generate secure, scalable, and well-structured backend code.
        
        IMPORTANT RULES:
        - ALWAYS respond with a JSON object containing appropriate keys (e.g., 'javascript', 'typescript', 'api')
        - Follow security best practices
        - Include proper error handling
        - Use modern async/await patterns
        - Include type definitions where applicable
        - Consider scalability and performance
        - The user may be non-technical, so provide clear, working solutions`,
        examples: [
          {
            user: "Create an API endpoint for user authentication with JWT",
            assistant: `{
              "typescript": "import { FastifyRequest, FastifyReply } from 'fastify';\\nimport jwt from 'jsonwebtoken';\\nimport bcrypt from 'bcryptjs';\\n\\ninterface AuthRequest {\\n  email: string;\\n  password: string;\\n}\\n\\nexport async function loginHandler(\\n  request: FastifyRequest<{ Body: AuthRequest }>,\\n  reply: FastifyReply\\n) {\\n  try {\\n    const { email, password } = request.body;\\n    \\n    // Validate input\\n    if (!email || !password) {\\n      return reply.status(400).send({ error: 'Email and password required' });\\n    }\\n    \\n    // Find user in database (pseudo-code)\\n    const user = await findUserByEmail(email);\\n    if (!user) {\\n      return reply.status(401).send({ error: 'Invalid credentials' });\\n    }\\n    \\n    // Verify password\\n    const isValid = await bcrypt.compare(password, user.hashedPassword);\\n    if (!isValid) {\\n      return reply.status(401).send({ error: 'Invalid credentials' });\\n    }\\n    \\n    // Generate JWT token\\n    const token = jwt.sign(\\n      { userId: user.id, email: user.email },\\n      process.env.JWT_SECRET!,\\n      { expiresIn: '24h' }\\n    );\\n    \\n    return reply.send({\\n      token,\\n      user: {\\n        id: user.id,\\n        email: user.email,\\n        name: user.name\\n      }\\n    });\\n  } catch (error) {\\n    return reply.status(500).send({ error: 'Internal server error' });\\n  }\\n}"
            }`
          }
        ]
      },
      'debug': {
        system: `You are an expert debugging assistant specializing in identifying and fixing code issues.
        Your task is to analyze error messages, code snippets, and provide clear solutions.
        
        IMPORTANT RULES:
        - ALWAYS respond with a JSON object containing 'analysis', 'solution', and 'fixedCode' keys
        - Provide clear explanations of what went wrong
        - Offer specific, actionable solutions
        - Include corrected code when applicable
        - Consider multiple potential causes
        - Suggest preventive measures`,
        examples: [
          {
            user: "I'm getting 'Cannot read property 'map' of undefined' error in my React component",
            assistant: `{
              "analysis": "This error occurs when you're trying to use the .map() method on a variable that is undefined or null. Most commonly happens when: 1) Data hasn't loaded yet from an API call, 2) The data structure is different than expected, 3) The prop wasn't passed correctly to the component.",
              "solution": "Add proper null/undefined checks before using .map(). Use optional chaining (?.) or provide default values. Ensure data is loaded before rendering.",
              "fixedCode": "// Instead of: items.map(item => <div>{item.name}</div>)\\n\\n// Use one of these approaches:\\n\\n// Option 1: Optional chaining with fallback\\n{items?.map(item => <div key={item.id}>{item.name}</div>) || <div>No items</div>}\\n\\n// Option 2: Default empty array\\n{(items || []).map(item => <div key={item.id}>{item.name}</div>)}\\n\\n// Option 3: Conditional rendering\\n{items && items.length > 0 ? (\\n  items.map(item => <div key={item.id}>{item.name}</div>)\\n) : (\\n  <div>Loading...</div>\\n)}"
            }`
          }
        ]
      }
    }
  };

  public buildPrompt(request: TaskRequest, model: Model): any {
    const taskType = request.taskType === 'auto' ? 'frontend' : request.taskType;
    const template = this.templates[model][taskType];
    
    if (!template) {
      throw new Error(`No template found for model ${model} and task type ${taskType}`);
    }

    const messages = [
      { role: 'system', content: template.system },
      ...template.examples.flatMap(example => [
        { role: 'user', content: example.user },
        { role: 'assistant', content: example.assistant }
      ]),
      { role: 'user', content: this.enhancePrompt(request) }
    ];

    return {
      messages,
      maxTokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7
    };
  }

  private enhancePrompt(request: TaskRequest): string {
    let enhanced = request.prompt;
    
    if (request.context) {
      enhanced = `Context: ${request.context}\n\nTask: ${enhanced}`;
    }

    return enhanced;
  }
}

export const promptManager = new PromptManager();
