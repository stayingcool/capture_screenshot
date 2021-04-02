"use strict";

var express = require("express"),
  cors = require("cors"),
  https = require("https"),
  fs = require("fs"),
  path = require("path");
var app = express();

const bcrypt = require("bcrypt");
const basicAuth = require("express-basic-auth");

const PORT = 8085;
const HOME_FOLDER = path.join(__dirname, "../../"),
  FRONTEND_PATH = path.join(HOME_FOLDER, "frontend"),
  IMG_PATH = path.join(FRONTEND_PATH, "img"),
  SSL_KEY = path.join(HOME_FOLDER, "server.key"),
  SSL_CERT = path.join(HOME_FOLDER, "server.cert");

const options = {
  key: fs.readFileSync(SSL_KEY),
  cert: fs.readFileSync(SSL_CERT),
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
    .readdirSync(IMG_PATH, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .filter((item) => item.name.endsWith(".sht"))
    .map((item) => `img/${item.name}`);

  const imageList = fileNames.sort((a, b) => (a > b ? -1 : 1));

  res.send(imageList);
});

app.get("/env", cors(), function (req, res) {
  res.status(200).send({
    HOME_FOLDER: HOME_FOLDER,
    SSL_CERT: SSL_CERT,
    SSL_KEY: SSL_KEY,
    FRONTEND_PATH: FRONTEND_PATH,
    IMG_PATH: IMG_PATH,
    cdir: process.cwd(),
    dname: __dirname,
    env: process.env,
  });
});

https.createServer(options, app).listen(PORT, "0.0.0.0", function () {
  console.log("Server listening on port " + PORT);
});
