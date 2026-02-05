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
        generateBooster(set, slotCounts[type], extraFilters[type]);
    }
    render();
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

function generateBooster(set, slotCount, extraFilters = []) {
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
        type: "booster",
        set: setSelect.value,
        contents: []
    };

    slotCount.forEach((count, filters) => {
        Object.assign(filters, tempFilters);
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

function render() {
    generatedItems.forEach(item => {
        renderItem(item);
        renderedItems.push(item);
    });
    centerCorrectly();
    generatedItems.length = 0;
}

function renderItem(item) {
    const cloneWrapper = document.querySelector(`.template > .${item.type}-wrapper`).cloneNode(true);
    const clone = cloneWrapper.querySelector(`.${item.type}`);
    const cloneOutput = clone.querySelector('.output');
    clone.id = renderedItems.length;
    cloneOutput.id = `${renderedItems.length}-output`;

    if (availableImages[item.set]) {
        const images = availableImages[item.set][item.type];
        if (images && images.length > 0) {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            clone.style.backgroundImage = `url(./data/img/${randomImage}.webp)`;
        }
    }

    track.appendChild(cloneWrapper);
}

function openItem(id) {
    const item = renderedItems[id];
    itemAnimation(id);
    if (item.type === 'booster') {
        setTimeout(() => {openBooster(id, item);}, 800);
    };
}

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

function openBooster(id, booster) {
    let counts = new Map();

    for (const key of booster['contents']) {
        if (!counts.has(key.name)) {
            counts.set(key.name, {
            count: 0,
            setNumber: key.setNumber,
            type: key.type,
            class: key.class,
            factionn: key.faction,
            cost: key.cost,
            rarity: key.rarity,
            });
        }
    counts.get(key.name).count++;
    }

    const sorted = [...counts.entries()].sort(([nameA, dataA], [nameB, dataB]) => {
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

    const output = document.getElementById(id+`-output`);
    output.innerHTML = "";
    output.className = "output";

    sorted.forEach(([name, data]) => {
        const countDiv = document.createElement("div");
        countDiv.textContent = `${data.count}`;
        countDiv.className = "count";

        const nameDiv = document.createElement("a");
        nameDiv.classList.add('cardLink');
        nameDiv.innerHTML = name;
        let wowcardsString = booster['set'].toLowerCase();
        if (wowcardsString === 'darkportal') {
            wowcardsString = 'dark-portal';
        }

        nameDiv.setAttribute('href', `http://www.wowcards.info/card/${wowcardsString}/en/${data.setNumber}`)
        nameDiv.setAttribute(`dataImg`, `./data/cardImg/${booster['set']}/${data.setNumber}.jpg`);
        nameDiv.setAttribute(`target`, "_blank")

        const rarityDiv = document.createElement("div");
        rarityDiv.textContent = `${data.rarity}`.substring(1,length);
        rarityDiv.className = `rarity ${data.rarity}`;

        output.appendChild(countDiv);
        output.appendChild(nameDiv);
        output.appendChild(rarityDiv);
    });

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

function centerCorrectly() {
    let offsetLeft = 0;
    let offsetRight = 0;

    let leftmostItem = track.firstElementChild.className;
    if (leftmostItem === 'booster-wrapper') {
        offsetLeft = 15;
    } else if (leftmostItem === 'box-wrapper') {
        offsetLeft = 26;
    }

    let rightmostItem = track.lastElementChild.className;
    if (rightmostItem === 'booster-wrapper') {
        offsetRight = 15;
    } else if (rightmostItem === 'box-wrapper') {
        offsetRight = 26;
    }

    root.style.setProperty('--padding-left', `${offsetLeft}vh`)
    root.style.setProperty('--padding-right', `${offsetRight}vh`)
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