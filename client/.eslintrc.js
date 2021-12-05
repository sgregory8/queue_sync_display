module.exports = {
    env: {
        browser: true,
        commonjs: true,
    },
    extends: ['../.eslintrc.js', 'plugin:react/recommended'],
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
