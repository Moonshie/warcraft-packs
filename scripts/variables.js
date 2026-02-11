const upgradeChances = new Map([
    [['Rare', 'Epic'], 0.091] // 9.1% chance to upgrade Rare to Epic
])
const imageCache = {};
const generatedItems = []
const renderedItems = [];
const openItems = [];

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
const oversize = {
    'AzerothOversize': AzerothOversize,
    'DarkPortalOversize': DarkPortalOversize,
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
    'Classic Booster': new Map([
        [{'rarity': 'Common'}, 10],
        [{'rarity': 'Uncommon', 'type': '!Hero'}, 3],
        [{'rarity': 'Rare'}, 1],
        [{'type': 'Hero'}, 1]
    ]),
    'New Booster': new Map ([
        [{'rarity': 'Common'}, 12],
        [{'rarity': 'Uncommon', 'type': '!Hero'}, 4],
        [{'rarity': 'Rare'}, 1],
        [{'type': 'Hero'}, 1]
    ]),  
    'Class Booster': new Map ([
        [{'rarity': 'Common', 'type': ['Ability', 'Ally']}, 4],
        [{'rarity': 'Uncommon', 'type': ['Ability', 'Ally']}, 3],
        [{'rarity': 'Rare', 'type': ['Ability', 'Ally']}, 3],
    ]),
    'Equipment Booster': new Map ([
        [{'rarity': 'Uncommon', 'type': 'Equipment'}, 3],
        [{'rarity': 'Rare', 'type': 'Equipment'}, 2]
    ]),
    'Faction Booster': new Map ([
        [{'rarity': 'Common'}, 11],
        [{'rarity': 'Uncommon', 'type': '!Hero'}, 3],
        [{'rarity': 'Rare'}, 1],
    ]),
    'Neutral Booster': new Map ([
        [{'rarity': 'Common', 'faction': '', 'class': ''}, 8],
        [{'rarity': 'Uncommon', 'faction': '', 'class': ''}, 1],
        [{'rarity': 'Rare', 'faction': '', 'class': ''}, 1],
    ]),
}
const outputCounts = {
    'Classic Booster':  [
        ['Hero', 'Hero / Loot'],
        ['', 'Cards']
    ],
    'New Booster': [
        ['Hero', 'Hero / Loot'],
        ['', 'Cards']
    ],
    'Class Booster': [
        ['', "Class Cards"]
    ],
    'Equipment Booster': [
        ['', "Equipment Cards"]
    ],
    'Faction Cards': [
        ['', "Faction Cards"],
    ],
    'Neutral Booster': [
        ['', "Neutral Cards"]
    ],
    'Starter Deck': [
        ['Hero', 'Hero'],
        [['Hero', 'Oversize'], 'Oversize'],
        ['', 'Deck']
    ]
}
const selects = [setSelect, typeSelect, classSelect, factionSelect]
const extraSelects = [classSelect, factionSelect]
const extraFilters = {
    'Class Booster': [classSelect],
    'Equipment Booster': [classSelect],
    'Faction Booster': [factionSelect]
}
const allowDuplicates = {
    'Classic Booster': false,
    'New Booster': false,
    'Class Booster': true,
    'Equipment Booster': true,
    'Faction Booster': false,
    'Neutral Booster': true,
}
const sealedTypes = {
    'Classic Sealed': {'Classic Booster': 6},
    'Enhanced Sealed': {
        'Class Booster': 1,
        'Equipment Booster': 1,
        'Neutral Booster': 1,
        'Faction Booster': 3
    }
}
const availableImages = {
    Azeroth: {
        booster: ['AzerothBooster1', 'AzerothBooster2'],
        bigBox: ['AzerothBigBox']
    },
    DarkPortal: {
        booster: ['DarkPortalBooster1', 'DarkPortalBooster2'],
        bigBox: ['DarkPortalBigBox']
    }
}

const openMenus = {
    left: false,
    center: true,
    right: false,
}

