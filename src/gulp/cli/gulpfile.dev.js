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

    /* clean 文件清除任务 */
    gulp.task(TASK.DEV.CLEAN, () => {
        return src([PATH_CONFIG.export.dev.root], {
            allowEmpty: true,
        }).pipe(clean());
    });

    /* style 任务 */
    gulp.task(TASK.DEV.STYLE.MAIN, () => {
        return src(`${PATH_CONFIG.entry.styles}`)
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
        return src(`${PATH_CONFIG.entry.script}`)
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
        return src(`${PATH_CONFIG.entry.html}`)
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
        return src(`${PATH_CONFIG.entry.images}`)
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
        return src(`${PATH_CONFIG.entry.libs}`)
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
        return src(`${PATH_CONFIG.entry.media}`)
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
        return src(`${PATH_CONFIG.entry.fonts}`)
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
            port: SERVER.port,
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
    });

    /* 热更新watch */
    gulp.task(TASK.DEV.WATCH, () => {
        let watcher = watch(SERVER.watchDir);
        watcher.on("change", (path) => {
            let separator = path.indexOf("\\") > 0 ? "\\" : "/"; //分隔符
            let pathArray = path.split(separator);
            let fileName = pathArray[pathArray.length - 1];
            let type = fileName.split(".")[1];
            let nowDate = moment().locale("zh-cn").format("HH:mm:ss");
            if (type.includes("htm")) {
                TASK.DEV.HTML();
                browserSync.reload();
                console.log(
                    chalk.yellow(`[${nowDate}]更新文件 ${path}到dist目录`)
                );
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
                    chalk.yellow(
                        `[${nowDate}]更新文件 ${path}到dist/images目录`
                    )
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
                    chalk.yellow(
                        `[${nowDate}]更新文件 ${path}到dist/images目录`
                    )
                );
            } else if (
                type == "jpg" ||
                type == "jpeg" ||
                type == "svg" ||
                type == "png" ||
                type == "gif"
            ) {
                src(path)
                    .pipe(
                        rename({
                            dirname: "",
                        })
                    )
                    .pipe(dest("dist/images/"));
                browserSync.reload();
                console.log(
                    chalk.yellow(
                        `[${nowDate}]更新文件 ${path}到dist/images目录`
                    )
                );
            }
        });
    });

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

    // /* html 任务 */
    // gulp.task(TASK.DEV.HTML, [TASK.DEV.STYLE.SASS], () => {
    //     return gulp
    //         .src(`${srcPath}**/*.html`)
    //         .pipe(
    //             replace(
    //                 /(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g,
    //                 `$1../${stylePath.outputFolder}/$2$3`
    //             )
    //         )
    //         .pipe(
    //             replace(
    //                 /(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g,
    //                 `$1../${imagesPath}$2$3$4`
    //             )
    //         )
    //         .pipe(gulp.dest(`${runTimePath.dev}`));
    // });

    // /* JS 任务 */
    // gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.HTML], () => {
    //     webpack(require("./webpack.dev.conf.js"), (err, status) => {
    //         if (err != null)
    //             console.log("webpack bundle script error, information: ", err);
    //         // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
    //         gulp.src([
    //             `${devPath}**/*.html`,
    //             `!${runTimePath.dev}**/*.html`,
    //         ]).pipe(gulp.dest(`${runTimePath.dev}`));
    //     });
    // });

    // /* image 任务 */
    // gulp.task(TASK.DEV.IMAGE.MAIN, [TASK.DEV.SCRIPT.MAIN], () => {
    //     // 检测对应搜索路径下的文件夹
    //     let folders = getFolders(`${srcPath}${imagesPath}`),
    //         tasks = [];
    //     // 先检测 static/images/ 下的文件
    //     tasks.push(
    //         gulp
    //             .src(`${srcPath}${imagesPath}*.*`)
    //             .pipe(imagemin())
    //             .pipe(gulp.dest(`${devPath}${imagesPath}`))
    //     );
    //     // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
    //     if (folders.length > 0) {
    //         let taskList = folders.map((folder) =>
    //             gulp
    //                 .src(path.join(`${srcPath}${imagesPath}`, folder, "/*.*"))
    //                 .pipe(imagemin())
    //                 .pipe(gulp.dest(`${devPath}${imagesPath}`))
    //         );
    //         tasks.push(...taskList);
    //     }
    //     return merge(tasks);
    // });

    // /* dev 合并构建任务 */
    // gulp.task(
    //     TASK.DEV.MAIN,
    //     [
    //         TASK.DEV.CLEAN,
    //         TASK.DEV.STYLE.SASS,
    //         TASK.DEV.HTML,
    //         TASK.DEV.SCRIPT.MAIN,
    //         TASK.DEV.IMAGE.MAIN,
    //         TASK.DEV.NODEMON,
    //         TASK.DEV.BROWSER_SYNC,
    //     ],
    //     () => {}
    // );

    // /* 启动 server 任务 -------------------------------------------------- */
    // // 启动NodeJS服务文件
    // gulp.task(
    //     TASK.DEV.NODEMON,
    //     [
    //         TASK.DEV.CLEAN,
    //         TASK.DEV.STYLE.SASS,
    //         TASK.DEV.HTML,
    //         TASK.DEV.SCRIPT.MAIN,
    //         TASK.DEV.IMAGE.MAIN,
    //     ],
    //     (cb) => {
    //         let started = false;
    //         return nodemon({
    //             script: "server.js",
    //         }).on("start", () => {
    //             if (!started) {
    //                 cb();
    //                 started = true;
    //             }
    //         });
    //     }
    // );

    // gulp.task(TASK.DEV.BROWSER_SYNC, [TASK.DEV.NODEMON], () => {
    //     browserSync.init({
    //         notify: false, // 关闭页面通知
    //         proxy: ROUTES.PROXY,
    //         browser: "chrome",
    //         port: ROUTES.PORT,
    //     });

    //     // 监听模板文件
    //     gulp.watch(`${srcPath}${templatePath.root}**/*.html`, [
    //         TASK.DEV.RUNTIME_HTML,
    //         TASK.DEV.RUNTIME_FILE_SYNC,
    //     ]).on("change", reload);
    //     // 监听样式文件【sass】
    //     gulp.watch(`${srcPath}${stylePath.sass.root}**/*.scss`, [
    //         TASK.DEV.RUNTIME_STYLE.SASS,
    //     ]).on("change", reload);
    //     // 监听脚本文件【js】
    //     gulp.watch(`${srcPath}${scriptPath}**/*.js`, [
    //         TASK.DEV.RUNTIME_SCRIPT.MAIN,
    //     ]);
    //     // 监听静态资源【image】
    //     gulp.watch(`${srcPath}${imagesPath}**/*`, [
    //         TASK.DEV.RUNTIME_IMAGE.MAIN,
    //     ]).on("change", reload);
    // });
};
