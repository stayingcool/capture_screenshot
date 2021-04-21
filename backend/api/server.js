"use strict";

const utils = require("../utils/util");
var express = require("express"),
  cors = require("cors"),
  https = require("https"),
  fs = require("fs"),
  path = require("path");
var app = express();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("mdb");

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
        return authorize(null, passwordMatches);
      } catch (error) {
        debugger;
        console.log(error);
      }
    },
  })
);

app.use("/", express.static("../../frontend/", options));
app.use(express.json({ limit: "50mb" }));

app.get("/images", cors(), function (req, res) {
  const fileNames = fs
    .readdirSync(IMG_PATH, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .filter((item) => item.name.endsWith(".sht"))
    .map((item) => `img/${item.name}`);

  const imageList = fileNames.sort((a, b) => (a > b ? -1 : 1));

  res.send(imageList);
});

app.get("/items/today", cors(), function (req, res) {
  var data = {
    start: req.query.start,
    end: req.query.end,
  };

  let start = utils.getToday();
  let end = utils.getTomorrow();
  if (data && data.start && data.end) {
    start = data.start;
    end = data.end;
  }

  db.all(
    "SELECT key FROM items where key > ? and key < ? ORDER by key DESC",
    [start, end],

    function (err, rows) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      let images = [];
      if (rows) {
        let keys = rows.map((row) => images.push(row.key));
      }
      rows
        ? res.status(200).json({
            status: "ok",
            message: `Found ${rows.length} records`,
            images: images,
          })
        : res.send({ status: "ok", message: "No record founds!" });
    }
  );
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

app.get("/data", cors(), function (req, res) {
  db.run(
    "UPDATE counts SET value = value + 1 WHERE key = ?",
    "counter",
    function (err, row) {
      db.get(
        "SELECT value FROM items where key = ?",
        "one",
        function (err, row) {
          res.send(row.value);
        }
      );
    }
  );
});

app.get("/items/:key", cors(), function (req, res) {
  db.get(
    "SELECT value FROM items where key = ?",
    [req.params.key],
    function (err, row) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      row && row.value
        ? res.send(row.value)
        : res.send({ status: "ok", message: "No record found!" });
    }
  );
});

app.post("/item/", (req, res, next) => {
  let params = [req.body.value];
  let sql =
    "INSERT INTO items (key, value) VALUES (datetime('now','localtime'),?)";

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      lastID: this.lastID,
    });
  });
});

https.createServer(options, app).listen(PORT, "0.0.0.0", function () {
  console.log("Server listening on port " + PORT);
  db.serialize(function () {
    db.run(
      "CREATE TABLE IF NOT EXISTS items (key DATETIME, value BLOB, PRIMARY KEY(key))"
    );
  });
});
