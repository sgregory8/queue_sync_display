module.exports = {
    env: {
        node: true,
    },
    extends: [
        '../.eslintrc.js',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-var-requires': 0,
    },
};
