const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const userConfig = require("./config.json");

// build
require("../../cli/gulpfile.build")(gulp, userConfig);
// dev
require("../../cli/gulpfile.dev")(gulp, userConfig, browserSync);
