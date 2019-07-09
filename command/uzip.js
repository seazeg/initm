const fs = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");

let zip = new AdmZip(`${__dirname}/module.zip`); 
zip.extractAllTo(path.resolve('./'));
