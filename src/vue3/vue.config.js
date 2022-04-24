/*
 * @Author       : Evan.G
 * @Date         : 2021-08-26 11:34:46
 * @LastEditTime : 2022-01-19 16:15:42
 * @Description  :
 */
const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const Timestamp = new Date().getTime();

function resolve(dir) {
    return path.join(__dirname, dir);
}

function getProcessValue() {
    if (process.env.npm_config_argv)
        return {
            site: JSON.parse(process.env.npm_config_argv).original[1].split(
                ":"
            )[1],
        };
    else
        return {
            site: process.env.npm_lifecycle_event.split(":")[1],
        };
}


module.exports = {
    pages: {
        index: {
            entry: `src/${getProcessValue().site}/main.js`,
            template: "public/index.html",
            filename: "index.html",
            title: "demo项目",
        },
    },
    publicPath: "/",
    outputDir: `dist/${getProcessValue().site}`,
    devServer: {
        disableHostCheck: true,
        // proxy: {
        //     "/api": {
        //         target: "",
        //         changeOrigin: true,
        //         pathRewrite: { "^api": "" },
        //     },
        // },
        open: true,
        overlay: {
            warnings: false,
            errors: true,
        },
    },
    chainWebpack: (config) => {
        config.module.rules.delete("svg");
        config.module
            .rule("svg-sprite-loader")
            .test(/\.svg$/)
            .include.add(resolve(`src/${getProcessValue().site}/assets/svg`)) //处理svg目录
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            });
        config.resolve.alias.set("@", resolve(`src/${getProcessValue().site}`));
        config.resolve.alias.set("@@", resolve("src"));
        config.resolve.alias.set("@p", resolve("public"));
        config.plugins.delete("prefetch");
        config.resolve.symlinks(true);
        config.plugin("provide").use(webpack.ProvidePlugin, [
            {
                $: "jquery",
                jquery: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
            },
        ]);

        if (process.env.NODE_ENV === "production") {
            config.optimization
                .minimizer("js")
                .use(require.resolve("terser-webpack-plugin"), [
                    {
                        terserOptions: {
                            // 打包删掉注释
                            comments: true,
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                                // pure_funcs: ["console.log"],
                            },
                        },
                    },
                ]);
        } else {
            config.optimization.minimize(false);
        }
    },
    configureWebpack: {
        output: {
            filename: `js/[name].${Timestamp}.js`,
            chunkFilename: `js/[name].${Timestamp}.js`,
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery",
            }),
            new CompressionPlugin({
                // gzip压缩配置
                test: /\.(js|css)(\?.*)?$/i,
                threshold: 10240, // 对超过10kb的数据进行压缩
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                deleteOriginalAssets: false, // 是否删除原文件
                cache: false,
            }),
        ],
    },
    productionSourceMap: false,
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: false,
        // 开启 CSS source maps
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true,
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require("os").cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {
        iconPaths: {
            favicon32: "favicon.ico",
            favicon16: "favicon.ico",
            appleTouchIcon: "favicon.ico",
            maskIcon: "favicon.ico",
            msTileImage: "favicon.ico",
        },
    },
    // webpack-dev-server 相关配置
    // 第三方插件配置
    pluginOptions: {
        // ...
    },
};
