import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [react(), svgr(), basicSsl()],
    server: {
        port: 8443,
    },
});
