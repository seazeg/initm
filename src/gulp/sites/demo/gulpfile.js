const gulp = require("gulp");
const browserSync = require("browser-sync").create();

// prod
// require("./cli/gulpfile.prod")(gulp);
// dev
require("../../cli/gulpfile.dev")(gulp, browserSync);
// watch
// require("./cli/gulpfile.watch")(gulp, browserSync);
