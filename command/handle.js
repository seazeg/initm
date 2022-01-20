/*
 * @Author       : Evan.G
 * @Date         : 2019-04-01 13:56:29
 * @LastEditTime : 2022-01-20 15:48:33
 * @Description  :
 */

const fs = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");

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

const handle = {
    vue3: (answers) => {
        // console.log(`${path.resolve(__dirname, "..")}/libs/vue3.zip`);

        let zip = new AdmZip(`${path.resolve(__dirname, "..")}/libs/vue3.zip`);
        zip.extractAllTo(path.resolve("./"));

        rename(
            path.resolve("./") + "/src/demo",
            path.resolve("./") + `/src/${answers.siteName}`
        );

        if (answers.gitUrl) {
            shell.exec("git init");
            shell.exec(`git remote add origin ${answers.gitUrl}`);
            shell.exec(
                `git add .;git commit -m 'init';git push -u origin master`
            );
        }

        console.log(chalk.green("\n √ Generation completed!"));
        console.log(
            `\n npm install --registry https://registry.npm.taobao.org \n`
        );
    },
    gulp: (answers) => {
        let zip = new AdmZip(`${path.resolve(__dirname, "..")}/libs/gulp.zip`);
        zip.extractAllTo(path.resolve("./"));
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
                            path.resolve("./") + `/${answers.siteName}_site`
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

                        console.log(chalk.green("\n √ Generation completed!"));
                        console.log(
                            `\n npm install --registry https://registry.npm.taobao.org \n`
                        );
                        process.exit();
                    }
                );
            }
        );
    },
};

module.exports = handle;
