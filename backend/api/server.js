"use strict";

var express = require("express"),
  cors = require("cors"),
  https = require("https"),
  fs = require("fs");

const basicAuth = require("express-basic-auth");
const port = 8085;
const getSecret = () => {
  return "supersecret123";
};

var app = express();
var options = {
  key: fs.readFileSync("../../server.key"),
  cert: fs.readFileSync("../../server.cert"),
  index: "index.html",
};

app.use(
  basicAuth({
    users: { admin: getSecret() },
    challenge: true,
    realm: "Imb4T3st4pp", // TBD - What is this?
  })
);

app.use("/", express.static("../../frontend/", options));

app.get("/images", cors(), function (req, res) {
  let fileNames = fs
    .readdirSync("../../frontend/img", { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .filter((item) => item.name.endsWith(".png"))
    .map((item) => `img/${item.name}`);

  let imageList = fileNames.sort((a, b) => (a > b ? -1 : 1));

  res.send(imageList);
});

https.createServer(options, app).listen(port, "0.0.0.0", function () {
  console.log("Server listening on port " + port);
});
