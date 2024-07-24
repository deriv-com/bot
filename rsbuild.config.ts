import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
const path = require('path');

export default defineConfig({
    plugins: [
        pluginSass({
            sassLoaderOptions: {
                sourceMap: true,
                additionalData: `
                    @import "${path.resolve(__dirname, 'src/components/shared/styles/constants.scss')}";
                    @import "${path.resolve(__dirname, 'src/components/shared/styles/mixins.scss')}";
                    @import "${path.resolve(__dirname, 'src/components/shared/styles/fonts.scss')}";
                    @import "${path.resolve(__dirname, 'src/components/shared/styles/inline-icons.scss')}";
                    @import "${path.resolve(__dirname, 'src/components/shared/styles/devices.scss')}";
                    @import "${path.resolve(__dirname, 'src/components/shared/styles/themes.scss')}";
                `,
            },
        }),
        pluginReact(),
    ],
    source: {
        entry: {
            index: './src/main.tsx',
        },
        define: {
            'process.env': JSON.stringify(process.env),
        },
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@/external': path.resolve(__dirname, './src/external'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/constants': path.resolve(__dirname, './src/constants'),
        },
    },
    output: {
        copy: [
            {
                from: 'node_modules/@deriv/deriv-charts/dist/*',
                to: 'js/smartcharts/[name][ext]',
                globOptions: {
                    ignore: ['**/*.LICENSE.txt'],
                },
            },
            { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/*', to: 'assets/[name][ext]' },
            { from: path.join(__dirname, 'public') },
        ],
    },
    html: {
        template: './index.html',
    },
    tools: {
        rspack: {
            plugins: [],
            resolve: {},
            module: {
                rules: [
                    {
                        test: /\.xml$/,
                        exclude: /node_modules/,
                        use: 'raw-loader',
                    },
                ],
            },
        },
    },
});
