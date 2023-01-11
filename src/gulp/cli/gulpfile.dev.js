const clean = require("gulp-clean");
const less = require("gulp-less");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
const processhtml = require("gulp-processhtml");
const template = require("gulp-template");
const gulpif = require("gulp-if");
const marked = require("gulp-marked");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const cssm = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const minimist = require("minimist");
const shell = require("gulp-shell");
const browserSync = require("browser-sync").create();
const moment = require("moment");
const chalk = require("chalk");
const htmlreplace = require("gulp-html-replace");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const connect = require("gulp-connect");
const autoPrefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");

const {
    PATH_CONFIG,
    TASK,
    SERVER,
    USE_CONFIG,
    BASE64_CONFIG,
} = require("./config");

module.exports = (gulp, userConfig, browserSync) => {
    const { src, dest, series, parallel, watch } = gulp;
    const reload = browserSync.reload;

    /* clean 文件清除任务 */
    gulp.task(TASK.DEV.CLEAN, () => {
        return src([PATH_CONFIG.export.dev.root], {
            allowEmpty: true,
        }).pipe(clean());
    });

    /* style 任务 */
    gulp.task(TASK.DEV.STYLE.MAIN, () => {
        return src(PATH_CONFIG.entry.styles)
            .pipe(plumber())
            .pipe(less())
            .pipe(autoPrefixer())
            .pipe(cssm())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.styles}`));
    });

    /* js 任务*/
    gulp.task(TASK.DEV.SCRIPT.MAIN, () => {
        return src(PATH_CONFIG.entry.script)
            .pipe(
                plumber({
                    errorHandler: function (e) {
                        console.log(
                            chalk.blue(
                                "----------------es6语法有误，导致babel转换失败start-----------"
                            )
                        );
                        console.log(marked(e.message));
                        console.log(
                            chalk.blue(
                                "----------------es6语法有误，导致babel转换失败end-----------"
                            )
                        );
                    },
                })
            )
            .pipe(
                gulpif(
                    USE_CONFIG.useBabel,
                    babel({
                        presets: ["@babel/env"],
                        plugins: ["@babel/transform-runtime"],
                    })
                )
            )
            .pipe(uglify())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.script}`));
    });

    /* html 任务*/
    gulp.task(TASK.DEV.HTML, () => {
        return src(PATH_CONFIG.entry.html)
            .pipe(plumber())
            .pipe(
                template(userConfig.dev, {
                    interpolate: /<%=([\s\S]+?)%>/g,
                })
            )
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.html}`));
    });

    /* images 任务 */
    gulp.task(TASK.DEV.IMAGE.MAIN, () => {
        return src(PATH_CONFIG.entry.images)
            .pipe(plumber())
            .pipe(
                cache(
                    imagemin({
                        progressive: true,
                        svgoPlugins: [{ removeViewBox: false }],
                        use: [pngquant()],
                    })
                )
            )
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.images}`));
    });

    /* libs 任务 */
    gulp.task(TASK.DEV.LIBS, () => {
        return src(PATH_CONFIG.entry.libs)
            .pipe(plumber())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.libs}`));
    });

    /* media 任务 */
    gulp.task(TASK.DEV.MEDIA, () => {
        return src(PATH_CONFIG.entry.media)
            .pipe(plumber())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.media}`));
    });

    /* fonts 任务 */
    gulp.task(TASK.DEV.FONT, () => {
        return src(PATH_CONFIG.entry.fonts)
            .pipe(plumber())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.dev.fonts}`));
    });

    /* 本地Server */
    gulp.task(TASK.DEV.BROWSER_SYNC, () => {
        browserSync.init({
            notify: false, // 关闭页面通知
            port: SERVER.port,
            proxy: SERVER.proxy,
            server: {
                baseDir: SERVER.baseDir,
                directory: SERVER.directory,
                middleware: function (req, res, next) {
                    const fs = require("fs");
                    const ssi = require("ssi");
                    let pathname = require("url").parse(req.url).pathname;
                    let filename = require("path").join(
                        SERVER.baseDir,
                        pathname.substr(-1) === "/"
                            ? pathname + "index.shtml"
                            : pathname
                    );

                    let parser = new ssi(
                        SERVER.baseDir,
                        SERVER.baseDir,
                        "/**/*.shtml",
                        true
                    );

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

        // 监听模板文件【html】
        watch(PATH_CONFIG.entry.html, parallel(TASK.DEV.HTML)).on(
            "change",
            reload
        );
        // 监听样式文件【less】
        watch(PATH_CONFIG.entry.styles, parallel(TASK.DEV.STYLE.MAIN)).on(
            "change",
            reload
        );
        // 监听脚本文件【js】
        watch(PATH_CONFIG.entry.script, parallel(TASK.DEV.SCRIPT.MAIN)).on(
            "change",
            reload
        );
        // 监听静态资源【image】
        watch(PATH_CONFIG.entry.images, parallel(TASK.DEV.IMAGE.MAIN)).on(
            "change",
            reload
        );
        // 监听库资源【lib】
        watch(PATH_CONFIG.entry.libs, parallel(TASK.DEV.LIBS)).on(
            "change",
            reload
        );
        // 监听媒体资源【media】
        watch(PATH_CONFIG.entry.media, parallel(TASK.DEV.MEDIA)).on(
            "change",
            reload
        );
        // 监听字体资源【font】
        watch(PATH_CONFIG.entry.fonts, parallel(TASK.DEV.FONT)).on(
            "change",
            reload
        );
    });

    /*  启动任务 【gulp dev】 */
    gulp.task(
        TASK.DEV.MAIN,
        series(
            TASK.DEV.CLEAN,
            parallel(
                TASK.DEV.HTML,
                TASK.DEV.STYLE.MAIN,
                TASK.DEV.SCRIPT.MAIN,
                TASK.DEV.IMAGE.MAIN,
                TASK.DEV.LIBS,
                TASK.DEV.MEDIA,
                TASK.DEV.FONT
            ),
            TASK.DEV.BROWSER_SYNC,
            async () => {
                console.log("完成");
            }
        )
    );
};
