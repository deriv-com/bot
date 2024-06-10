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
                @import "src/components/shared/styles/constants.scss";
                @import "src/components/shared/styles/themes.scss";
                @import "src/components/shared/styles/devices.scss";
                @import "src/components/shared/styles/fonts.scss";
                @import "src/components/shared/styles/mixins.scss";
                @import "src/components/shared/styles/reset.scss";
                @import "src/components/shared/styles/inline-icons.scss";
                @import "src/components/shared/styles/google-fonts.scss";
                @import "src/styles/mixins.scss";
            `,
            },
        },
    },
    server: {
        port: 8443,
    },
});
