import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './setup.ts',
        include: ['**/*.test.ts', '**/*.test.tsx']
    }
})