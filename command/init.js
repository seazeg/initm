'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')
const fs = require("fs");
const path = require("path");

// console.log((chalk.white(`\n Current Directory -> ` + path.resolve('./'))));
module.exports = () => {
    co(function* () {
        // 处理用户输入
        let siteName = yield prompt('Site Name:')
        let proSiteId = yield prompt('Produce SiteID: ')
        let proSearchId = yield prompt('Produce SearchID: ')

        let devSiteId = yield prompt('Development SiteID: ')
        let devSearchId = yield prompt('Development SearchID: ')


        console.log(chalk.white('\n Start generating...'))

        exec(`node ${__dirname}/uzip.js`, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                process.exit()
            }


            fs.readFile(path.resolve('./') + `/demo/config.json`, 'utf8', function (err, data) {
                if (err) throw err;
                let list = JSON.parse(data);
                list.pro_template.searchId = proSearchId;
                list.dev_template.searchId = devSearchId;
                list.debug_template.searchId = devSearchId;
                list.preview_template.searchId = devSearchId;
                list.testSiteId = devSiteId
                list.proSiteId = proSiteId
                let newContent = JSON.stringify(list, null, 4);

                fs.writeFile(path.resolve('./') + `/demo/config.json`, newContent, 'utf8', (err) => {
                    if (err) throw err;
                    rename(path.resolve('./demo/'), path.resolve(`./${siteName}`))
                    console.log(chalk.green('\n √ Generation completed!'))
                    console.log(`\n npm install \n`)
                    process.exit()
                });
            });
        })
    })
}

function rename(oldPath, newPath) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            throw err;
        }
    });
}