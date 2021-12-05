const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');

function cssLoaders(argv) {
    return [
        {
            loader: 'style-loader',
        },
        {
            loader: 'css-loader',
            options: {
                sourceMap: argv.mode === 'development',
            },
        },
    ];
}

/** @typedef {import('webpack').Configuration} Configuration */
/**
 * @param {'prod'|undefined} _ .
 * @param { any } argv .
 * @returns {Configuration} .
 */
module.exports = (/** @type {'prod'|undefined} */ _, /** @type {any} */ argv) => ({
    target: 'web',
    mode: 'production',
    entry: ['@babel/polyfill', './client/src/index.js'],
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: `static/[name].${argv.mode === 'production' ? '[contenthash]' : '[fullhash]'}.js`,
    },
    devServer: {
        static: path.resolve(__dirname, 'public'),
        port: 3000,
        hot: true,
        historyApiFallback: true, // send missing pages to `index.html`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: cssLoaders(argv),
            },
            // Sass modules
            {
                test: /\.s(a|c)ss$/,
                use: [
                    ...cssLoaders(argv),
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: argv.mode === 'development',
                        },
                    },
                ],
                include: /\.module\.s(a|c)ss$/,
            },
            // Plain Sass
            {
                test: /\.s(a|c)ss$/,
                use: [
                    ...cssLoaders(argv),
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: argv.mode === 'development',
                        },
                    },
                ],
                exclude: /\.module\.s(a|c)ss$/,
            },
            {
                test: /\.(woff(2)?|eot|ttf|svg|gif|png)$/,
                loader: 'file-loader',
                options: { name: 'static/[contenthash].[ext]' },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({}),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new HtmlPlugin({
            hash: true,
            filename: 'index.html',
            template: './client/src/index.html',
        }),
    ].filter(Boolean),
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/].*\.js$/,
                    chunks: 'all',
                },
            },
        },
        minimizer: [],
    },
    performance: {
        hints: false,
    },
    devtool: argv.mode === 'development' && 'inline-source-map',
});
