'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const fs = require("fs");
const path = require("path");
const inquirer = require('inquirer');

// console.log((chalk.white(`\n Current Directory -> ` + path.resolve('./'))));
module.exports = () => {
    co(function* () {
        // 处理用户输入
        console.log(chalk.blue('Please enter the basic information'));
        let questions = [{
                type: 'input',
                name: 'siteName',
                message: "Site Name",
                default: function () {
                    return 'demo';
                }
            },
            {
                type: 'input',
                name: 'proSiteId',
                message: "Produce SiteID",
                validate: function (value) {
                    var pass = value.match(
                        /^[0-9]*$/i
                    );
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid SiteID';
                }
            },
            {
                type: 'input',
                name: 'devSiteId',
                message: "Development SiteID",
                validate: function (value) {
                    var pass = value.match(
                        /^[0-9]*$/i
                    );
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid SiteID';
                }
            },
            {
                type: 'input',
                name: 'proSearchId',
                message: "Produce SearchID",
                validate: function (value) {
                    var pass = value.match(
                        /^[0-9]*$/i
                    );
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid SearchID';
                }
            },
            {
                type: 'input',
                name: 'devSearchId',
                message: "Development SearchID",
                validate: function (value) {
                    var pass = value.match(
                        /^[0-9]*$/i
                    );
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid SearchID';
                }
            },
            {
                type: 'confirm',
                name: 'isEditor',
                message: 'Whether to visualize editing?',
                default: false
            },
            {
                type: 'checkbox',
                name: 'library',
                message: 'Select a supported library',
                choices: [
                    new inquirer.Separator(' = CSS UI library = '),
                    {
                        name: 'obox',
                        checked: true
                    },
                    new inquirer.Separator(' = JS library = '),
                    {
                        name: 'jQuery 1.8',
                        checked: true
                    },
                    {
                        name: 'egUitls',
                        checked: true
                    },
                ]
            }
        ];

        inquirer.prompt(questions).then(answers => {
            console.log(JSON.stringify(answers, null, '  '));

            console.log(chalk.white('\n Start generating...'))

            exec(`node ${__dirname}/uzip.js`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error)
                    process.exit()
                }
    
                fs.readFile(path.resolve('./') + `/demo/config.json`, 'utf8', function (err, data) {
                    if (err) throw err;
                    let list = JSON.parse(data);
                    list.pro_template.searchId = answers.proSearchId;
                    list.dev_template.searchId = answers.devSearchId;
                    list.debug_template.searchId = answers.devSearchId;
                    list.preview_template.searchId = answers.devSearchId;
                    list.testSiteId = answers.devSiteId
                    list.proSiteId = answers.proSiteId

                    if(answers.isEditor){
                        list.dev_template.editorJS = `<script src=''></script>`
                        list.debug_template.editorJS = `<script src=''></script>`
                        list.preview_template.editorJS = `<script src=''></script>`
                    }

                    let newContent = JSON.stringify(list, null, 4);
    
                    fs.writeFile(path.resolve('./') + `/demo/config.json`, newContent, 'utf8', (err) => {
                        if (err) throw err;
                        rename(path.resolve('./demo/'), path.resolve(`./${answers.siteName}`))
                        console.log(chalk.green('\n √ Generation completed!'))
                        console.log(`\n npm install \n`)
                        process.exit()
                    });
                });
            })

        });



       
    })
}

function rename(oldPath, newPath) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            throw err;
        }
    });
}