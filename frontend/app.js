"use strict";

const arrayImagesElement = document.getElementById("arrayImages");

function createImageNode(fileName) {
  let image = document.createElement("img");
  image.setAttribute("data-lazy", fileName);
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
  const images = await getImages();
  images.forEach((img) => {
    const altText = img;

    let h3 = document.createElement("H3");
    let text = document.createTextNode(altText);
    h3.appendChild(text);
    arrayImagesElement.appendChild(h3);

    arrayImagesElement.appendChild(createImageNode(img, altText));
  });

  showImages();
}

function showImages() {
  const targets = document.querySelectorAll("img");

  targets.forEach(lazyLoad);
}

main();
