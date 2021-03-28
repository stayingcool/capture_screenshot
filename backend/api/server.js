var express = require("express");
var fs = require("fs");
var app = express();
var cors = require("cors");

var options = {
  index: "index.html",
};

app.get("/images", cors(), function (req, res) {
  let images = fs
    .readdirSync("../../frontend/img", { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => `img/${item.name}`);

  res.send(images);
});

app.use("/", express.static("../../frontend/", options));

var server = app.listen(8085, "0.0.0.0", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("my app is listening at http://%s:%s", host, port);
});
