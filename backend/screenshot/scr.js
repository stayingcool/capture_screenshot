"use strict";

const axios = require("axios").default;
const https = require("https");
const screenshot = require("screenshot-desktop");
const TIME_INTERVAL = 1000 * 15; // Every 1 minute

const getDate = () => {
  let today = new Date();

  let dd = today.getDate(),
    mm = today.getMonth() + 1,
    yy = today.getFullYear();

  let h = `${today.getHours()}`.padStart(2, "0"),
    m = `${today.getMinutes()}`.padStart(2, "0"),
    s = `${today.getSeconds()}`.padStart(2, "0");

  let date = `${dd}-${mm}-${yy}`,
    time = `${h}.${m}.${s}`;

  return `${date}-${time}`;
};

const takeScreenShot = () => {
  screenshot({ format: "png" }).then(async (res) => {
    let base64data = Buffer.from(res).toString("base64");

    let data = JSON.stringify({
      value: `data:image/png;base64,${base64data}`,
    });

    let config = {
      method: "post",
      url: "https://localhost:8085/item/",
      headers: {
        Authorization: "Basic YWRtaW46YVFlLlMtKzg3THNvSEFsK3VLN3chaGdUSw==",
        "Content-Type": "application/json",
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};

// Main
setInterval(() => {
  takeScreenShot();
}, TIME_INTERVAL);
