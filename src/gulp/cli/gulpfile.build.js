const clean = require("gulp-clean");
const less = require("gulp-less");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
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
const moment = require("moment");
const chalk = require("chalk");
const htmlreplace = require("gulp-html-replace");
const replace = require("gulp-replace");
const autoPrefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");

const { PATH_CONFIG, TASK, USE_CONFIG } = require("./config");

const argv = minimist(process.argv.slice(2), {
    string: "env",
    default: {
        env: process.env.NODE_ENV || "dev",
    },
});

module.exports = (gulp, userConfig) => {
    const { src, dest, series, parallel } = gulp;

    /* clean 文件清除任务 */
    gulp.task(TASK.BUILD.CLEAN, () => {
        return src([PATH_CONFIG.export.build.root], {
            allowEmpty: true,
        }).pipe(clean());
    });

    /* style 任务 */
    gulp.task(TASK.BUILD.STYLE.MAIN, () => {
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
            .pipe(dest(`${PATH_CONFIG.export.build.styles}`));
    });

    /* js 任务*/
    gulp.task(TASK.BUILD.SCRIPT.MAIN, () => {
        return src(PATH_CONFIG.entry.script)
            .pipe(
                plumber({
                    errorHandler: function (e) {
                        console.log(
                            chalk.red(
                                "----------------es6语法有误，导致babel转换失败start-----------"
                            )
                        );
                        console.log(marked(e.message));
                        console.log(
                            chalk.red(
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
            .pipe(dest(`${PATH_CONFIG.export.build.script}`));
    });

    /* html 任务*/
    gulp.task(TASK.BUILD.HTML, () => {
        console.log(
            chalk.yellow(
                `[${moment().locale("zh-cn").format("HH:mm:ss")}] 打包环境: ${
                    argv.env
                }`
            )
        );
        return src(PATH_CONFIG.entry.html.prod, {
            base: "src/",
        })
            .pipe(plumber())
            .pipe(
                gulpif(
                    argv.env === "dev",
                    shell(["echo 0 > <%= siteId %>.site"], {
                        templateData: {
                            siteId: userConfig.testSiteId,
                        },
                    })
                )
            )
            .pipe(
                gulpif(
                    argv.env === "pro",
                    shell(["echo 0 > <%= siteId %>.site"], {
                        templateData: {
                            siteId: userConfig.proSiteId,
                        },
                    })
                )
            )
            .pipe(
                gulpif(
                    argv.env === "dev",
                    template(userConfig.test, {
                        interpolate: /<%=([\s\S]+?)%>/g,
                    })
                )
            )
            .pipe(
                gulpif(
                    argv.env === "pro",
                    template(userConfig.pro, {
                        interpolate: /<%=([\s\S]+?)%>/g,
                    })
                )
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.build.html}`));
    });

    /* images 任务 */
    gulp.task(TASK.BUILD.IMAGE.MAIN, () => {
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
            .pipe(dest(`${PATH_CONFIG.export.build.images}`));
    });

    /* libs 任务 */
    gulp.task(TASK.BUILD.LIBS, () => {
        return src(PATH_CONFIG.entry.libs)
            .pipe(plumber())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.build.libs}`));
    });

    /* media 任务 */
    gulp.task(TASK.BUILD.MEDIA, () => {
        return src(PATH_CONFIG.entry.media)
            .pipe(plumber())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.build.media}`));
    });

    /* fonts 任务 */
    gulp.task(TASK.BUILD.FONT, () => {
        return src(PATH_CONFIG.entry.fonts)
            .pipe(plumber())
            .pipe(
                rename({
                    dirname: "",
                })
            )
            .pipe(plumber.stop())
            .pipe(dest(`${PATH_CONFIG.export.build.fonts}`));
    });

    /*  启动任务 【gulp build】 */
    gulp.task(
        TASK.BUILD.MAIN,
        series(
            TASK.BUILD.CLEAN,
            parallel(
                TASK.BUILD.HTML,
                TASK.BUILD.STYLE.MAIN,
                TASK.BUILD.SCRIPT.MAIN,
                TASK.BUILD.IMAGE.MAIN,
                TASK.BUILD.LIBS,
                TASK.BUILD.MEDIA,
                TASK.BUILD.FONT
            ),
            async () => {
                console.log("完成");
            }
        )
    );
};
