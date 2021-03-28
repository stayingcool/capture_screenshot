"use strict";

const screenshot = require("screenshot-desktop");
const TIME_INTERVAL = 1000 * 60; // Every 1 minute

const getDate = () => {
  let today = new Date();
  let currentDate = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  let currentTime = `${today.getHours()}h-${today.getMinutes()}m-${today.getSeconds()}s`;
  today = `${currentDate}-${currentTime}`;

  return today;
};

const takeScreenShot = () => {
  let filename = `${getDate()}.png`;
  screenshot({ filename: `./img/${filename}` }).catch((err) => {
    console.log(err);
  });
};

// Main
setInterval(() => {
  takeScreenShot();
}, TIME_INTERVAL);
