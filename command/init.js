"use strict";
const co = require("co");
const prompt = require("co-prompt");
const chalk = require("chalk");
const inquirer = require("inquirer");
const handle = require("./handle");

// console.log((chalk.white(`\n Current Directory -> ` + path.resolve('./'))));
module.exports = () => {
    co(function* () {
        // 处理用户输入
        console.log(
            chalk.green(`
            -----------------------------------
            -----------------------------------

            ██ ███    ██ ██ ████████ ███    ███ 
            ██ ████   ██ ██    ██    ████  ████ 
            ██ ██ ██  ██ ██    ██    ██ ████ ██ 
            ██ ██  ██ ██ ██    ██    ██  ██  ██ 
            ██ ██   ████ ██    ██    ██      ██ 
            
            ----------------------------------- 
            -----------------------------------
                `)
        );

        let projectType = [
            {
                type: "list",
                name: "projectType",
                message: "Please select the project type",
                choices: [
                    {
                        name: "gulp",
                        checked: false,
                    },
                    {
                        name: "vue3",
                        checked: false,
                    },
                ],
            },
        ];

        let gulpQuestions = [
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
        ];

        let vue3Questions = [
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
                name: "gitUrl",
                message: "Add git remote origin",
            },
        ];

        inquirer.prompt(projectType).then((res) => {
            if (res.projectType == "gulp") {
                inquirer.prompt(gulpQuestions).then((answers) => {
                    console.log(
                        chalk.white(
                            "\n Start generating " +
                                res.projectType +
                                " project..."
                        )
                    );
                    handle.gulp(answers);
                });
            } else if (res.projectType == "vue3") {
                inquirer.prompt(vue3Questions).then((answers) => {
                    console.log(
                        chalk.white(
                            "\n Start generating " +
                                res.projectType +
                                " project..."
                        )
                    );
                    handle.vue3(answers);
                });
            }
        });
    });
};
