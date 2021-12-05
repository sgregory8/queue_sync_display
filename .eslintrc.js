module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    ignorePatterns: ['*.d.ts'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    extends: ['plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.test.ts'],
            env: { 'jest/globals': true },
            plugins: ['jest'],
            extends: ['plugin:jest/all'],
        },
    ],
};
