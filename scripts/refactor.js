function generateContent(set, type, slotCount, extraFilters) {
    if (type === 'booster') {
        return generateBooster(sets[set], slotCount, extraFilters);
    } else if (type === 'starter') {
        return generateStarter(sets[set], starters[set]);
    }
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

function generateStarter(set, starters) {
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

console.log(generateContent('Azeroth', 'booster', slotCounts['classic']));