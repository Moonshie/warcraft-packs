function generate() {
    set = sets[setSelect.value];
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

    console.log(set, precon, category, type)
    
    if (category === 'sealed') {
        item = generateSealed(set, type);
    }
    if (category === 'preconstructed') {
        item = generatePreconstructed(set, precon);
    }
    if (category === 'booster') {
        item = generateBooster(set, slotCounts[type])
    }
    console.log(item);
}

function generateSealed(set, type) {
    let item = {
        type: "sealed",
        contents: []
    };
    Object.entries(sealedTypes[type]).forEach(([boosterType, count]) => { {
        for (let i = 0; i < count; i++) {
            let booster = generateBooster(set, slotCounts[boosterType])
            item.contents.push(booster);
        }
    }});
    return item;
}

function generateBooster(set, slotCount, extraFilters) {
    let item = {
        type: "booster",
        contents: []
    };
    console.log(slotCount)
    slotCount.forEach((count, filters) => {
        Object.assign(filters, extraFilters);
        for (let i = 0; i < count; i++) {
            let card = generateCard(set, filters);
            item.contents.push(card);
        }});
    return item;
}

function generatePreconstructed(set, starters) {
    let item = {
        type: "starter",
        contents: []
    }
    const heroes = Object.keys(starters);
    const deckList = starters[heroes[Math.floor(Math.random() * heroes.length)]]
    for (let index = 0; index < deckList.length; index++) {
        setNumber = deckList[index]-1;
        item.contents.push(set[setNumber]);
    }
    return item;
}

function generateCard(set, filters) {
    let pool = set;
    let filterValues;
    Object.entries(filters).forEach(([key, value]) => {
        filterValues = Array.isArray(value) ? value : [value];
        pool = pool.filter(card => {
            const cardValue = card[key];
            const cardValues = Array.isArray(cardValue) ? cardValue : [cardValue];
            return cardValues.some(cv => filterValues.includes(cv));
        });
    });
    if (pool.length === 0) {
        throw new Error(`No cards found for filters: ${JSON.stringify(filters)}`);
    }
    upgradeChances.forEach((chance, pair) => {
        if (pair.every(filterValue => filterValues.includes(filterValue)) && Math.random() < chance) {
            console.log("Upgrading card rarity");
            pool = pool.filter(card => card.rarity === pair[1]);
        }
    })
    return pool[Math.floor(Math.random() * pool.length)];
}