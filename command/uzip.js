const fs = require("fs");
const unzip = require("unzip");
const path = require("path");

fs.createReadStream(`${__dirname}/module.zip`).pipe(unzip.Extract({
    path: path.resolve('./')
}));
