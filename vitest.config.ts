import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                '.nuxt/**',
                'coverage/**',
                'tests/e2e/**'
            ]
        },
        exclude: [
            'node_modules/**',
            '.nuxt/**',
            'coverage/**',
            'tests/e2e/**'
        ],
        reporters: ['default'],
    },
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./', import.meta.url))
        }
    }
})
