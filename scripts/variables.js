const rarityRank = {
    "Legendary": 5,
    "Epic": 4,
    "Rare": 3,
    "Uncommon": 2,
    "Common": 1
};
const factionRank = {
    "Alliance": 3,
    "Horde": 2,
    "Neutral": 1,
    undefined: 1, // safety for missing faction
};
const typeRank = {
    "Hero": 5,
    "Ability": 4,
    "Ally": 3,
    "Equipment": 2,
    "Quest": 1,
};
const imageCache = {};
const genButton = document.getElementById("generate");
const menu = document.querySelector(".sidebar");
const track = document.querySelector('.pack-track');
const pack = document.querySelector(".pack");
const previewBox = document.getElementById("preview-box");
const previewImage = document.getElementById("preview-image");
const previewLoader = document.getElementById("preview-loader");
const sealedTypes = ["classic", "enhanced", "starter"];
const sets = {
    hoa: hoa
};

let currentSealedType = '';
let currentSet = '';
let fullSealed = [];