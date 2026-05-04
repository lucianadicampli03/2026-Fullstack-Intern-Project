const fs = require("fs");
const path = require("path");

function loadWordList() {
  const filePath = path.join(__dirname, "..", "data", "words.txt");
  const text = fs.readFileSync(filePath, "utf8");
  const words = text
    .split(/\r?\n/)
    .map((line) => line.trim().toUpperCase())
    .filter((w) => w.length === 5);

  if (words.length === 0) {
    throw new Error("Need at least one 5-letter word in data/words.txt");
  }

  return words;
}

module.exports = { loadWordList };
