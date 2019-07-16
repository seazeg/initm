    // --本地服务器
    var gulp = require('gulp'),
        browserSync = require('browser-sync').create(),
        // SSI = require('browsersync-ssi'),
        reload = browserSync.reload,
        watch = require('gulp-watch'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat'),
        jshint = require('gulp-jshint'),
        csscomb = require('gulp-csscomb'),
        csslint = require('gulp-csslint'),
        csso = require('gulp-csso'),
        prefixer = require('gulp-autoprefixer'),
        clean = require('gulp-clean'),
        rename = require("gulp-rename"),
        zip = require('gulp-zip'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        template = require('gulp-template'),
        processhtml = require('gulp-processhtml'),
        gulpif = require('gulp-if'),
        minimist = require('minimist'),
        fileinclude = require('gulp-file-include'),
        shell = require('gulp-shell'),
        less = require('gulp-less'),
        config = require('./config.json'),
        //确保本地已安装gulp-sourcemaps [cnpm install gulp-sourcemaps --save-dev]
        sourcemaps = require('gulp-sourcemaps'),
        combiner = require('stream-combiner2'),
        //确保本地已安装gulp-minify-css [cnpm install gulp-minify-css --save-dev]
        cssmin = require('gulp-minify-css');
    //确保本地已安装gulp-less [cnpm install gulp-less --save-dev]

    var knownOptions = {
        string: 'env',
        default: {
            env: process.env.NODE_ENV || 'dev'
        }
    };

    var filetask = {
        string: 'file',
        default: {
            file: process.env.NODE_ENV || 'all'
        }
    };

    // --env dev
    // --env pro

    var options = minimist(process.argv.slice(2), knownOptions, filetask);


    // ----- js -----
    gulp.task('jstask', function () {
        if (!options.file) {
            console.log('检查全部js文件');
            console.log('运行gulp jstask --file 文件名，查看对应文件错误信息');
            return gulp.src('./images/*.js')
                // .pipe(watch('./src/images/*.js')) // 只重新编译被更改过的文件
                // js检查
                .pipe(jshint())
                .pipe(jshint.reporter('fail'));
        } else {
            console.log('检查js文件: ./images/' + options.file);
            return gulp.src('./images/' + options.file)
                // .pipe(watch('./src/images/*.js')) // 只重新编译被更改过的文件
                // js检查
                .pipe(jshint())
                .pipe(jshint.reporter('default'));
        }

    });



    // js压缩发布
    gulp.task('jstask-min', ['jstask'], function () {
        return gulp.src('./build/*.js')
            // 合并js
            .pipe(concat('main.min.js'))
            // 压缩js
            .pipe(uglify())
            .pipe(gulp.dest('./build'));
    });

    //js/css压缩发布-首页优化
    gulp.task("csstask-min-index", function () {
        gulp.src(['./images/iconfont.css', './images/l_base.css', './images/l_module.css', './images/index.css'])
            .pipe(concat('index-min.css'))
            .pipe(gulp.dest('./images'));
    });
    gulp.task("jstask-min-index", function () {
        gulp.src(['./images/jquery-1.8.3.min.js',
                './images/jquery.cookie.js',
                './images/svg-min.js',
                './images/l_obox.js',
                './images/l_module.js',
                './images/l_base.js',
                './images/idangerous.swiper2.7.6.min.js',
                './images/index.js',
                './images/templete_nav_search.js'
            ])
            .pipe(concat('index-min.js'))
            .pipe(gulp.dest('./images'));
    });


    // ----- css -----
    gulp.task('csstask', function () {
        if (!options.file) {
            console.log('检查全部css');
            console.log('运行gulp csstask --file 文件名，查看对应文件错误信息');

            return gulp.src('./images/*.css')
                // css检查
                .pipe(csslint())
                .pipe(csslint.reporter('fail'));

        } else {
            console.log('检查css文件: ./images/' + options.file);
            return gulp.src('./images/' + options.file)
                // .pipe(watch('./src/images/*.css')) // 只重新编译被更改过的文件
                // css检查
                .pipe(csslint())
                .pipe(csslint.reporter());

            // css私有变量补全
            // .pipe(prefixer())
            // css顺序调整
            // .pipe(csscomb())
            // .pipe(gulp.dest('./build/images'))
            // .pipe(gulp.dest('./build'))
        }

    });


    // css压缩发布
    gulp.task('csstask-min', ['csstask'], function () {
        return gulp.src('./build/*.css')
            //压缩css
            .pipe(csso())
            .pipe(gulp.dest('./build/'));
    });


    // ----- html 内容替换 -----

    // html预览监测
    gulp.task('public', function () {
        return gulp.src('./static/public/*')
            .pipe(gulp.dest('./preview/public'));
    });

    gulp.task('contenttask', ['public'], function () {
        console.log('打包环境: ' + options.env);
        gulp.src('./template/**/*.{html,shtml}')
            // .pipe(watch('./src/*.{html,shtml}')) // 只重新编译被更改过的文件
            // 替换内容

            .pipe(gulpif(options.env === 'dev', template(config.dev_template, {
                'interpolate': /<%=([\s\S]+?)%>/g
            })))
            .pipe(gulpif(options.env === 'pro', template(config.pro_template, {
                'interpolate': /<%=([\s\S]+?)%>/g
            })))
            .pipe(gulpif(options.env === 'view', template(config.dev_template, {
                'interpolate': /<%=([\s\S]+?)%>/g
            })))
            // .pipe(gulpif(options.env === 'production', processhtml()))
            // 替换引用
            .pipe(processhtml())
            .pipe(gulp.dest('./build'))

            .pipe(gulpif(options.env === 'dev', shell(['touch <%= siteId %>.site'], {
                templateData: {
                    siteId: config.testSiteId
                }
            })))
            .pipe(gulpif(options.env === 'pro', shell(['touch <%= siteId %>.site'], {
                templateData: {
                    siteId: config.proSiteId
                }
            })));


        gulp.src('./shredder/**/*.{html,shtml}')
            // .pipe(watch('./src/*.{html,shtml}')) // 只重新编译被更改过的文件
            // 替换内容

            .pipe(gulpif(options.env === 'dev', template(config.dev_template, {
                'interpolate': /<%=([\s\S]+?)%>/g
            })))
            .pipe(gulpif(options.env === 'pro', template(config.pro_template, {
                'interpolate': /<%=([\s\S]+?)%>/g
            })))
            .pipe(gulpif(options.env === 'view', template(config.dev_template, {
                'interpolate': /<%=([\s\S]+?)%>/g
            })))
            // .pipe(gulpif(options.env === 'production', processhtml()))
            // 替换引用
            .pipe(processhtml())
            .pipe(gulp.dest('./build/shredder/'))

            .pipe(gulpif(options.env === 'dev', shell(['touch <%= siteId %>.site'], {
                templateData: {
                    siteId: config.testSiteId
                }
            })))
            .pipe(gulpif(options.env === 'pro', shell(['touch <%= siteId %>.site'], {
                templateData: {
                    siteId: config.proSiteId
                }
            })));


    });

    gulp.task('contenttask-dist', ['public'], function () {
        return gulp.src('./static/**/*.{html,shtml}')
            // 替换内容
            .pipe(template(config.preview_template))
            // 替换引用
            .pipe(processhtml())
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest('./dist'));
    });

    // xml
    gulp.task('data', function () {
        return gulp.src(['xml/*.xml', 'json/*.json', '!json/secre-*.json']).pipe(gulp.dest('./preview'));
    });

    // 

    gulp.task('contenttask-watch', ['public'], function () {
        return gulp.src('./static/**/*.{html,shtml}')
            .pipe(watch('./static/**/*.{html,shtml}')) // 只重新编译被更改过的文件
            // 替换内容
            .pipe(template(config.debug_template))
            // 替换引用
            .pipe(processhtml())
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest('./preview'));
    });





    // ----- 文件操作 -----

    // 文件清理
    gulp.task('clean', function () {
        return gulp.src(['./build', './preview', './*.site'], {
                read: false
            })
            .pipe(clean({
                force: true
            }));
    });

    gulp.task('clean-build', function () {
        return gulp.src(['./build'], {
                read: false
            })
            .pipe(clean({
                force: true
            }));
    });

    gulp.task('clean-preview', function () {
        return gulp.src(['./preview'], {
                read: false
            })
            .pipe(clean({
                force: true
            }));
    });

    gulp.task('clean-dist', function () {
        return gulp.src(['./dist'], {
                read: false
            })
            .pipe(clean({
                force: true
            }));
    });

    // ----- 压缩图片 -----

    //压缩图片 - imagemin
    gulp.task('imagemin', function () {
        return gulp.src('./images/*.{png,jpg,jpeg,gif}')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                use: [pngquant({
                    quality: '100'
                })]
            }))
            .pipe(gulp.dest('./images'));
    });

    //编译less


    gulp.task("testLess", function () {
        var combined = combiner.obj([
            gulp.src("./images/less/*.less"),
            watch("./images/less/*.less"),
            // sourcemaps.init(),
            less(),
            cssmin(),
            // sourcemaps.write('./maps'),
            gulp.dest("./images")
        ]);

        combined.on('error', function () {
            console.error.bind(console)
        });
        return combined;
    });

    gulp.task('lesstask', function () {
        return gulp.watch('./images/less/*.less', ['testLess']);
    });

    gulp.task("less-build", function () {
        var changeFileArr = []
        var fileArr = []
        if (options.file && typeof (options.file) == 'string') {
            changeFileArr = options.file.split(',')
            for (var i = 0; i < changeFileArr.length; i++) {
                if (changeFileArr[i].indexOf('/less/') > 0) {
                    fileArr.push('../' + changeFileArr[i])
                }
            }
        }

        var combined = combiner.obj([
            gulp.src(fileArr),
            // sourcemaps.init(),
            less(),
            cssmin(),
            // sourcemaps.write('./maps'),
            gulp.dest("./images")
        ]);

        combined.on('error', function () {
            console.error.bind(console)
        });
        return combined;
    })

    gulp.task("lessBuildAll", function () {
        var combined = combiner.obj([
            gulp.src("./images/less/*.less"),
            // sourcemaps.init(),
            less(),
            cssmin(),
            // sourcemaps.write('./maps'),
            gulp.dest("./images")
        ]);

        combined.on('error', function () {
            console.error.bind(console)
        });
        return combined;
    })

    // 开启本地 Web 服务器功能
    gulp.task('webserver-static', function () {
        // 开发预览
        browserSync.init({
            port: config.serverPort,
            server: {
                baseDir: ["preview", "./"],
                directory: true,
                middleware: function (req, res, next) {
                    var fs = require('fs');
                    var ssi = require('ssi');
                    var baseDir = './preview/';
                    var pathname = require('url').parse(req.url).pathname;
                    var filename = require('path').join(baseDir, pathname.substr(-1) === '/' ? pathname + 'index.html' : pathname);

                    var parser = new ssi(baseDir, baseDir, '/**/*.shtml', true);
                    if (filename.indexOf('.shtml') > -1 && fs.existsSync(filename))
                        res.end(parser.parse(filename, fs.readFileSync(filename, {
                            encoding: 'utf8'
                        })).contents);
                    else
                        next();
                }
            }
        });

        gulp.watch('./**/*').on("change", browserSync.reload);

    });


    // ----- 任务 -----

    //默认任务
    gulp.task('default', function () {
        gulp.run('help');
    });

    gulp.task('help', function () {
        console.log('gulp build --env dev          ---测试环境模板打包');
        console.log('gulp build --env pro          ---生产环境模板打包');
        console.log('gulp debug                    ---本地调试');
        console.log('gulp jstask                   ---js文件检查');
        console.log('gulp jstask --file 文件名     ---检查js文件');
        console.log('gulp csstask                  ---css文件检查');
        console.log('gulp csstask --file 文件名    ---检查css文件');
        console.log('gulp imagemin                 ---图片压缩');
    });

    //项目完成提交任务
    gulp.task('build', ['clean-build'], function (a) {
        gulp.run('contenttask');
        // gulp.run('imagemin');
    });

    gulp.task('preview', ['clean-dist'], function (a) {
        gulp.run('contenttask-dist');
    });

    gulp.task('debug', ['clean-preview'], function (a) {
        gulp.run('contenttask-watch');
        gulp.run('webserver-static');
        gulp.run('lessBuildAll');
        gulp.run('lesstask');
    });

    //项目完成提交任务
    gulp.task('build-min', ['clean'], function () {
        gulp.run('jstask-min');
        gulp.run('csstask-min');
        gulp.run('contenttask');
        gulp.run('imagemin');
    });