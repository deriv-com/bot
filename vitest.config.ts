import path from 'path';
import svgr from 'vite-plugin-svgr';
import { defaultExclude, defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react(), svgr()],
    test: {
        include: ['src/**/*.spec.*'],
        exclude: [...defaultExclude],
        server: {
            deps: {
                inline: ['@deriv-com'],
            },
        },
        environment: 'jsdom',
        globals: true,
        setupFiles: [path.resolve(__dirname, 'vitest-setup/setup.ts')],
    },
});
