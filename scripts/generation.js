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
        if (type === 'Enhanced Sealed') {
            if (oversize[`${set}Oversize`]) {
                cardDraft(`${set} Oversize`, oversize[`${set}Oversize`], 3);
            } else {
                cardDraft(set, pool.filter(card => card.type === "Hero"), 3)
            }
            return;
        }
        let sealed = generateSealed(set, pool, category, type);
        sealed.forEach(booster => {
            generatedItems.push(booster)
        });
    }
    if (category === 'bigBox') {
        generatedItems.push(generatePreconstructed(set, pool, category, type, precon));
    }
    if (category === 'booster') {
        let extra = filtersFromSelectors(extraFiltersSelectors[type]);
        generatedItems.push(generateBooster(set, pool, category, type, extra));
    }
    
    if (generatedItems.length > 0) {
        render();
    }
}

//Category --- Sealed
//Generates a number of packs for a sealed format play

function generateSealed(set, pool, category, type, extras = {}) {
    let sealed = [];
    console.log(extras);

    Object.entries(sealedTypes[type]).forEach(([boosterType, count]) => {{
        for (let i = 0; i < count; i++) {
            sealed.push(generateBooster(set, pool, 'booster', boosterType, extras[boosterType]));
        }
    }});
    return sealed;
}

function cardDraft(set, pool, count = 3) {
    console.log(pool);
    for (let index = 0; index < count; index++) {
        cardOptions.push(generateCard(set, pool, {}, {}))
        cardOptions.forEach(generatedCard => {pool = pool.filter(card => generatedCard != card)})
    }
    cardOptions.forEach((card, index) => {
        const cardOption = document.createElement("div");
        cardOption.classList.add("card-option");
        cardOption.addEventListener("click", () => chooseCard(index, type))
        const cardImg = document.createElement("img");
        cardImg.src = `./data/cardImg/${set}/${card.setNumber}.jpg`;
        cardOption.appendChild(cardImg);
        cardSelect.appendChild(cardOption);
    })
    toggleMenu('fullscreen');
}

function chooseCard(index, type) {
    if (type === 'Enhanced Sealed') {
        let extras = {};

        Object.entries(sealedTypes[type]).forEach(([key]) => {
            if (extraFilters[key] != undefined) {
                console.log(key);
                let filterPair = {}
                filterPair[extraFilters[key]] = cardOptions[index][extraFilters[key]]
                console.log(filterPair);
                extras[key] = filterPair;
            }
        })

        let sealed = generateSealed(set, pool, category, type, extras);
        console.log(sealed);
        sealed.forEach(booster => {
            generatedItems.push(booster)
        });
    }
    cardDraftCleanup()
    toggleMenu('fullscreen');
    render();
}

function cardDraftCleanup() {
    cardSelect.innerHTML = '';
    cardOptions = [];
    console.log(cardOptions);
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