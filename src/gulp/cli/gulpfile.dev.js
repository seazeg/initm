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

const {
    CONTROL_CONFIG,
    PATH_CONFIG,
    TASK,
    SERVER,
    AUTO_PREFIXER_CONFIG,
    BASE64_CONFIG,
} = require("./config");

module.exports = (gulp, browserSync) => {
    const { src, dest, series, parallel, watch } = gulp;
    const reload = browserSync.reload;

    /* clean 文件清除任务 */
    gulp.task(TASK.DEV.CLEAN, () => {
        return src([PATH_CONFIG.export.dev.root], {
            allowEmpty: true,
        }).pipe(clean());
    });

    /* style 任务 */
    gulp.task(TASK.DEV.STYLE.LESS, () => {
        return src(`${PATH_CONFIG.entry.styles}`)
            .pipe(plumber())
            .pipe(less())
            .pipe(autoPrefixer()) // css 样式前缀
            .pipe(dest(`${PATH_CONFIG.export.dev.styles}`));
    });

    gulp.task(
        TASK.DEV.MAIN,
        series(TASK.DEV.CLEAN, TASK.DEV.STYLE.LESS, async () => {
            console.log("完成");
        })
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
