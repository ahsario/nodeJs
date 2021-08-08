const cluster = require("cluster");
const os = require("os");
const http = require("http");
const fs = require("fs");
const path = require("path");
const reader = require("./index");
const numCPUs = os.cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   for (let i = 0; i < numCPUs; i++) {
//     console.log(`Forking process number ${i}...`);
//     cluster.fork();
//   }
// } else {
//   console.log(`Worker ${process.pid} started...`);

http
  .createServer((request, response) => {
    console.log(`Worker ${process.pid} handle this request...`);

    if (request.method === "GET") {
      reader();
      // Создаем строку, описывающую путь к файлу
      const filePath = path.join(__dirname, "index.html");

      // Создаем объект потока на чтение файла
      readStream = fs.createReadStream(filePath);

      // В заголовке указываем тип контента html
      response.writeHead(200, { "Content-Type": "text/html" });

      // Направляем потока на чтение файла в потока на запись (поток ответа)
      readStream.pipe(response);
    } else if (request.method === "POST") {
      let data = "";

      request.on("data", (chunk) => {
        data += chunk;
      });

      request.on("end", () => {
        const parsedData = JSON.parse(data);
        console.log(parsedData);

        response.writeHead(200, { "Content-Type": "json" });
        response.end(data);
      });
    } else {
      response.statusCode = 405;
      response.end();
    }
  })
  .listen(3000, "localhost");
// }
