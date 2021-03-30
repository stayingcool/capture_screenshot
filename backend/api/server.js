"use strict";

var express = require("express"),
  cors = require("cors"),
  https = require("https"),
  fs = require("fs");
var app = express();

const bcrypt = require("bcrypt");
const basicAuth = require("express-basic-auth");

const port = 8085;
const options = {
  key: fs.readFileSync("../../server.key"),
  cert: fs.readFileSync("../../server.cert"),
  index: "index.html",
};

const USER_HASH = {
  admin: "$2b$13$54Lw20MoIk2ghuXu2/lKcOw2AtTo8t.hJhIq6rhe5j6.pa68iSQpu",
};

app.use(
  basicAuth({
    authorizeAsync: true,
    challenge: true,
    authorizer: async (username, password, authorize) => {
      const passwordHash = USER_HASH[username];
      try {
        const passwordMatches = await bcrypt.compare(password, passwordHash);
        console.log("passwordMatches: " + passwordMatches);
        return authorize(null, passwordMatches);
      } catch (error) {
        debugger;
        console.log(error);
      }
    },
  })
);

app.use("/", express.static("../../frontend/", options));

app.get("/images", cors(), function (req, res) {
  const fileNames = fs
    .readdirSync("../../frontend/img", { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .filter((item) => item.name.endsWith(".sht"))
    .map((item) => `img/${item.name}`);

  const imageList = fileNames.sort((a, b) => (a > b ? -1 : 1));

  res.send(imageList);
});

https.createServer(options, app).listen(port, "0.0.0.0", function () {
  console.log("Server listening on port " + port);
});
