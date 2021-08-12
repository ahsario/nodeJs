#!/usr/bin/env node

// const colors = require("colors/safe");
// const EventEmitter = require("events");

// let a = process.argv[2];
// let b = process.argv[3];

// const parseDate = (dateString) => {
//   const [hours, days, months, years] = dateString.split("-");

//   return new Date(years, months, days, hours);
// };

// class Timer {
//   constructor(parsedDate) {
//     this.type = "showTimer";
//     this.date = parsedDate;
//   }
// }

// class Handler {
//   static showTimer(payload) {
//     const interval = setInterval(() => {
//       console.log(
//         colors.bgGreen(`${Math.ceil((payload - new Date()) / 1000)} секунд`),
//         payload
//       );
//     }, 1000);

//     if (Math.ceil((payload - new Date()) / 1000) <= 0) {
//       console.log(colors.bold("время вышло"));
//       clearInterval(interval);
//     }
//   }
// }

// class MyEmitter extends EventEmitter {}

// const emitterObject = new MyEmitter();

// emitterObject.on("showTimer", Handler.showTimer);

// process.argv.forEach((date) => {
//   if (date !== process.argv[0] && date !== process.argv[1]) {
//     const parsedDate = parseDate(date);
//     emitterObject.emit("showTimer", new Timer(parsedDate).date);
//   }
// });

// setTimeout(
//   () => fs.writeFile(`%89.123.1.41%_requests.log`, filteredLogs),
//   5000
//   );
// const transformStream = new Transform({
// const writeStream = fs.createWriteStream("./transformed.log", "utf8");
//   transform(chunk, encoding, callback) {
//     const transformedChunk = chunk
//       .toString()
//       .replace(/127.0.0.1/g, "-----0000000-----");

//     this.push(transformedChunk);
//     /89.123.1.41/g.test(transformedChunk) && console.log("test-----");
//     callback();
//   },
// });

// readStream.pipe(transformStream).pipe(writeStream);

// lesson 3---

// const fs = require("fs");
// const { Transform } = require("stream");

// let logs89_123_1_41 = [];
// let logs34_48_240_111 = [];
// const readStream = fs.createReadStream("./access.log", {
//   highWaterMark: 1024,
//   encoding: "utf-8",
// });
// readStream.on("data", (chunk) => {
//   const logs = chunk.split("/n");
//   const log89_123_1_41 = logs.filter((log) => /89.123.1.41/g.test(log));
//   const log34_48_240_111 = logs.filter((log) => /34.48.240.111/g.test(log));

//   log89_123_1_41.forEach((element) => {
//     logs89_123_1_41.push(element);
//   });
//   log34_48_240_111.forEach((element) => {
//     logs34_48_240_111.push(element);
//   });
// });
// setTimeout(() => {
//   fs.writeFile(
//     `%89.123.1.41%_requests.log`,
//     logs89_123_1_41.join("\n"),
//     { flag: "a" },
//     (err) => console.log(err)
//   );
//   fs.writeFile(
//     `%34.48.240.111%_requests.log`,
//     logs34_48_240_111.join("\n"),
//     { flag: "a" },
//     (err) => console.log(err)
//   );
//   fs.writeFile("arr.json", jsonArr, { flag: "a" }, (err) => console.log(err));
// }, 2000);

// lesson_4

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const colors = require("colors/safe");

console.log("script started");

const reader = () => {
  const isFile = (fileName) => {
    return fs.lstatSync(fileName).isFile();
  };

  let dirPath;
  let responseData;

  inquirer
    .prompt([
      {
        name: "dirName",
        type: "string",
        message: "Choose directory:",
      },
    ])
    .then((answer) => {
      dirPath = answer.dirName || __dirname;
      console.log("prompt", dirPath);

      const choseDir = () => {
        console.log("dirPath", dirPath);
        const list = fs.readdirSync(dirPath);

        if (list.length === 0) {
          console.log(
            colors.red(dirPath) + colors.bgRed(" doesn`t have any file")
          );
        } else {
          let filePath;

          inquirer
            .prompt([
              {
                name: "fileName",
                type: "list",
                message: "Choose file:",
                choices: list,
              },
            ])
            .then((answer) => {
              filePath = path.join(dirPath, answer.fileName);
              if (!isFile(filePath)) {
                dirPath = filePath;
                choseDir();
              } else {
                inquirer
                  .prompt([
                    {
                      name: "searchStr",
                      type: "string",
                      message: "Choose string:",
                    },
                  ])
                  .then((answer) => {
                    const regExp = answer.searchStr
                      ? new RegExp(answer.searchStr)
                      : /189.123.1.41/;
                    fs.readFile(filePath, "utf8", (err, data) => {
                      const result = data.split("\n");
                      responseData = result
                        .filter((str) => regExp.test(str))
                        .join("\n");
                      console.log(responseData);
                      fs.writeFile(
                        "/Users/akochiev/Desktop/nodeJs/index.html",
                        responseData,
                        (err) => {
                          console.log;
                        }
                      );
                    });
                  });
              }
            });
        }
      };

      choseDir();
    });
  return responseData;
};

reader();
