import { router, TaskRequest } from './router'; // Import the router instance

describe('IntelligentRouter Class', () => {

  // Test suite for the selectModel method
  describe('selectModel method', () => {

    it('should select kimi-k2 for an explicit frontend task type', () => {
      // The method now expects a single request object
      const request: TaskRequest = { prompt: "build me a button", taskType: 'frontend' };
      
      // We check the 'model' property of the returned object
      expect(router.selectModel(request).model).toBe('kimi-k2');
    });

    it('should select grok-4 for an explicit backend task type', () => {
      const request: TaskRequest = { prompt: "create an api endpoint", taskType: 'backend' };
      expect(router.selectModel(request).model).toBe('grok-4');
    });

    it('should select grok-4 for an explicit debug task type', () => {
      const request: TaskRequest = { prompt: "why is my code not working?", taskType: 'debug' };
      expect(router.selectModel(request).model).toBe('grok-4');
    });

    it('should fallback to keyword analysis for UI-related prompts when taskType is auto', () => {
      const request: TaskRequest = { 
        prompt: "I want a responsive React component for a navigation bar.", 
        taskType: 'auto' 
      };
      expect(router.selectModel(request).model).toBe('kimi-k2');
    });

    it('should fallback to keyword analysis for logic-related prompts when taskType is auto', () => {
      const request: TaskRequest = { 
        prompt: "Write a Python script for data processing and database insertion.", 
        taskType: 'auto' 
      };
      expect(router.selectModel(request).model).toBe('grok-4');
    });

    it('should default to grok-4 if no strong keywords are found', () => {
      const request: TaskRequest = { 
        prompt: "Tell me about the history of computing.", 
        taskType: 'auto' 
      };
      expect(router.selectModel(request).model).toBe('grok-4');
    });
  });

  // Test suite for the validateRequest method
  describe('validateRequest method', () => {
    
    it('should successfully validate a correct request object', () => {
      const validRequest = { prompt: 'test', taskType: 'frontend' };
      // 'toThrow' is used to assert that a function does NOT throw an error
      expect(() => router.validateRequest(validRequest)).not.toThrow();
    });

    it('should throw an error for a request with a missing prompt', () => {
      const invalidRequest = { taskType: 'frontend' };
      // We expect this call to throw an error because the prompt is missing
      expect(() => router.validateRequest(invalidRequest)).toThrow();
    });

    it('should throw an error for a request with an invalid taskType', () => {
      const invalidRequest = { prompt: 'test', taskType: 'invalid_type' };
      expect(() => router.validateRequest(invalidRequest)).toThrow();
    });
  });
});
