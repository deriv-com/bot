import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],

    server: {
        https: {
            // TODO: replace with your own certificate
            key: fs.readFileSync(path.resolve(__dirname, './key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, './cert.pem')),
        },
        port: 8443,
    },
});
