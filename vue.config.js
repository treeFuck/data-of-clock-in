const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    publicPath: './',
    lintOnSave: process.env.NODE_ENV !== 'production',
    productionSourceMap: false,
    configureWebpack: {
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            pure_funcs: ['console.log', 'console.debug']//移除console
                        }
                    }
                })
            ]
        },
    },
}