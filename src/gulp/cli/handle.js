/*
 * @Author       : Evan.G
 * @Date         : 2022-05-26 14:56:57
 * @LastEditTime : 2022-06-10 17:30:04
 * @Description  : 非通栏模块抽取程序
 *
 * npm i walk js-beautify --save-dev; node handle.js
 */
const fs = require("fs");
const walk = require("walk");
const beautify = require("js-beautify");

const writeFile = (path, content, callback) => {
    fs.appendFile(path, content, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        if (callback) {
            callback();
        }
    });
};

const converter = (data) => {
    let source = data;
    let ratio = 100;
    let res = "";
    if (source) {
        source = beautify.css(source);
        let arr = source.split("\n");
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            let line = arr[i];
            if (!line.includes("@media")) {
                res +=
                    line.replace(
                        /([1-9]\d*.\d*|0?.\d*[1-9]\d*|\d*[1-9]\d*)rem/g,
                        function (rem) {
                            let tmp = rem;
                            if (rem.includes(":")) {
                                rem = rem.replace(":", "");
                            }
                            if (!!rem) {
                                if (
                                    !/border:|text-indent:|z-index:/gi.test(
                                        line
                                    )
                                ) {
                                    if (tmp.includes(":")) {
                                        return (
                                            ":" + parseFloat(rem) * ratio + "px"
                                        );
                                    } else {
                                        return (
                                            " " + parseFloat(rem) * ratio + "px"
                                        );
                                    }
                                } else {
                                    return rem;
                                }
                            } else {
                                return rem;
                            }
                        }
                    ) + "\n";
            } else {
                res += line + "\n";
            }
            res = res.replace(/0rem/gi, "0");
        }
    }
    return res;
};

export const walkDir = (dir, opt) => {
    let walker = walk.walk(dir, opt);
    walker
        .on("file", function (root, fileStats, next) {
            if (/(\.(css))$/.test(fileStats.name)) {
                fs.readFile(
                    `${root}/${fileStats.name}`,
                    "utf-8",
                    function (error, data) {
                        if (error) {
                            console.log("读取文件失败,内容是" + error.message);
                            return;
                        }
                        let reg = `/(\\n?)([ \\t]*)(\\/\\*\\s*1680start\\s*\\*\\/)\\n?([\\s\\S]*?)\\n?(\\/\\*\\s*1680end\\s*\\*\\/)\\n?/ig`;

                        let matchRes = data.match(eval(reg));
                        let mergeContent = "";
                        let writeContent = "";

                        for (let item of matchRes) {
                            mergeContent +=
                                "\n" +
                                converter(
                                    item
                                        .replace(
                                            /(\/\*\s*1680start\s*\*\/)/gi,
                                            ""
                                        )
                                        .replace(
                                            /(\/\*\s*1680end\s*\*\/)/gi,
                                            ""
                                        )
                                );
                        }

                        writeContent = `\n@media screen and (min-width: 1441px) and (max-width: 1680px) {\n${mergeContent}\n}
                         `;

                        writeFile(
                            `${root}/${fileStats.name}`,
                            writeContent,
                            function () {
                                console.log(`<${fileStats.name}>写入成功！`);
                                next();
                            }
                        );
                        next();
                    }
                );

                next();
            } else {
                next();
            }
        })
        .on("error", function (error, entry, stat) {
            console.log("获取错误内容 " + error + " 在 " + entry);
        })
        .on("end", function () {});
};

walkDir("./css/", {});
