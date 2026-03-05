// ─────────────────────────────────────────────────────────────
//  DEFINITIONS
//  All game-specific pack, box, and sealed configurations.
//  These are the presets passed into generation.js functions.
//  Sets (card databases) are plug-and-play and not defined here.
// ─────────────────────────────────────────────────────────────


// ── Sorting ───────────────────────────────────────────────────
// Used by the render layer to sort card lists consistently.

const rarityRank = {
    'Legendary': 5,
    'Epic':      4,
    'Rare':      3,
    'Uncommon':  2,
    'Common':    1,
};
const factionRank = {
    'Alliance': 3,
    'Horde':    2,
    '':         1,
};
const typeRank = {
    'Hero':      5,
    'Ability':   4,
    'Ally':      3,
    'Equipment': 2,
    'Quest':     1,
};


// ── Pack definitions ──────────────────────────────────────────
// Each pack definition is passed directly to generatePack().

const ClassicBooster = {
    slots: [
        { filters: { rarity: 'Common' },                  count: 10 },
        { filters: { rarity: 'Uncommon', type: '!Hero' }, count: 3  },
        { filters: { rarity: 'Rare' },                    count: 1  },
        { filters: { type:   'Hero' },                    count: 1  },
    ],
    replacements: [
        {
            condition: { rarity: 'Rare' },
            replace:   { rarity: 'Epic' },
            mode:      'merge',
            chance:    0.091,
            priority:  1,
            limit:     null,
        },
    ],
    allowDuplicates: false,
};

// Class and Equipment boosters are generated with an extra filter
// injected at call time (e.g. { classRestriction: 'Druid' }),
// so the definitions here intentionally leave that open.

const ClassBooster = {
    slots: [
        { filters: { rarity: 'Common',   type: ['Ability', 'Ally'] }, count: 4 },
        { filters: { rarity: 'Uncommon', type: ['Ability', 'Ally'] }, count: 3 },
        { filters: { rarity: 'Rare',     type: ['Ability', 'Ally'] }, count: 2 },
    ],
    replacements: [
        {
            condition: { rarity: 'Uncommon' },
            replace:   { rarity: 'Rare' },
            mode:      'merge',
            chance:    0.5,
            priority:  1,
            limit:     null,
        },
        {
            condition: { rarity: 'Rare' },
            replace:   { rarity: 'Epic' },
            mode:      'merge',
            chance:    0.2,
            priority:  1,
            limit:     null,
        },
    ],
    allowDuplicates: true,
};

const EquipmentBooster = {
    slots: [
        { filters: { rarity: 'Uncommon', type: 'Equipment' }, count: 6 },
    ],
    replacements: [
        {
            condition: { rarity: 'Uncommon' },
            replace:   { rarity: 'Rare' },
            mode:      'merge',
            chance:    0.5,
            priority:  1,
            limit:     null,
        },
        {
            condition: { rarity: 'Rare' },
            replace:   { rarity: 'Epic' },
            mode:      'merge',
            chance:    0.2,
            priority:  1,
            limit:     null,
        },
    ],
    allowDuplicates: true,
};

const FactionBooster = {
    slots: [
        { filters: { rarity: 'Common' },   count: 6 },
        { filters: { rarity: 'Uncommon', type: '!Hero' }, count: 4 },
        { filters: { rarity: 'Rare' },     count: 2 },
    ],
    replacements: [],
    allowDuplicates: false,
};

const NeutralBooster = {
    slots: [
        { filters: { rarity: 'Common',   classRestriction: '', faction: '' }, count: 10 },
        { filters: { rarity: 'Uncommon', classRestriction: '', faction: '' }, count: 1  },
        { filters: { rarity: 'Rare',     classRestriction: '', faction: '' }, count: 1  },
    ],
    replacements: [],
    allowDuplicates: true,
};


// ── Box definitions ───────────────────────────────────────────
// Passed directly to generateBox().
// Note: Class/Faction/Equipment boosters need extra filters
// injected per-entry at call time when used inside sealed boxes.
// For now those are left as separate explicit entries below.

const ClassicSealed = {
    contents: [
        { type: 'pack', definition: ClassicBooster, count: 6 },
    ],
};

// Enhanced Sealed requires a Hero draft first (handled in the
// generate/UI layer), so this definition covers the packs only.
// The Hero card and oversize selection are handled separately.
const EnhancedSealedPacks = {
    contents: [
        { type: 'pack', definition: ClassBooster,     count: 1 },
        { type: 'pack', definition: EquipmentBooster, count: 1 },
        { type: 'pack', definition: FactionBooster,   count: 2 },
        { type: 'pack', definition: NeutralBooster,   count: 1 },
    ],
};

// Oversize heroes draw from the set's oversize pool, not main.
const OversizePack = {
    pool:            'oversize',
    slots:           [{ filters: {}, count: 3 }],
    replacements:    [],
    allowDuplicates: false,
};

// Starter Deck: one random precon deck, 3 oversize heroes (no duplicates),
// and 2 Classic Boosters that spawn onto the track when opened.
const StarterDeck = {
    contents: [
        { type: 'precon', display: 'inline',  count: 1 },
        { type: 'pack',   display: 'inline',  definition: OversizePack, count: 1 },
        { type: 'pack',   display: 'spawned', definition: ClassicBooster, count: 2 },
    ],
};


// ── Available artwork ─────────────────────────────────────────
// Art asset IDs available per set, used by the render layer.

const availableImages = {
    Azeroth: {
        booster: ['AzerothBooster1', 'AzerothBooster2'],
        box:     ['AzerothBigBox'],
    },
    DarkPortal: {
        booster: ['DarkPortalBooster1', 'DarkPortalBooster2'],
        box:     ['DarkPortalBigBox'],
    },
};


// ── Game config ───────────────────────────────────────────────
// Everything ui.js needs to build selectors and handle generation.
// Swap this out entirely to run a different game.

const GameConfig = {
    name: 'World of Warcraft TCG',

    // Sets available in the set selector. Keys become option values.
    sets: {
        'Azeroth':    Azeroth,
        'DarkPortal': DarkPortal,
    },

    // Each entry becomes an option in the type selector.
    //   category:    'booster' | 'box' | 'sealed'
    //   definition:  pack/box definition object, or null for custom logic (e.g. Starter Deck)
    //   extraFilter: key string into extraFilterOptions, or null
    //   artCategory: which key to use in availableImages (defaults to category)
    itemTypes: [
        { name: 'Classic Booster',   category: 'booster', definition: ClassicBooster,      extraFilter: null,              artCategory: 'booster' },
        { name: 'Class Booster',     category: 'booster', definition: ClassBooster,        extraFilter: 'classRestriction', artCategory: 'booster' },
        { name: 'Equipment Booster', category: 'booster', definition: EquipmentBooster,    extraFilter: null,              artCategory: 'booster' },
        { name: 'Faction Booster',   category: 'booster', definition: FactionBooster,      extraFilter: 'faction',         artCategory: 'booster' },
        { name: 'Neutral Booster',   category: 'booster', definition: NeutralBooster,      extraFilter: null,              artCategory: 'booster' },
        { name: 'Starter Deck',      category: 'box',     definition: StarterDeck,         extraFilter: null,              artCategory: 'box'     },
        { name: 'Classic Sealed',    category: 'sealed',  definition: ClassicSealed,       extraFilter: null,              artCategory: 'booster' },
        { name: 'Enhanced Sealed',   category: 'sealed',  definition: EnhancedSealedPacks, extraFilter: null,              artCategory: 'booster' },
    ],

    // Options shown in each extra selector dropdown.
    // Keys match the extraFilter strings used in itemTypes above.
    extraFilterOptions: {
        classRestriction: ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'],
        faction:          ['Alliance', 'Horde'],
    },

    // Label shown above each extra selector in the UI.
    extraFilterLabels: {
        classRestriction: 'Class',
        faction:          'Faction',
    },
};
