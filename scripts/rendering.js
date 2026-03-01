//Render each item currently generated
function render() {
    generatedItems.forEach(item => {
        renderItem(item);
        renderedItems.push(item);
    });
    centerCorrectly();
    generatedItems.length = 0;
}

//Render a wrapper appropriate for the item type
function renderItem(item) {
    const cloneWrapper = document.querySelector(`.template > .${item.category}-wrapper`).cloneNode(true);
    const clone = cloneWrapper.querySelector(`.${item.category}`);
    const cloneOutput = clone.querySelector('.output');
    clone.id = renderedItems.length;
    cloneOutput.id = `${renderedItems.length}-output`;

    if (item.category === 'booster' || item.category === 'bigBox') {
        // Use a real <img> so the cut animation can draw it onto a canvas
        const packImg = document.createElement('img');
        packImg.className = 'booster-img';
        packImg.src = `./data/img/${item.artID}.webp`;
        packImg.draggable = false;
        clone.appendChild(packImg);
    }

    if (item.category === 'card') {
        console.log(item.set, item.setNumber)
        clone.style.backgroundImage = `url(./data/cardImg/Azeroth%20Oversize/${item.setNumber}.jpg)`
    }

    track.appendChild(cloneWrapper);
}

//Open up the item's contents 
function openItem(id) {
    const item = renderedItems[id];
    openItems.push(item);
    itemAnimation(id);
    if (item.category === 'booster') {
        // Delay matches slash (300ms) + fade (180ms) + a small buffer
        setTimeout(() => {openBooster(id, item);}, 520);
    };
    if (item.category === 'bigBox') {
        setTimeout(() => {openBigBox(id, item);}, 520);
    }
}
function openBooster(id, booster) {
    const counted = countCards(booster['cardContents'])
    renderCardContents(id, booster, counted);
}
function openBigBox(id, bigBox) {
    let includeExtras = bigBox['cardContents'].concat(bigBox['otherContents'][0]);
    let counted = countCards(includeExtras)
    renderCardContents(id, bigBox, counted);
    let remaining = bigBox['otherContents'].slice(1);
    remaining.forEach(element => {
        generatedItems.push(element);
        render();
    });
}

//Render the layout inside the item
function renderCardContents(id, item, counted) {
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
                if (Array.isArray(block[0])) {
                    if (block[0].length === obj['type'].length && block[0].every(x => obj['type'].includes(x))) {
                        tempCounted.set(name, obj)
                        counted.delete(name);
                    }
                } else if (block[0] == obj['type']) {
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

//Render individual cards, attaching links and previews to them
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
        nameSpan.setAttribute(`dataImg`, `./data/cardImg/${data['set']}/${data.setNumber}.jpg`);
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