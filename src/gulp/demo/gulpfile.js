const { src, dest, series, parallel, watch } = require("gulp"),
    clean = require("gulp-clean"),
    less = require("gulp-less"),
    babel = require("gulp-babel"),
    plumber = require("gulp-plumber"),
    processhtml = require("gulp-processhtml"),
    template = require("gulp-template"),
    gulpif = require("gulp-if"),
    marked = require("gulp-marked"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    cssm = require("gulp-clean-css"),
    imagemin = require("gulp-imagemin"),
    pngquant = require("imagemin-pngquant"),
    minimist = require("minimist"),
    shell = require("gulp-shell"),
    browserSync = require("browser-sync").create(),
    moment = require("moment"),
    chalk = require("chalk"),
    htmlreplace = require("gulp-html-replace"),
    concat = require("gulp-concat"),
    replace = require("gulp-replace"),
    connect = require("gulp-connect"),
    prefixer = require("gulp-autoprefixer");

const { createProxyMiddleware } = require("http-proxy-middleware");

const config = require("./config.json");

// build --env test 开发环境
// build --env pro 生产环境
const options = minimist(process.argv.slice(2), {
    string: "env",
    default: {
        env: process.env.NODE_ENV || "dev",
    },
});
const outDir =
    !process.title.includes("debug") && !process.title.includes("test")
        ? "build/images/"
        : "dist/images/";

/**
 * @description 拷贝图片资源
 * @returns
 */
function copyImg() {
    return src(["src/*.{jpg,png,gif}", "src/**/*.{jpg,png,gif}"])
        .pipe(
            rename({
                dirname: "",
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description 拷贝js,css
 * @returns
 */
function copyJsCss() {
    return src(["src/*.{js,css}", "src/**/*.{js,css}"])
        .pipe(
            rename({
                dirname: "",
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description 拷贝其他资源
 * @returns
 */
function copyOther() {
    return src(["src/*.{svg,mp4}", "src/**/*.{svg,mp4,htc,json}"])
        .pipe(
            rename({
                dirname: "",
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description 拷贝第三方库
 * @returns   todo!
 */
function copyLibs() {
    return src(["src/assets/icons/*", "src/assets/libs/**/*.*"]).pipe(
        dest(outDir)
    );
}

/**
 * @description less编译
 * @returns
 */
function convertLess(type) {
    return src(["src/*.less", "src/**/*.less"])
        .pipe(plumber())
        .pipe(less())
        .pipe(
            prefixer({
                //这是自动处理的参数
                borwsers: ["last 2 versions"], //针对游览器
                remove: true,
            })
        )
        .pipe(
            rename({
                dirname: "",
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description dist清空
 * @returns
 */
function cleanDist() {
    return src(["dist/"], {
        allowEmpty: true,
    }).pipe(clean());
}

/**
 * @description build构建清空
 * @returns
 */
function cleanAll() {
    return src(["build/", "./*.site"], {
        allowEmpty: true,
    }).pipe(clean());
}

/**
 * @description babel转换
 * @returns
 */
function selfBabel() {
    return src([
        "src/*.js",
        "src/**/*.js",
        "!src/**/libs/*.js",
        "!src/**/*.ignore.js",
    ])
        .pipe(
            rename({
                dirname: "",
            })
        )
        .pipe(
            babel({
                presets: ["@babel/env"],
                plugins: ["@babel/transform-runtime"],
            })
        )
        .pipe(
            plumber({
                errorHandler: function (e) {
                    console.log(
                        "----------------es6语法有误，导致babel转换失败start-----------"
                    );
                    console.log(marked(e.message));
                    console.log(
                        "----------------es6语法有误，导致babel转换失败end-----------"
                    );
                },
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description 合并js
 * @returns
 */
function mergeJS() {
    return src([
        "build/images/jQuery.min.js",
        "build/images/jquery.cookie.js",
        "build/images/ajax.interceptor.js",
        "build/images/trs_spm.js",
        "build/images/common.js",
        "build/images/pro_exposure.js",
    ])
        .pipe(concat("app.min.js"))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write("./maps"))
        .pipe(dest(outDir));
}

/**
 * @description 合并css
 * @returns
 */
function mergeCSS() {
    return src(["build/images/iconfont.css", "build/images/common.css"])
        .pipe(concat("app.min.css"))
        .pipe(
            cssm({
                compatibility: "ie8",
                keepSpecialComments: "*",
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description ie8兼容css生成
 * @returns
 */
function ie8Convert() {
    return src([
        "build/images/*.css",
        "dist/images/*.css",
        "!build/images/*_ie8.css",
        "!dist/images/*_ie8.css",
    ])
        .pipe(
            replace(
                /([1-9]\d*.\d*|0?.\d*[1-9]\d*|\d*[1-9]\d*)rem/g,
                function (rem, p, offset, string) {
                    if (!!rem) {
                        return parseFloat(rem) * parseInt(100) + "px";
                    }
                }
            )
        )
        .pipe(
            rename({
                suffix: "_ie8",
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description js压缩
 * @returns
 */
function jsmin() {
    return src([
        "build/images/*.js",
        "!build/images/*min.js",
        "!build/images/*ignore.js",
    ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write("./maps"))
        .pipe(dest(outDir));
}

/**
 * @description css压缩
 * @returns
 */
function cssmin() {
    return src([
        "build/images/*.css",
        "!build/images/*min.css",
        "!build/images/*ignore.css",
    ])
        .pipe(sourcemaps.init())
        .pipe(
            cssm({
                compatibility: "ie8",
                keepSpecialComments: "*",
            })
        )
        .pipe(sourcemaps.write("./maps"))
        .pipe(dest(outDir));
}

/**
 * @description 图片压缩
 * @returns
 */
function imgmin() {
    return src(["build/images/*.{jpeg,jpg,png,gif}"])
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [
                    {
                        removeViewBox: false,
                    },
                ],
                use: [
                    pngquant({
                        quality: "100",
                    }),
                ],
            })
        )
        .pipe(dest(outDir));
}

/**
 * @description 模板文件内容编译
 * @returns
 */
function templateComp() {
    let nowDate = moment().locale("zh-cn").format("HH:mm:ss");
    console.log(chalk.yellow(`[${nowDate}] 打包环境: ${options.env}`));
    return (
        src(
            [
                "src/template/**/*.{html,shtml}",
                "src/shredder/**/*.{html,shtml}",
            ],
            {
                base: "src/",
            }
        )
            .pipe(
                gulpif(
                    options.env === "dev",
                    shell(["touch <%= siteId %>.site"], {
                        templateData: {
                            siteId: config.testSiteId,
                        },
                    })
                )
            )
            .pipe(
                gulpif(
                    options.env === "pro",
                    shell(["touch <%= siteId %>.site"], {
                        templateData: {
                            siteId: config.proSiteId,
                        },
                    })
                )
            )
            .pipe(
                gulpif(
                    options.env === "dev",
                    template(config.test, {
                        interpolate: /<%=([\s\S]+?)%>/g,
                    })
                )
            )
            .pipe(
                gulpif(
                    options.env === "pro",
                    template(config.pro, {
                        interpolate: /<%=([\s\S]+?)%>/g,
                    })
                )
            )
            // .pipe(rename({
            //     dirname: ''
            // }))
            .pipe(
                htmlreplace({
                    css: "images/app.min.css",
                    js: "images/app.min.js",
                })
            )
            .pipe(dest("build/"))
    );
}

/**
 * @description 提取标识后的include内容，替换成include引用并生成include模板
 * @returns
 */
async function toInclude() {
    return src("*.*", {
        read: false,
    }).pipe(shell(["node include.js"]));
}

/**
 * @description 静态页面编译
 * @returns
 */
function staticFileComp() {
    return src([
        "src/pages/*.{html,shtml,htm}",
        "src/pages/**/*.{html,shtml,htm}",
    ])
        .pipe(template(config.dev))
        .pipe(
            rename({
                dirname: "",
            })
        )
        .pipe(dest("dist/"));
}

/**
 * @description 代理服务器
 * @returns
 */
function proxyServer() {
    if (config.proxySwitch) {
        connect.server({
            port: config.proxyPort,
            middleware: function (connect, opt) {
                return [
                    createProxyMiddleware("/", {
                        target: config.proxyTarget, //代理的目标地址
                        changeOrigin: true,
                    }),
                ];
            },
        });
    }
}

/**
 * @description 本地web服务器
 * @returns
 */
function webService() {
    browserSync.init({
        port: config.serverPort,
        server: {
            baseDir: "dist/",
            directory: true,
            middleware: function (req, res, next) {
                const fs = require("fs");
                const ssi = require("ssi");
                const baseDir = "dist/";
                let pathname = require("url").parse(req.url).pathname;
                let filename = require("path").join(
                    baseDir,
                    pathname.substr(-1) === "/"
                        ? pathname + "index.shtml"
                        : pathname
                );

                let parser = new ssi(baseDir, baseDir, "/**/*.shtml", true);

                if (
                    filename.indexOf(".shtml") > -1 &&
                    fs.existsSync(filename)
                ) {
                    res.end(
                        parser.parse(
                            filename,
                            fs.readFileSync(filename, {
                                encoding: "utf8",
                            })
                        ).contents
                    );
                } else {
                    next();
                }
            },
        },
    });
}

/**
 * @description 文件调整监听
 * @returns
 */
function watchFile() {
    let watcher = watch(["src/*.*", "src/**/*.*"]);
    watcher.on("change", (path) => {
        let separator = path.indexOf("\\") > 0 ? "\\" : "/"; //分隔符
        let pathArray = path.split(separator);
        let fileName = pathArray[pathArray.length - 1];
        let type = fileName.split(".")[1];
        let nowDate = moment().locale("zh-cn").format("HH:mm:ss");
        if (type == "html" || type == "shtml") {
            staticFileComp();
            browserSync.reload();
            console.log(chalk.yellow(`[${nowDate}]更新文件 ${path}到dist目录`));
        } else if (type == "js") {
            src(path)
                .pipe(
                    rename({
                        dirname: "",
                    })
                )
                .pipe(dest("dist/images/"));

            selfBabel();
            browserSync.reload();
            console.log(
                chalk.yellow(`[${nowDate}]更新文件 ${path}到dist/images目录`)
            );
        } else if (type == "less") {
            src(path)
                .pipe(plumber())
                .pipe(less())
                .pipe(
                    prefixer({
                        //这是自动处理的参数
                        borwsers: ["last 2 versions"], //针对游览器
                        remove: true,
                    })
                )
                .pipe(
                    rename({
                        dirname: "",
                    })
                )
                .pipe(dest("dist/images/"));
            browserSync.reload();
            console.log(
                chalk.yellow(`[${nowDate}]更新文件 ${path}到dist/images目录`)
            );
        } else if (type == "jpg" || type == "png" || type == "gif") {
            src(path)
                .pipe(
                    rename({
                        dirname: "",
                    })
                )
                .pipe(dest("dist/images/"));
            browserSync.reload();
            console.log(
                chalk.yellow(`[${nowDate}]更新文件 ${path}到dist/images目录`)
            );
        }
    });
}

//调试命令
exports.debug = series(
    cleanDist,
    parallel(
        series(
            parallel(
                staticFileComp,
                copyJsCss,
                copyLibs,
                copyImg,
                copyOther,
                convertLess
            ),
            ie8Convert,
            selfBabel,
            watchFile
        ),
        webService,
        proxyServer
    )
);

//打包命令
exports.build = series(
    cleanAll,
    parallel(
        series(
            parallel(
                templateComp,
                copyJsCss,
                copyLibs,
                copyImg,
                copyOther,
                convertLess
            ),
            ie8Convert,
            selfBabel,
            jsmin,
            cssmin,
            imgmin
        )
    )
);

exports.test = series(
    cleanDist,
    parallel(
        series(
            parallel(
                staticFileComp,
                copyJsCss,
                copyLibs,
                copyImg,
                copyOther,
                convertLess
            ),
            ie8Convert,
            selfBabel
        )
    )
);
