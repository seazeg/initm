/*
 * @Author       : Evan.G
 * @Date         : 2023-01-10 16:50:23
 * @LastEditTime : 2023-01-10 18:13:12
 * @Description  :
 * @FilePath     : /seazeg.github.io/Users/geng/Project/Person/initm/src/gulp/cli/config.js
 */

const PATH_CONFIG = {
    entry: {
        html: "src/pages/**/.{html,shtml,htm}",
        styles: "src/pages/**/*.{less,css}",
        script: "src/pages/**/*.js",
        images: "src/pages/**/res/*.{png,jpg,gif,svg,bmp,jpeg}",
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

const USER_CONFIG = {
    useEslint: false,
    useWebpack: false,
};

const TASK = {
    DEV: {
        MAIN: "dev",
        CLEAN: "dev-clean",
        HTML: "dev-html",
        STYLE: {
            CSS: "dev-css",
            LESS: "dev-less", // less编译
        },
        SCRIPT: {
            MAIN: "dev-js",
            UGLIFY: "dev-uglify", // JS压缩
            CONCAT: "dev-concat", // JS合并
        },
        IMAGE: {
            MAIN: "dev-image",
            IMAGE_MIN: "dev-image-min",
            base64: "dev-base64",
        },
        FONT: {
            MAIN: "dev-font",
        },
        MEDIA: {
            MAIN: "dev-media",
        },
        LIBS: {
            MAIN: "dev-libs",
        },
        SERVER: "server", // 服务
        BROWSER_SYNC: "browser-sync", // 浏览器同步
        WATCH: "watch", // 监听
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
    // PROXY: "http://localhost:3000", // 这块的端口号其实是对应 node 服务里启动的端口号
    PORT: 3006, // 这个端口号是 browser-sync 插件代理的端口号
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
    USER_CONFIG,
    // AUTO_PREFIXER_CONFIG,
    BASE64_CONFIG,
    // MODIFY_CSS_URLS_CONFIG,
};
