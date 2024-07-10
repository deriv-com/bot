const webpackConfig = require('./webpack.config');

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    globals: {
        Blockly: false,
        trackJs: false,
        jest: false,
        dataLayer: false,
        goog: false,
        google: false,
        gapi: false,
        __webpack_public_path__: false,
        window: true,
        performance: true,
        process: true,
        document: true,
        console: true,
        DocumentFragment: true,
        Event: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig },
        },
    },
    plugins: ['simple-import-sort', '@typescript-eslint'],
    rules: {
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
    },
    overrides: [
        {
            files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
            rules: {
                'simple-import-sort/imports': [
                    'warn',
                    {
                        groups: [
                            [
                                'public-path',
                                // `react` first, then packages starting with a character
                                '^react$',
                                '^[a-z]',
                                // Packages starting with `@`
                                '^@',
                                // Packages starting with `~`
                                '^~',
                                '^Components',
                                '^Constants',
                                '^Utils',
                                '^Types',
                                '^Stores',
                                // Imports starting with `../`
                                '^\\.\\.(?!/?$)',
                                '^\\.\\./?$',
                                // Imports starting with `./`
                                '^\\./(?=.*/)(?!/?$)',
                                '^\\.(?!/?$)',
                                '^\\./?$',
                                // Style imports
                                '^.+\\.s?css$',
                                // Side effect imports
                                '^\\u0000',
                                // Delete the empty line copied as the next line of the last import
                                '\\s*',
                            ],
                        ],
                    },
                ],
            },
        },
    ],
    ignorePatterns: ['node_modules/', 'dist/', '**/webpack.config.js'],
};
