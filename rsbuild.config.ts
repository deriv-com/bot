import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';

const path = require('path');

export default defineConfig({
    plugins: [
        pluginSass({
            sassLoaderOptions: {
                sourceMap: true,
                sassOptions: {
                    // includePaths: [path.resolve(__dirname, 'src')],
                },
                // additionalData: `@use "${path.resolve(__dirname, 'src/components/shared/styles')}" as *;`,
            },
            exclude: /node_modules/,
        }),
        pluginReact(),
        pluginBasicSsl(),
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
            '@/stores': path.resolve(__dirname, './src/stores'),
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
            { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/fonts/*', to: 'assets/fonts/[name][ext]' },
            { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/shaders/*', to: 'assets/shaders/[name][ext]' },
            { from: path.join(__dirname, 'public') },
        ],
    },
    html: {
        template: './index.html',
    },
    server: {
        port: 8443,
        compress: true,
    },
    dev: {
        hmr: true,
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
