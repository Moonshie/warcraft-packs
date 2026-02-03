function generateContent(set, type, rarityCount, extra='') {
    if (type === 'booster') {
        return generateBooster(sets[set], rarityCount, extra);
    } else if (type === 'starter') {
        return generateStarter(sets[set], starters[set]);
    }
}

function generateBooster(set, rarityCount, extra) {
    let item = {
        type: "booster",
        contents: []
    };
    Object.entries(rarityCount).forEach(([rarity, count]) => {
        for (let i = 0; i < count; i++) {
            let card = generateCard(set, 'rarity', rarity, extra);
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

function generateCard(set, _rarity, rarityValue, extra) {
    extraFilters = Object.entries(extra);
    let pool = set;
    extraFilters.forEach(([key, value]) => {
        pool = pool.filter(card => value.includes(card[key]));
    });
    if (rarityValue === 'Rare' && Math.random() <= upgradeChances.rareToEpic) {
        rarityValue = 'Epic';
    }
    potentialPool = pool.filter(card => card.rarity === rarityValue);
    if (potentialPool.length === 0) {
        rarityValue = 'Rare';
        pool = pool.filter(card => card.rarity === rarityValue);
        return pool[Math.floor(Math.random() * pool.length)];
    }
    return potentialPool[Math.floor(Math.random() * potentialPool.length)];
}

const extra = {
    "class": ["Druid"],
    "type": ["Ability"]
}

console.log(generateContent('hoa', 'booster', rarityCounts['classic']));