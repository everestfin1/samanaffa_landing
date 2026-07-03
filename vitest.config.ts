import { defineConfig } from 'vitest/config';
import path from 'path';

/** Dummy URL — tests must not require a live Postgres instance at import time. */
const TEST_DATABASE_URL =
  'postgresql://test:test@127.0.0.1:5432/test?sslmode=disable';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
