var express = require("express");
var fs = require("fs");
var app = express();

var options = {
  index: "index.html",
};

app.get("/images", function (req, res) {
  let images = fs
    .readdirSync("./img", { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => `img/${item.name}`);

  res.send(images);
});

app.use("/", express.static("./", options));

var server = app.listen(8085, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("my app is listening at http://%s:%s", host, port);
});
