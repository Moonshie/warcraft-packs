const upgradeChances = new Map([
    [['Rare', 'Epic'], 0.091] // 9.1% chance to upgrade Rare to Epic
])
const imageCache = {};
const generatedItems = []
const renderedItems = [];

const root = document.querySelector(':root');
const genButton = document.getElementById("generate");
const left = document.querySelector(".sidebar#left");
const center = document.querySelector(".menu-wrapper");
const right = document.querySelector(".sidebar#right");
const track = document.querySelector('.item-track');
const pack = document.querySelector(".pack");
const box = document.querySelector(".box");
const setSelect = document.querySelector("#set-select");
const typeSelect = document.querySelector("#type-select");
const classSelect = document.querySelector("#class-select");
const factionSelect = document.querySelector("#faction-select");
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
        [{'rarity': 'Uncommon', 'type': '!Hero'}, 3],
        [{'rarity': 'Rare'}, 1],
        [{'type': 'Hero'}, 1]
    ]),
    newBooster: new Map ([
        [{'rarity': 'Common'}, 12],
        [{'rarity': 'Uncommon', 'type': '!Hero'}, 4],
        [{'rarity': 'Rare'}, 1],
        [{'type': 'Hero'}, 1]
    ]),  
    abilityBooster: new Map ([
        [{'rarity': 'Common', 'type': 'Ability'}, 6],
        [{'rarity': 'Uncommon', 'type': 'Ability'}, 5],
        [{'rarity': 'Rare', 'type': 'Ability'}, 4],
    ]),
    equipmentBooster: new Map ([
        [{'rarity': 'Uncommon', 'type': 'Equipment'}, 6],
        [{'rarity': 'Rare', 'type': 'Equipment'}, 4]
    ]),
    factionBooster: new Map ([
        [{'rarity': 'Common'}, 10],
        [{'rarity': 'Uncommon', 'type': '!Hero'}, 3],
        [{'rarity': 'Rare'}, 2],
    ]),
    neutralBooster: new Map ([
        [{'rarity': 'Common', 'faction': '', 'class': ''}, 10],
        [{'rarity': 'Uncommon', 'faction': '', 'class': ''}, 3],
        [{'rarity': 'Rare', 'faction': '', 'class': ''}, 2],
    ]),
}
console.log(slotCounts);
const selects = [setSelect, typeSelect, classSelect, factionSelect]
const extraSelects = [classSelect, factionSelect]

const extraFilters = {
    abilityBooster: [classSelect],
    equipmentBooster: [classSelect],
    factionBooster: [factionSelect]
}
const sealedTypes = {
    classicSealed: {'classicBooster': 6},
    enhancedSealed: {
        'classAbilityBooster': 1,
        'universalBooster': 2,
        'factionBooster': 3
    }
}
const availableImages = {
    Azeroth: {
        booster: ['AzerothBooster1', 'AzerothBooster2'],
        box: ['AzerothBox']
    },
    DarkPortal: {
        booster: ['DarkPortalBooster1', 'DarkPortalBooster2'],
        box: ['DarkPortalBox']
    }
}
const openMenus = {
    left: false,
    center: true,
    right: false,
}

