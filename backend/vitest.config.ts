import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'secreto-solo-para-tests-1234567890',
      JWT_EXPIRES_IN: '15m',
    },
  },
});