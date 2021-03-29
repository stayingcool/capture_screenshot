"use strict";

const screenshot = require("screenshot-desktop");
const TIME_INTERVAL = 1000 * 60; // Every 1 minute

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
  let filename = `${getDate()}.png`;
  screenshot({ filename: `../../frontend/img/${filename}` })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

// Main
setInterval(() => {
  takeScreenShot();
}, TIME_INTERVAL);
