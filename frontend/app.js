"use strict";

const arrayImagesElement = document.getElementById("arrayImages");

async function createImageNode(fileName) {
  let image = document.createElement("img");
  image.setAttribute("data-lazy", fileName);

  console.log("`https://localhost:8085/items/${fileName}`:");
  console.log(`https://localhost:8085/items/${fileName}`);

  // var newImage = new Image();
  let img = await fetch(`https://localhost:8085/items/${fileName}`);
  let imgD = await img.text();
  image.src = imgD;
  image.setAttribute("data-lazy", image.src);
  image.setAttribute("class", "fade");
  document.body.appendChild(image);

  return image;
}

const getImages = async () => {
  let response = await fetch("https://localhost:8085/images");
  let images = await response.json();
  return images;
};

const lazyLoad = (target) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("data-lazy");

        img.setAttribute("src", src);
        img.classList.add("fade");

        observer.disconnect();
      }
    });
  });

  io.observe(target);
};

async function main() {
  // const images = await getImages();
  // images.forEach((img) => {
  //   const altText = img;

  //   let h3 = document.createElement("H3");
  //   let text = document.createTextNode(altText);
  //   h3.appendChild(text);
  //   arrayImagesElement.appendChild(h3);

  //   arrayImagesElement.appendChild(createImageNode(img, altText));
  // });
  const input = document.getElementById("appt");
  input.addEventListener("change", updateValue);

  let date = new Date();
  const dd = String(date.getDate()).padStart(2, "0"),
    mm = String(date.getMonth() + 1).padStart(2, "0"),
    yy = date.getFullYear(),
    hh = String(date.getHours() + 1).padStart(2, "0"),
    min = String(date.getMinutes() + 1).padStart(2, "0");
  var start = `${yy}-${mm}-${dd} ${hh}:${min}:00`;
  var end = `${yy}-${mm}-${dd} ${hh}:${min}:59`;
  var listURL = `https://localhost:8085/items/today?start=${start}&end=${end}`;

  getImagesFromDB(listURL);

  function updateValue(e) {
    const myNode = document.getElementById("arrayImages");
    myNode.innerHTML = "";

    let date = new Date();
    const dd = String(date.getDate()).padStart(2, "0"),
      mm = String(date.getMonth() + 1).padStart(2, "0"),
      yy = date.getFullYear();
    start = `${yy}-${mm}-${dd} ${e.target.value}:00`;
    end = `${yy}-${mm}-${dd} ${e.target.value}:59`;
    console.log(`updateValue: start: ${start}`);
    console.log(`updateValue: end: ${end}`);
    listURL = `https://localhost:8085/items/today?start=${start}&end=${end}`;
    getImagesFromDB(listURL);
  }

  async function getImagesFromDB(url) {
    console.log(`https://localhost:8085/items/today?start=${start}&end=${end}`);
    let response = await fetch(listURL);
    var data = await response.json();
    const images = data.images;

    images.forEach(async (i) => {
      const altText = i;

      let h3 = document.createElement("H3");
      let text = document.createTextNode(altText);
      h3.appendChild(text);
      arrayImagesElement.appendChild(h3);

      arrayImagesElement.appendChild(createImageNode(i, altText));
    });
  }

  showImages();
}

async function showImages() {
  const targets = document.querySelectorAll("img");

  targets.forEach(lazyLoad);
}

main();
