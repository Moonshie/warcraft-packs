//Initial Generate
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
        generateSealed(set, category, type);
    }
    if (category === 'bigBox') {
        generatePreconstructed(set, category, type, precon);
    }
    if (category === 'booster') {
        generateBooster(set, category, type, extraFilters[type]);
    }
}



//Generate based on category
//Output a non-rendered object with main keys and a "Contents" array for chosen cards
function generateSealed(set, category, type) {
    if (type === 'enhancedSealed') {
        enhancedSealed(set)
    }
    Object.entries(sealedTypes[type]).forEach(([boosterType, count]) => { {
        for (let i = 0; i < count; i++) {
            generateBooster(set, 'booster', boosterType, extraFilters[type]);
        }
    }});
    render();
}
function generatePreconstructed(set, category, type, starters) {
    let item = {
        category: category,
        type: type,
        set: setSelect.value,
        contents: []
    }
    const heroes = Object.keys(starters);
    const deckList = starters[heroes[Math.floor(Math.random() * heroes.length)]]
    for (let index = 0; index < deckList.length; index++) {
        setNumber = deckList[index]-1;
        item.contents.push(set[setNumber]);
    }
    if (category === 'bigBox') {
        let heroes = set.filter(card => card.type === "Hero")
        for (let index = 0; index < 3; index++) {
            let oversizedHero = structuredClone(generateCard(heroes, ``));
            heroes = heroes.filter(card => card.name != oversizedHero.name);
            oversizedHero.type = 'OversizedHero';
            oversizedHero.set = 'Azeroth Oversized';
            item.contents.push(oversizedHero);
        }
        generatedItems.push(item);
    }
    render();
}
function generateBooster(set, category = 'booster', type, extraFilters = []) {
    tempFilters = {}
    if (extraFilters != []) {
        extraFilters.forEach(element => {
            if (element.value === "") {
                alert("Please select a valid option.");
                throw new Error("No extra filter.");
                ;
            }
            tempFilters[`${element.id.slice(0,-7)}`] = element.value;
        });
    }

    let item = {
        category: category,
        type: type,
        set: setSelect.value,
        contents: []
    };

    slotCounts[type].forEach((count, filters) => {
        Object.assign(filters, tempFilters);
        for (let i = 0; i < count; i++) {
            let card = generateCard(set, filters);
            item.contents.push(card);
            if (allowDuplicates[type] === false) {
                item['contents'].forEach(generatedCard => {
                    set = set.filter(card => generatedCard != card)
                });
            }
        }});
    generatedItems.push(item);
    render();
}



//Card Generator, picking out a card based on all available filters
function generateCard(set, filters) {
    let pool = set;
    let filterValues;
    let card;
    let upgradedCard;
    Object.entries(filters).forEach(([key, value]) => {
        filterValues = Array.isArray(value) ? value : [value];

        upgradeChances.forEach((chance, pair) => {
            if (filterValues == pair[0]) {
                if (Math.random() < chance) {
                    let upgradedFilters = structuredClone(filters);
                    upgradedFilters['rarity'] = pair[1];
                    upgradedCard = generateCard(set, upgradedFilters)
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



//--- End of behind-the-scenes generation, rendering ahead ---//



//Initial Render, rendering all items currently generated
function render() {
    generatedItems.forEach(item => {
        renderItem(item);
        renderedItems.push(item);
    });
    centerCorrectly();
    generatedItems.length = 0;
}
//Renders a wrapper appropriate for the item type
function renderItem(item) {
    const cloneWrapper = document.querySelector(`.template > .${item.category}-wrapper`).cloneNode(true);
    const clone = cloneWrapper.querySelector(`.${item.category}`);
    const cloneOutput = clone.querySelector('.output');
    clone.id = renderedItems.length;
    cloneOutput.id = `${renderedItems.length}-output`;


    if (availableImages[item.set]) {
        const images = availableImages[item.set][item.category];
        if (images && images.length > 0) {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            clone.style.backgroundImage = `url(./data/img/${randomImage}.webp)`;
        }
    }

    track.appendChild(cloneWrapper);
}



//Opens up the item's contents 
function openItem(id) {
    const item = renderedItems[id];
    openItems.push(item);
    itemAnimation(id);
    if (item.category === 'booster') {
        setTimeout(() => {openBooster(id, item);}, 800);
    };
    if (item.category === 'bigBox') {
        setTimeout(() => {openBigBox(id, item);}, 800)
    }
}
function openBooster(id, booster) {
    const counted = countCards(booster['contents'])
    renderContents(id, booster, counted);
}
function openBigBox(id, bigBox) {
    const counted = countCards(bigBox['contents'])
    renderContents(id, bigBox, counted);
    let set = sets[bigBox['set']];
    generateBooster(set, 'booster', 'classicBooster');
    generateBooster(set, 'booster', 'classicBooster');
}



//Renders the layout inside the item
function renderContents(id, item, counted) {
    const output = document.getElementById(id+`-output`);
    output.innerHTML = "";
    output.classList.remove("hidden");

    outputBlocks = outputCounts[item.type]

    outputBlocks.forEach(block => {

        if (block[0] != '') {
            const line = document.createElement("div");
            line.classList.add("separator");
            line.innerText = block[1];
            output.appendChild(line);

            let tempCounted = new Map();
            
            counted.forEach((obj, name) => {
                if (block[0] === obj['type']) {
                    tempCounted.set(name, obj)
                    counted.delete(name);
                }
            });
            renderCards(output, item, tempCounted)
        } else {
            const line = document.createElement("div");
            line.classList.add("separator");
            line.innerText = block[1];
            output.appendChild(line);

            renderCards(output, item, counted)
        }
    })
    attachPreviewListeners();
}
//Renders individual cards
function renderCards(output, item, counted) {
    let list = sortCards(counted);

    list.forEach(([name, data]) => {
        const line = document.createElement("div");
        line.className = "line";

        const card = document.createElement("span");

        const countSpan = document.createElement("span");
        countSpan.textContent = `${data.count} `;
        countSpan.className = "count";

        const nameSpan = document.createElement("a");
        nameSpan.classList.add('cardLink');
        nameSpan.innerHTML = data.name;
        let wowcardsString = item['set'].toLowerCase();
        if (wowcardsString === 'darkportal') {
            wowcardsString = 'dark-portal';
        }

        nameSpan.setAttribute('href', `http://www.wowcards.info/card/${wowcardsString}/en/${data.setNumber}`)
        nameSpan.setAttribute(`dataImg`, `./data/cardImg/${item['set']}/${data.setNumber}.jpg`);
        nameSpan.setAttribute(`target`, "_blank")

        const rarityDiv = document.createElement("div");
        rarityDiv.textContent = `${data.rarity}`.substring(1,length);
        rarityDiv.className = `rarity ${data.rarity}`;

        card.appendChild(countSpan);
        card.appendChild(nameSpan);
        line.appendChild(card);
        line.appendChild(rarityDiv);
        output.appendChild(line);
    });
}



//Finalize all opened cards in an export
function countAll() {
    let total = [];
    document.querySelector(".full-out").innerHTML = '';
    Object.keys(openItems).forEach(e => {
        total = total.concat(renderedItems[e]['contents']);
    });
    counted = countCards(total);
    sorted = sortCards(counted);
    sorted.forEach(element => {
        document.querySelector(".full-out").innerHTML += `${element[1]['count']} ${element[1]['name']} <br>`
    })
}


//Sorting logic
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
    
        diff = (factionRank[dataB.factionn] ?? 1) - (factionRank[dataA.factionn] ?? 1);
        if (diff !== 0) return diff;
    
        diff = (dataB.cost ?? 0) - (dataA.cost ?? 0);
        if (diff !== 0) return diff;
    
        diff = dataB.count - dataA.count;
        if (diff !== 0) return diff;
    
        return (dataA.setNumber ?? 0) - (dataB.setNumber ?? 0);
    });
}

//Extra functionality, like previews
function attachPreviewListeners() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        document.querySelectorAll("a").forEach(link => {
            const imgUrl = link.attributes.dataImg.value;
        
            link.addEventListener("mouseenter", e => {
              previewBox.style.display = "block";
              previewBox.classList.add("show");

            if (previewImage.dataset.src === imgUrl) return;

            if (imageCache[imgUrl]) {
            previewLoader.style.display = "none";
            previewImage.style.display = "block";
            previewImage.src = imgUrl;
            previewImage.dataset.src = imgUrl;
            return;
            }

            previewImage.style.display = "none";
            previewLoader.style.display = "flex";

            const img = new Image();
            img.src = imgUrl;

            img.onload = () => {
                imageCache[imgUrl] = true;
                previewImage.src = imgUrl;
                previewImage.dataset.src = imgUrl;
                previewLoader.style.display = "none";
                previewImage.style.display = "block";
            };
        
            img.onerror = () => {
                previewLoader.textContent = "Failed to load";
              };
            });
        
            link.addEventListener("mousemove", e => {
                const offset = 20;
                const boxWidth = previewBox.offsetWidth;
                const boxHeight = previewBox.offsetHeight;
              
                let x = e.clientX + offset;
                let y = e.clientY + offset;
              
                if (x + boxWidth > window.innerWidth) {
                  x = e.clientX - boxWidth - offset;
                }
              
                if (y + boxHeight > window.innerHeight) {
                  y = e.clientY - boxHeight - offset;
                }
              
                previewBox.style.left = x + "px";
                previewBox.style.top = y + "px";
            });
        
            link.addEventListener("mouseleave", () => {
                previewBox.classList.remove("show");
                previewBox.style.display = "none";
            });
          });
    }
}

//Extra flourishes, like the animation
function itemAnimation(id) {
    const itemElement = document.getElementById(id);
    itemElement.onclick = false;
    itemElement.classList.add("flip");
    const tilt = itemElement.parentElement;
    tilt.glareIntensity = 0;
    tilt.scaleFactor = 1;
    tilt.tiltFactor = 0;
    tilt.removeAttribute('shadow');
    setTimeout(() => {itemElement.classList.add("open")}, 800);
}

function centerCorrectly() {
    let offsetLeft = 0;
    let offsetRight = 0;

    let leftmostItem = track.firstElementChild.className;
    if (leftmostItem === 'booster-wrapper') {
        offsetLeft = 15;
    } else if (leftmostItem === 'bigBox-wrapper') {
        offsetLeft = 26;
    }

    let rightmostItem = track.lastElementChild.className;
    if (rightmostItem === 'booster-wrapper') {
        offsetRight = 15;
    } else if (rightmostItem === 'bigBox-wrapper') {
        offsetRight = 26;
    }

    root.style.setProperty('--padding-left', `${offsetLeft}vh`)
    root.style.setProperty('--padding-right', `${offsetRight}vh`)
}

//UI
function checkSelectors() {
    extraSelect = extraFilters[typeSelect.value];
    extraSelect === undefined ? extraSelect = [] : true;
    extraSelects.forEach(element => {
        if (extraSelect.includes(element)) {
            element.classList.remove('disabled');
        } else {
            element.selectedIndex = 0;
            element.classList.add('disabled')
        };
    });
}

function toggleMenu(id) {
    if (openMenus[id] === true) {
        if (id === 'left') {
            left.classList.add('closed');
            openMenus[id] = false;
        } else if (id === 'right') {
            right.classList.add('closed');
            openMenus[id] = false;
        } else if (id === 'center') {
            center.classList.add('closed');
            center.style.translate = `0 -${window.getComputedStyle(center).getPropertyValue('height')}`;
            openMenus[id] = false;
        }
    } else if (openMenus[id] === false) {
        if (id === 'left') {
            left.classList.remove('closed');
            openMenus[id] = true;
        } else if (id === 'right') {
            right.classList.remove('closed');
            openMenus[id] = true;
        } else if (id === 'center') {
            center.classList.remove('closed');
            center.style.translate = ``;
            openMenus[id] = true;
        }
    }
}