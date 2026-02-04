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
};
const typeRank = {
    "Hero": 5,
    "Ability": 4,
    "Ally": 3,
    "Equipment": 2,
    "Quest": 1,
};
const slotCounts = {
    classicBooster: new Map([
        [{'rarity': 'Common'}, 10],
        [{'rarity': 'Uncommon'}, 3],
        [{'rarity': ['Rare', 'Epic']}, 1],
        [{'type': 'Hero'}, 1]
    ]),
    newBooster: new Map ([
        [{'rarity': 'Common'}, 12],
        [{'rarity': 'Uncommon'}, 4],
        [{'rarity': ['Rare', 'Epic']}, 1],
        [{'type': 'Hero'}, 1]
    ]),  
    classAbilityBooster: new Map ([
        [{'rarity': 'Common', 'type': 'Ability'}, 6],
        [{'rarity': 'Uncommon', 'type': 'Ability'}, 5],
        [{'rarity': 'Rare', 'type': 'Ability'}, 4],
    ]),
    allianceBooster: new Map ([
        [{'rarity': 'Common', 'faction': 'Alliance'}, 10],
        [{'rarity': 'Uncommon', 'faction': 'Alliance'}, 3],
        [{'rarity': ['Rare', 'Epic'], 'faction': 'Alliance'}, 2],
    ]),
    hordeBooster: new Map ([
        [{'rarity': 'Common', 'faction': 'Horde'}, 10],
        [{'rarity': 'Uncommon', 'faction': 'Horde'}, 3],
        [{'rarity': ['Rare', 'Epic'], 'faction': 'Horde'}, 2],
    ]),
    universalBooster: new Map ([
        [{'rarity': 'Common', 'faction': '', 'class': ''}, 10],
        [{'rarity': 'Uncommon', 'faction': '', 'class': ''}, 3],
        [{'rarity': ['Rare', 'Epic'], 'faction': '', 'class': ''}, 2],
    ]),
}
const sealedTypes = {
    classicSealed: {'classicBooster': 6},
    enhancedSealed: {
        'classAbilityBooster': 1,
        'universalBooster': 2,
        'factionBooster': 3
    }
}

const upgradeChances = new Map([
    [['Rare', 'Epic'], 0.091] // 9.1% chance to upgrade Rare to Epic
])
const imageCache = {};
const generatedItems = {};

const genButton = document.getElementById("generate");
const menu = document.querySelector(".sidebar");
const track = document.querySelector('.pack-track');
const pack = document.querySelector(".pack");
const box = document.querySelector(".box");
const setSelect = document.querySelector("#set-select");
const typeSelect = document.querySelector("#type-select");
const previewBox = document.getElementById("preview-box");
const previewImage = document.getElementById("preview-image");
const previewLoader = document.getElementById("preview-loader");

const sets = {
    'Azeroth': Azeroth,
    'DarkPortal': DarkPortal,
};
const precons = {
    'Azeroth': AzerothPrecons,
    'DarkPortal': DarkPortalPrecons
}

let currentSealedType = '';
let currentSet = '';
let itemsOnScreen = 0;