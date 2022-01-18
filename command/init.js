"use strict";
const exec = require("child_process").exec;
const co = require("co");
const prompt = require("co-prompt");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const shell = require("shelljs");

// console.log((chalk.white(`\n Current Directory -> ` + path.resolve('./'))));
module.exports = () => {
    co(function* () {
        // 处理用户输入
        console.log(chalk.blue("Please enter the basic information"));
        let questions = [
            {
                type: "input",
                name: "siteName",
                message: "Site Name",
                default: function () {
                    return "demo";
                },
            },
            {
                type: "input",
                name: "proSiteId",
                message: "Production SiteID",
                validate: function (value) {
                    let pass = value.match(/^[0-9]*$/i);
                    if (pass) {
                        return true;
                    }
                    return "Please enter a valid SiteID";
                },
            },
            {
                type: "input",
                name: "devSiteId",
                message: "Development SiteID",
                validate: function (value) {
                    let pass = value.match(/^[0-9]*$/i);
                    if (pass) {
                        return true;
                    }
                    return "Please enter a valid SiteID";
                },
            },
            {
                type: "input",
                name: "gitUrl",
                message: "Add git remote origin",
            },
            // {
            //     type: 'confirm',
            //     name: 'isEditor',
            //     message: 'Whether to visualize editing?',
            //     default: false
            // },
            // {
            //     type: 'checkbox',
            //     name: 'library',
            //     message: 'Select a supported library',
            //     choices: [
            //         new inquirer.Separator(' = JS library = '),
            //         {
            //             name: 'jquery.cookie',
            //             checked: true
            //         },
            //         {
            //             name: 'jquery.base64',
            //             checked: false
            //         },
            //         {
            //             name: 'jquery.jUploader',
            //             checked: true
            //         },
            //         {
            //             name: 'mobiscroll',
            //             checked: true
            //         },
            //         {
            //             name: 'laydate',
            //             checked: true
            //         },
            //         {
            //             name: 'zepto',
            //             checked: true
            //         },
            //         {
            //             name: 'egUtils',
            //             checked: true
            //         },
            //         new inquirer.Separator(' = IE HTC = '),
            //         {
            //             name: 'PIE.htc',
            //             checked: true
            //         },
            //         {
            //             name: 'backgroundsize.min.htc',
            //             checked: true
            //         }
            //     ]
            // }
        ];

        inquirer.prompt(questions).then((answers) => {
            // console.log(JSON.stringify(answers, null, '  '));

            console.log(chalk.white("\n Start generating..."));

            exec(`node ${__dirname}/uzip.js`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    process.exit();
                }

                fs.readFile(
                    path.resolve("./") + `/demo/config.json`,
                    "utf8",
                    function (err, data) {
                        if (err) throw err;
                        let list = JSON.parse(data);
                        list.testSiteId = answers.devSiteId;
                        list.proSiteId = answers.proSiteId;

                        let newContent = JSON.stringify(list, null, 4);
                        fs.writeFile(
                            path.resolve("./") + `/demo/config.json`,
                            newContent,
                            "utf8",
                            (err) => {
                                if (err) throw err;
                                rename(
                                    path.resolve("./") + "/demo",
                                    path.resolve("./") +
                                        `/${answers.siteName}_site`
                                );

                                if (answers.gitUrl) {
                                    shell.exec("git init");
                                    shell.exec(
                                        `git remote add origin ${answers.gitUrl}`
                                    );
                                    shell.exec(
                                        `git add .;git commit -m 'init';git push -u origin master`
                                    );
                                }

                                console.log(
                                    chalk.green("\n √ Generation completed!")
                                );
                                console.log(
                                    `\n npm install --registry https://registry.npm.taobao.org \n`
                                );
                                process.exit();
                            }
                        );
                    }
                );
            });
        });
    });
};

function rename(oldPath, newPath) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            throw err;
        }
    });
}

function copy(oldPath, newPath) {
    fs.copyFile(oldPath, newPath, function (err) {
        if (err) {
            throw err;
        }
    });
}
