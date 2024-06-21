import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { viteRequire } from 'vite-require';
import tsconfigPaths from 'vite-tsconfig-paths';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [
        react(),
        svgr(),
        basicSsl(),
        tsconfigPaths(),
        viteRequire(),
        {
            name: 'xml',
            transform(code, id) {
                if (id.endsWith('.xml')) {
                    return {
                        code: `export default ${JSON.stringify(code)};`,
                        map: null,
                    };
                }
            },
        },
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @import "src/components/shared/styles/constants";
                @import "src/components/shared/styles/themes";
                @import "src/components/shared/styles/devices";
                @import "src/components/shared/styles/fonts";
                @import "src/components/shared/styles/mixins";
                @import "src/components/shared/styles/reset";
                @import "src/components/shared/styles/inline-icons";
                @import "src/components/shared/styles/google-fonts";
                @import "src/styles/mixins";
            `,
            },
        },
    },
    server: {
        port: 8443,
    },
});
