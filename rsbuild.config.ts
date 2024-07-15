import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
const path = require('path');
const IS_RELEASE =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

export default defineConfig({
    plugins: [
        pluginSass({
            sassLoaderOptions: {
                sourceMap: true,
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
    tools: {
        rspack: {
            plugins: [],
            resolve: {},
            module: {
                rules: [
                    {
                        test: /\.(s*)css$/,
                        use: [
                            {
                                loader: 'sass-loader',
                                options: { sourceMap: !IS_RELEASE },
                            },
                            {
                                loader: 'sass-resources-loader',
                                options: {
                                    resources: require(
                                        path.resolve(__dirname, 'src/components/shared/styles/index.js')
                                    ),
                                },
                            },
                        ],
                    },
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
