module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    globals: {
        Blockly: 'readonly',
        trackJs: 'readonly',
        dataLayer: 'readonly',
        goog: 'readonly',
        google: 'readonly',
        gapi: 'readonly',
        __webpack_public_path__: 'readonly',
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
    plugins: ['react', 'react-hooks', 'simple-import-sort', '@typescript-eslint'],
    rules: {
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
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
    ignorePatterns: ['node_modules/', 'dist/'],
};
