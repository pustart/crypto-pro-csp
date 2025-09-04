let executionFlow: Record<string | symbol, unknown> = {};

Object.defineProperty(window, 'cadesplugin', {
  writable: true,
  value: {
    LOG_LEVEL_ERROR: 1,
    set_log_level: jest.fn(),
    getLastError: jest.fn(),
    CreateObjectAsync: jest.fn(),

    __defineExecutionFlow: (newExecutionFlow: Record<string | symbol, unknown>): void => {
      executionFlow = newExecutionFlow;
    },

    async_spawn: jest.fn((generatorFn: () => Generator) => {
      const generator = generatorFn();
      let result = generator.next();

      while (!result.done) {
        const key = String(result.value);
        result = generator.next(executionFlow[key]);
      }

      return result.value;
    }),
  },
});
