const { readFile } = require("fs");
const { promisify } = require("util");

const getRandomImage = async () => {
  const readFilePromise = promisify(readFile);
  const data = await readFilePromise("./public/assets/images.json", "utf8");
  const JSONdata = JSON.parse(data);
  const image = JSONdata[Math.floor(Math.random() * JSONdata.length)];
  return image.public_id;
};

module.exports = { getRandomImage };
