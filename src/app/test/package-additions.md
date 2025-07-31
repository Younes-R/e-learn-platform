# Add these dependencies to your package.json devDependencies:

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "happy-dom": "^12.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## To run the tests:

1. Install the dependencies: `npm install`
2. Run tests: `npm test`
3. Run tests with UI: `npm run test:ui`
4. Run tests once: `npm run test:run`
5. Run with coverage: `npm run test:coverage`

## Test Framework Used:

**Vitest** - A fast unit test framework powered by Vite. It's designed specifically for modern JavaScript/TypeScript projects and works well with Next.js applications.

Key features:
- Native TypeScript support
- Fast execution with Vite's HMR
- Jest-compatible API
- Built-in code coverage
- Watch mode
- Snapshot testing support