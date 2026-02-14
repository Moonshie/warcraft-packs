//Initial generate
//Assign variables based on what's selected on screen, check if any are missing, and launch an appropriate generator based on category

function generate() {
    set = setSelect.value;
    pool = sets[setSelect.value];
    precon = precons[setSelect.value];
    category = typeSelect.selectedOptions[0].className;
    type = typeSelect.value;

    if (!set) {
        alert("Please select a valid set.");
        return;
    }
    if (!type) {
        alert("Please select a valid type.");
        return;
    }
    
    if (category === 'sealed') {
        let sealed = generateSealed(set, pool, category, type);
        sealed.forEach(booster => {
            generatedItems.push(booster)
        });
    }
    if (category === 'bigBox') {
        generatedItems.push(generatePreconstructed(set, pool, category, type, precon));
    }
    if (category === 'booster') {
        let extra = filtersFromSelectors(extraFilters[type]);
        generatedItems.push(generateBooster(set, pool, category, type, extra));
    }
    render();
}

//Category --- Sealed
//Generates a number of packs for a sealed format play

function generateSealed(set, pool, category, type) {
    let sealed = [];
    let extra = [];

    if (type === 'Enhanced Sealed') {
        let selectedHero = heroDraft(set);
    }

    Object.entries(sealedTypes[type]).forEach(([boosterType, count]) => { {
        for (let i = 0; i < count; i++) {
            sealed.push(generateBooster(set, pool, 'booster', boosterType, extra));
        }
    }});
    return sealed;
}

//Category --- Preconstructed
//Generates a preconstructed package from a selection of types, like a starter deck

function generatePreconstructed(set, pool, category, type, starters) {
    let item = {
        category: category,
        type: type,
        set: set,
        cardContents: [],
        otherContents: [],
    }

    setArtID(item);

    const heroes = Object.keys(starters);
    const deckList = starters[heroes[Math.floor(Math.random() * heroes.length)]]
    for (let index = 0; index < deckList.length; index++) {
        setNumber = deckList[index]-1;
        item.cardContents.push(pool[setNumber]);
    }
    if (category === 'bigBox') {
        let oversizeHeroesPool = oversize[`${set}Oversize`];
        let oversizeHeroes = [];
        for (let i = 0; i < 3; i++) {
            let card = generateCard(set, oversizeHeroesPool, '', item);
            oversizeHeroes.push(card);
            oversizeHeroesPool = oversizeHeroesPool.filter(element => card != element)
        }
        item.otherContents.push(oversizeHeroes);
        item.otherContents.push(generateBooster(set, pool, 'booster', 'Classic Booster'));
        item.otherContents.push(generateBooster(set, pool, 'booster', 'Classic Booster'));
    }
    return item;
}

//Category --- Booster
//Generates a booster based on selections
//Can be called by other generators to provide boosters 'into' them

function generateBooster(set, pool, category = 'booster', type, extra = []) {
    let item = {
        category: category,
        type: type,
        set: set,
        extra: extra,
        cardContents: []
    };

    setArtID(item);

    slotCounts[type].forEach((count, filters) => {
        Object.assign(filters, extra);
        for (let i = 0; i < count; i++) {
            let card = generateCard(set, pool, filters, item);
            item.cardContents.push(card);
            if (allowDuplicates[type] === false) {
                item['cardContents'].forEach(generatedCard => {
                    pool = pool.filter(card => generatedCard != card)
                });
            }
        }
    });

    return item;
}

//Card Generator
//Main tool to create a single part from a predetermined pool
//Includes upgrade chance and extra filters

function generateCard(set, pool, filters, parentItem) {
    let filterValues;
    let card;
    let upgradedCard;

    let potentialUpgrades = upgradeChances[parentItem.type] || [];
    Object.entries(filters).forEach(([key, value]) => {
        filterValues = Array.isArray(value) ? value : [value];

        potentialUpgrades.forEach((chance, pair) => {
            if (filterValues == pair[0]) {
                if (Math.random() < chance) {
                    let upgradedFilters = structuredClone(filters);
                    upgradedFilters['rarity'] = pair[1];
                    upgradedCard = generateCard(set, pool, upgradedFilters, parentItem)
                }
            }
        });

        pool = pool.filter(card => {
            const cardValue = card[key];
            const cardValues = Array.isArray(cardValue) ? cardValue : [cardValue];
            
            const positiveFilters = filterValues.filter(fv => !fv.startsWith('!'));
            const negativeFilters = filterValues.filter(fv => fv.startsWith('!')).map(fv => fv.slice(1));
            
            if (positiveFilters.length > 0) {
                if (!cardValues.some(cv => positiveFilters.includes(cv))) {
                    return false;
                }
            }
            
            if (negativeFilters.length > 0) {
                if (cardValues.some(cv => negativeFilters.includes(cv))) {
                    return false;
                }
            }
            return true;
        });

    });
    if (pool.length === 0) {
        console.log(`No cards found for filters: ${JSON.stringify(filters)}`);
        card = '';
    }
    if (upgradedCard) {
        return upgradedCard;
    } else {
        card = pool[Math.floor(Math.random() * pool.length)]
        return card;
    }
}