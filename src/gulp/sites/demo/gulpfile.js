const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const userConfig = require("./config.json");

// prod
// require("./cli/gulpfile.prod")(gulp);
// dev
require("../../cli/gulpfile.dev")(gulp, userConfig, browserSync);
// watch
// require("./cli/gulpfile.watch")(gulp, browserSync);
