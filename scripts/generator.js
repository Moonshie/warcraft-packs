function newBooster() {
    let newBooster = [];
    const set = sets[currentSet];

    const commons = set.filter(card => card.rarity === "Common");
    const uncommons = set.filter(card => card.rarity === "Uncommon");
    const rares = set.filter(card => card.rarity === "Rare");
    const epics = set.filter(card => card.rarity === "Epic");
    const legendaries = set.filter(card => card.rarity === "Legendary");

    let boosterSize = [];

    if (currentSealedType == 'classic') {
        boosterSize.push(11, 3, 1);
    }
    
    if (currentSealedType == 'enhanced') {
        boosterSize.push(6, 5, 4);
    }

    for (let index = 0; index < boosterSize[0]; index++) {
        newBooster.push(commons[Math.floor(Math.random()*commons.length)]);
    }
    for (let index = 0; index < boosterSize[1]; index++) {
        newBooster.push(uncommons[Math.floor(Math.random()*uncommons.length)]);
    }
    for (let index = 0; index < boosterSize[2]; index++) {
        if (epics.length > 0) {
            if (Math.random() < 0.125) {
                newBooster.push(epics[Math.floor(Math.random()*epics.length)]);
            }
            else {
                newBooster.push(rares[Math.floor(Math.random()*rares.length)]);
            }
        }
        else {
            newBooster.push(rares[Math.floor(Math.random()*rares.length)]);
        }
    }
    fullSealed.push.apply(fullSealed, newBooster);
    return newBooster;
}

function sortPushBooster(booster, num) {
    let counts = new Map();

    for (const item of booster) {
        if (!counts.has(item.name)) {
            counts.set(item.name, {
            count: 0,
            setNumber: item.setNumber,
            type: item.type,
            class: item.class,
            factionn: item.faction,
            cost: item.cost,
            rarity: item.rarity,
            });
        }
    counts.get(item.name).count++;
    }

    const sorted = [...counts.entries()].sort(([nameA, dataA], [nameB, dataB]) => {
        // 1. Rarity (highest first)
        let diff = rarityRank[dataB.rarity] - rarityRank[dataA.rarity];
        if (diff !== 0) return diff;

        // 2. Type: Hero > Ability > Ally > Equipment > Quest
        diff = (typeRank[dataB.type] ?? 0) - (typeRank[dataA.type] ?? 0);
        if (diff !== 0) return diff;
    
        // 3. Faction: Alliance > Horde > Neutral
        diff = (factionRank[dataB.factionn] ?? 1) - (factionRank[dataA.factionn] ?? 1);
        if (diff !== 0) return diff;
    
        // 4. Cost: highest to lowest
        diff = (dataB.cost ?? 0) - (dataA.cost ?? 0);
        if (diff !== 0) return diff;
    
        // 5. Count: highest to lowest
        diff = dataB.count - dataA.count;
        if (diff !== 0) return diff;
    
        // 6. Set number: lowest to highest
        return (dataA.setNumber ?? 0) - (dataB.setNumber ?? 0);
    });

    const output = document.getElementById(num+`output`);
    output.innerHTML = "";
    output.className = "output";

    sorted.forEach(([name, data]) => {
        const countDiv = document.createElement("div");
        countDiv.textContent = `${data.count}`;
        countDiv.className = "count";

        const nameDiv = document.createElement("a");
        nameDiv.classList.add('cardLink');
        nameDiv.innerHTML = name;
        nameDiv.setAttribute('href', `http://www.wowcards.info/card/azeroth/en/${data.setNumber}`)
        nameDiv.setAttribute(`data-img`, hoaImg[data.setNumber-1])
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
        const imgUrl = link.dataset.img;
    
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

function generate(num, event) {
    genUI(event);
    setTimeout(() => {genCards(num);}, 800);
}

function genUI(event) {
    event.target.onclick = false;
    event.target.classList.add("flip");
    const tilt = event.target.parentElement;
    tilt.glareIntensity = 0;
    tilt.scaleFactor = 1;
    tilt.tiltFactor = 0;
    tilt.removeAttribute('shadow');
}

function genCards(num) {
    let booster = newBooster();
    sortPushBooster(booster, num);
}