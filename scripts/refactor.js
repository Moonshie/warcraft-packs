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
    
    if (category === 'sealed') {
        generateSealed(set, type);
    }
    if (category === 'preconstructed') {
        generatePreconstructed(set, precon);
    }
    if (category === 'booster') {
        generateBooster(set, slotCounts[type]);
    }
    render();
    console.log(generatedItems);
    console.log(renderedItems);
}

function generateSealed(set, type) {
    if (type === 'enhancedSealed') {
        enhancedSealed(set)
    }
    Object.entries(sealedTypes[type]).forEach(([boosterType, count]) => { {
        for (let i = 0; i < count; i++) {
            generateBooster(set, slotCounts[boosterType]);
        }
    }});
}

function generateBooster(set, slotCount, extraFilters) {
    let item = {
        type: "booster",
        set: setSelect.value,
        contents: []
    };
    slotCount.forEach((count, filters) => {
        Object.assign(filters, extraFilters);
        for (let i = 0; i < count; i++) {
            let card = generateCard(set, filters);
            item.contents.push(card);
        }});
    generatedItems.push(item);
}

function generatePreconstructed(set, starters) {
    let item = {
        type: "box",
        set: setSelect.value,
        contents: []
    }
    const heroes = Object.keys(starters);
    const deckList = starters[heroes[Math.floor(Math.random() * heroes.length)]]
    for (let index = 0; index < deckList.length; index++) {
        setNumber = deckList[index]-1;
        item.contents.push(set[setNumber]);
    }
    generatedItems.push(item);
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
            pool = pool.filter(card => card.rarity === pair[1]);
        }
    })
    return pool[Math.floor(Math.random() * pool.length)];
}

function render() {
    generatedItems.forEach(item => {
        renderItem(item);
        renderedItems.push(item);
    });
    generatedItems.length = 0;
}

function renderItem(item) {
    const cloneWrapper = document.querySelector(`.${item.type}-wrapper`).cloneNode(true);
    const clone = cloneWrapper.querySelector(`.${item.type}`);
    const cloneOutput = clone.querySelector('.output');
    clone.id = renderedItems.length;
    cloneOutput.id = `${renderedItems.length}-output`;

    if (availableImages[item.set]) {
        const images = availableImages[item.set][item.type];
        console.log(images);
        if (images && images.length > 0) {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            clone.style.backgroundImage = `url(./data/img/${randomImage}.webp)`;
        }
    }

    track.appendChild(cloneWrapper);
}