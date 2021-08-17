const http = require("http");
const fs = require("fs");
const path = require("path");
const io = require("socket.io");

const serv = http
  .createServer((request, response) => {
    if (request.method === "GET") {
      const filePath = path.join(__dirname, "index.html");

      readStream = fs.createReadStream(filePath);

      response.writeHead(200, { "Content-Type": "text/html" });

      readStream.pipe(response);
    } else if (request.method === "POST") {
      let data = "";
      request.on("data", (chunk) => {
        data += chunk;
      });

      request.on("end", () => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "dir") {
          const list = fs.readdirSync(parsedData.dir || __dirname);
          response.writeHead(200, { "Content-Type": "json" });
          console.log("dir", parsedData, list);
          response.end(JSON.stringify(list));
        } else {
          response.writeHead(200, { "Content-Type": "json" });
          filePath = path.join(__dirname, parsedData.fileName);
          let res;
          fs.readFile(filePath, "utf8", (err, data) => {
            const result = data ? data.split("\n") : ["empty file"];
            result.filter((str) => /189.123.1.41/.test(str)).join("\n");
            response.end(JSON.stringify(result));
          });
        }
      });
    } else {
      response.statusCode = 405;
      response.end();
    }
  })
  .listen(3000, "localhost");

const socket = io(serv);

let userCounter = 0;
socket.on("connection", function (socket) {
  console.log("New connection", userCounter);
  const payload = { counter: userCounter };
  socket.emit("SERVER_MSG", payload);
  socket.broadcast.emit("SERVER_MSG", payload);

  socket.on("CLIENT_MSG", (data) => {
    userCounter = userCounter + +data.inc;
    const payload = { counter: userCounter };
    socket.emit("SERVER_MSG", payload);
    socket.broadcast.emit("SERVER_MSG", payload);
  });
});

serv.listen(3000, "localhost");
