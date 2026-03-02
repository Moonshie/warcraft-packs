//Grabbing filters from active selectors, required for single pack generation of enhanced packs
function filtersFromSelectors(selector = []) {
    let extra = {}
    if (selector != []) {
        selector.forEach(element => {
            if (element.value === "") {
                alert("Please select a valid option.");
                throw new Error("No extra filter.");
                ;
            }
            extra[`${element.id.slice(0,-7)}`] = element.value;
        });
    }
    return extra;
}

//Applying correct artworkIDs for the items generated and storing them in the object data for export
function setArtID(item) {
    if (availableImages[item.set]) {
        const images = availableImages[item.set][item.category];
        if (images && images.length > 0) {
            item.artID = images[Math.floor(Math.random() * images.length)];
        }
    }

    if (item.type === 'Class Booster') {
        item.artID = `enhanced/Class%20Booster%20${item.extra.class}`
    } else if (item.type === 'Faction Booster') {
        item.artID = `enhanced/Faction%20Booster%20${item.extra.faction}`
    } else if (item.type === 'Equipment Booster') {
        item.artID = `enhanced/Equipment%20Booster`
    } else if (item.type === 'Neutral Booster') {
        item.artID = `enhanced/Neutral%20Booster`
    }
}

//Count to find duplicates and add them together
function countCards(cards) {
    let counts = new Map();
    for (const key of cards) {
        if (!counts.has(`${key.name} [${key.set} #${key.setNumber}]`)) {
            counts.set(`${key.name} [${key.set} #${key.setNumber}]`, {
                count: 0,
                name: key.name,
                set: key.set,
                setNumber: key.setNumber,
                type: key.type,
                class: key.class,
                faction: key.faction,
                cost: key.cost,
                rarity: key.rarity,
        });
    }
    counts.get(`${key.name} [${key.set} #${key.setNumber}]`).count++;
    }
    return counts;
}
//Sort to take a map from above and return it sorted
function sortCards(cardsMap) {
    return [...cardsMap.entries()].sort(([nameA, dataA], [nameB, dataB]) => {
        let diff = rarityRank[dataB.rarity] - rarityRank[dataA.rarity];
        if (diff !== 0) return diff;

        diff = (typeRank[dataB.type] ?? 0) - (typeRank[dataA.type] ?? 0);
        if (diff !== 0) return diff;
    
        diff = (factionRank[dataB.faction] ?? 1) - (factionRank[dataA.faction] ?? 1);
        if (diff !== 0) return diff;
    
        diff = (dataB.cost ?? 0) - (dataA.cost ?? 0);
        if (diff !== 0) return diff;
    
        diff = dataB.count - dataA.count;
        if (diff !== 0) return diff;
    
        return (dataA.setNumber ?? 0) - (dataB.setNumber ?? 0);
    });
}