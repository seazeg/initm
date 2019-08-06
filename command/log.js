const shell = require('shelljs')
const rd = require('rd');
const fs = require('fs');

let logs = {}
// 异步遍历目录下的所有文件
rd.each('./static', function (f, s, next) {
  if (f.includes('.shtml')) {
    init(f);
  }
  next();
}, function (err) {
  if (err) throw err;
});

function getLog(file) {
  let _cmd = `git log --oneline --date=default --pretty=format:'{"author":"%an","date":"%cd"},' ${file}  \
  $@ | \
  perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
  perl -pe 's/},]/}]/'`
  return new Promise((resolve, reject) => {
    shell.exec(_cmd, (code, stdout, stderr) => {
      if (code) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

async function init(file) {

    let _gitLog = await getLog(file);
    let author = JSON.parse(_gitLog)[JSON.parse(_gitLog).length - 1].author
    if (logs[author]) {
      logs[author].push(file)
    } else {
      logs[author] = [file];
    }
}

function createFile(content) {
  fs.writeFile('./preview/index.shtml', content, function (err) {
    console.log('ok');
  })
}

setTimeout(() => {
  let list = ``
  for (let log in logs) {
    list += `<div class="box"><div class="inside"><h1>${log}<span class="num">共${logs[log].length}个</span></h1><ul>`
    for (let item of logs[log]) {
      list += `<li>☃ <a href="${item.replace('/static','/preview')}">${item.split('/')[item.split('/').length-1]}</a></li>`
    }
    list += `</ul></div></div>`
  }

  // console.log(list);
  let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>目录</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              list-style: none;
          }

          h1 {
            border-bottom:5px solid rgb(218, 73, 73);
            display: inline-block;
            padding:0 5px 5px 5px;
            text-align: left;
            display: block;
          }

          .num{
            float: right;
            font-size: 20px;
            position: relative;
            top: 20px;
          }

          .main {
              width: 100%;
              font-size: 0;
          }

          ul {
              padding-top:10px;
              height: 400px;
              overflow: auto;
          }

          li {
            font-size:14px;
            padding: 5px 0;
          }

          li:hover{
              color:rgb(218, 73, 73)
          }

          li:hover a{
            color:rgb(218, 73, 73)
          }

          a {
            font-size:14px;
            color:#111;
            vertical-align: text-top;
            text-decoration: none;
          }

          .box {
              width: 33.3%;
              height: 500px;
              font-size: 20px;
              display: inline-block;
              overflow: hidden;
          }

          .box:nth-child(odd) {
              background: #e9e8e8;
          }

          .box:nth-child(even) {
              border-bottom: 5px solid #e9e8e8;
          }

          .inside {
              height: 100%;
              margin: 20px;
          }
      </style>
  </head>
  <body>
      <div class="main">
          ${list}       
      </div>
  </body>
  </html>`
  createFile(html)
}, 5000);