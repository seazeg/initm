/*
 * @Author       : Evan.G
 * @Date         : 2023-01-10 16:50:23
 * @LastEditTime : 2023-01-11 16:27:42
 * @Description  :
 * @FilePath     : /seazeg.github.io/Users/geng/Project/Person/initm/src/gulp/cli/config.js
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

const PATH_CONFIG = {
    entry: {
        html: "src/pages/**/*.{html,shtml,htm}",
        styles: [
            "src/pages/**/*.{less,css}",
            "!src/**/*.min.{less,css}",
            "!src/**/*.ignore.{less,css}",
        ],
        script: [
            "src/pages/**/*.js",
            "!src/**/*.min.js",
            "!src/**/*.ignore.js",
        ],
        images: "src/pages/**/res/*.{png,jpg,gif,svg,bmp,jpeg,webp}",
        media: "src/pages/**/res/*.{mp4,m3u8,mov}",
        fonts: "src/fonts/**/*.{ttf,woff,woff2,eot}",
        libs: "src/libs/**/*.*",
    },
    export: {
        dev: {
            root: "dist/",
            html: "dist/",
            styles: "dist/images/",
            script: "dist/images/",
            images: "dist/images/",
            media: "dist/images/",
            fonts: "dist/images/",
            libs: "dist/images/",
        },
        build: {
            root: "build/",
            html: "build/",
            styles: "build/images/",
            script: "build/images/",
            images: "build/images/",
            media: "build/images/",
            fonts: "build/images/",
            libs: "build/images/",
        },
    },
};

const USE_CONFIG = {
    useEslint: false,
    useWebpack: false,
    useBabel: true,
    useProxy: false,
};

const TASK = {
    DEV: {
        MAIN: "dev",
        CLEAN: "dev-clean",
        HTML: "dev-html",
        STYLE: {
            MAIN: "dev-css",
            CONCAT: "dev-css-concat", // css合并
        },
        SCRIPT: {
            MAIN: "dev-js",
            CONCAT: "dev-js-concat", // JS合并
        },
        IMAGE: {
            MAIN: "dev-image",
            base64: "dev-base64",
        },
        FONT: "dev-font",
        MEDIA: "dev-media",
        LIBS: "dev-libs",
        BROWSER_SYNC: "browser-sync", // 浏览器同步
        PROXY: "PROXY", // 监听
    },
    BUILD: {
        MAIN: "build",
        CLEAN: "build-clean",
        HTML: "build-html",
        STYLE: {
            CSS: "build-css",
            LESS: "build-less", // less编译
        },
        SCRIPT: {
            MAIN: "build-js",
            UGLIFY: "build-uglify", // JS压缩
            CONCAT: "build-concat", // JS合并
        },
        IMAGE: {
            MAIN: "build-image",
            IMAGE_MIN: "build-image-min",
            base64: "build-base64",
        },
        FONT: {
            MAIN: "build-font",
        },
        MEDIA: {
            MAIN: "build-media",
        },
        LIBS: {
            MAIN: "build-libs",
        },
    },
};

const SERVER = {
    baseDir: "dist/",
    port: 9527,
    directory: true,
    watchDir: ["src/*.*", "src/**/*.*"],
    proxy: USE_CONFIG.useProxy
        ? [
              createProxyMiddleware("/api", {
                  target: "http://www.baidu.com", // 目标服务器地址
                  changeOrigin: true, // 允许跨域
              }),
          ]
        : [],
};

const BASE64_CONFIG = {
    // gulp-base64 配置文件
    DEV: {
        extensions: ["svg", "png", /\.jpg#datauri$/i],
        maxImageSize: 20 * 1024, // 字节
        debug: true,
    },
    BUILD: {
        extensions: ["svg", "png", /\.jpg#datauri$/i],
        maxImageSize: 20 * 1024, // 字节
        debug: false,
    },
};
// const MODIFY_CSS_URLS_CONFIG = {
//     // gulp-modify-css-urls 配置
//     DEV: {
//         modify(url, filePath) {
//             // 替换 css 样式文件中的 url 地址，这块需要自己配置个性化处理函数
//             return `../${PATH_CONFIG.imagesPath}${url}`;
//         },
//     },
//     BUILD: {
//         modify(url, filePath) {
//             // 替换 css 样式文件中的 url 地址，这块需要自己配置个性化处理函数
//             return `../${PATH_CONFIG.imagesPath}${url}`;
//         },
//     },
// };

module.exports = {
    PATH_CONFIG,
    TASK,
    SERVER,
    USE_CONFIG,
    BASE64_CONFIG,
};
