import { z } from 'zod';

// Schema definitions for different output types
const CodeOutputSchema = z.object({
  jsx: z.string().optional(),
  html: z.string().optional(),
  css: z.string().optional(),
  javascript: z.string().optional(),
  typescript: z.string().optional(),
  api: z.string().optional(),
  error: z.string().optional()
});

const DebugOutputSchema = z.object({
  analysis: z.string(),
  solution: z.string(),
  fixedCode: z.string().optional(),
  suggestions: z.array(z.string()).optional()
});

export type CodeOutput = z.infer<typeof CodeOutputSchema>;
export type DebugOutput = z.infer<typeof DebugOutputSchema>;

export class OutputParser {
  private sanitizeCode(code: string): string {
    // Remove potential security risks
    const dangerousPatterns = [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /document\.write/gi,
      /innerHTML\s*=/gi,
      /dangerouslySetInnerHTML/gi
    ];

    let sanitized = code;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '// REMOVED: Potentially dangerous code');
    });

    return sanitized;
  }

  private validateCodeStructure(code: string, language: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    switch (language) {
      case 'jsx':
        if (!code.includes('React') && !code.includes('import')) {
          errors.push('JSX code should include React import');
        }
        if (!code.includes('export')) {
          errors.push('JSX code should export the component');
        }
        break;
      case 'typescript':
        if (!code.includes('function') && !code.includes('const') && !code.includes('class')) {
          errors.push('TypeScript code should contain function, const, or class declarations');
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  public parseCodeOutput(response: string): CodeOutput {
    try {
      // Clean up the response
      const cleanResponse = response.trim();
      
      // Try to parse as JSON
      const parsed = JSON.parse(cleanResponse);
      
      // Validate against schema
      const validated = CodeOutputSchema.parse(parsed);
      
      // Sanitize all code fields
      const sanitized: CodeOutput = {};
      Object.entries(validated).forEach(([key, value]) => {
        if (typeof value === 'string' && key !== 'error') {
          sanitized[key as keyof CodeOutput] = this.sanitizeCode(value);
        } else {
          sanitized[key as keyof CodeOutput] = value;
        }
      });
      
      return sanitized;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to parse AI response:', error.message);
      } else {
        console.error('Failed to parse AI response: Unknown error', error);
      }
      
      // Fallback: try to extract code blocks using regex
      const cleanResponse = response.trim();  // Declare and clean the response
      const codeBlockRegex = /``````/g;  // Define regex for code blocks
      const matches = [...cleanResponse.matchAll(codeBlockRegex)];
      
      if (matches.length > 0) {
        const fallbackOutput: CodeOutput = {};
        matches.forEach(match => {
          const language = match[1] || 'javascript';
          const code = match[2];
          
          switch (language.toLowerCase()) {
            case 'jsx':
            case 'react':
              fallbackOutput.jsx = this.sanitizeCode(code);
              break;
            case 'javascript':
            case 'js':
              fallbackOutput.javascript = this.sanitizeCode(code);
              break;
            case 'typescript':
            case 'ts':
              fallbackOutput.typescript = this.sanitizeCode(code);
              break;
            case 'html':
              fallbackOutput.html = this.sanitizeCode(code);
              break;
            case 'css':
              fallbackOutput.css = this.sanitizeCode(code);
              break;
          }
        });
        
        return fallbackOutput;
      }
      
      return { error: 'Failed to parse AI response. Please try again.' };
    }
  }

  public parseDebugOutput(response: string): DebugOutput {
    try {
      const parsed = JSON.parse(response.trim());
      return DebugOutputSchema.parse(parsed);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to parse debug response:', error.message);
      } else {
        console.error('Failed to parse debug response: Unknown error', error);
      }
      return {
        analysis: 'Failed to parse debug response',
        solution: 'Please try rephrasing your question or provide more context',
        error: 'Parser error occurred'
      } as DebugOutput;
    }
  }

  public validateOutput(output: CodeOutput): { valid: boolean; errors: string[] } {
    const allErrors: string[] = [];
    
    Object.entries(output).forEach(([key, value]) => {
      if (typeof value === 'string' && key !== 'error') {
        const validation = this.validateCodeStructure(value, key);
        if (!validation.valid) {
          allErrors.push(...validation.errors);
        }
      }
    });
    
    return { valid: allErrors.length === 0, errors: allErrors };
  }
}

export const outputParser = new OutputParser();
