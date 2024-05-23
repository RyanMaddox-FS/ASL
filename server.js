const http = require("http");

const app = require("./app");

const port = 8080;

http.createServer(app).listen(port || 3000, () => {
  console.log(`Server running on port: ${port}`);
});
