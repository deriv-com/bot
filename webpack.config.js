const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

const IS_RELEASE =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

module.exports = {
    entry: './src/main.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'auto',
    },
    env: {
        browser: true,
        node: true,
    },
    mode: IS_RELEASE ? 'production' : 'development',
    devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',
    target: 'web',
    module: {
        rules: [
            {
                // https://github.com/webpack/webpack/issues/11467
                test: /\.m?js/,
                include: /node_modules/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: !IS_RELEASE,
                            url: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: !IS_RELEASE },
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: require(path.resolve(__dirname, 'src/components/shared/styles/index.js')),
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'bot-sprite.svg',
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [{ removeUselessStrokeAndFill: false }, { removeUnknownsAndDefaults: false }],
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    rootMode: 'upward',
                },
            },
            {
                test: /\.xml$/,
                exclude: /node_modules/,
                use: 'raw-loader',
            },
        ],
    },
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@/external': path.resolve(__dirname, './src/external'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/constants': path.resolve(__dirname, './src/constants'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin()],
        fallback: {
            url: require.resolve('url/'), // Add this line to include the 'url' polyfill
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/@deriv/deriv-charts/dist/*', to: 'js/smartcharts/[name][ext]' },
                { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/*', to: 'assets/[name][ext]' },
                { from: path.join(__dirname, 'public'), to: '' },
            ],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 8444,
        hot: true,
    },
};
