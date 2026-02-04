function toggleMenu() {
    if (menuOpen == true) {
        menu.style.width = 0;
        menu.style.borderRight = 'none';
        menuOpen = false;
    } else {
        menu.style.width = '30vh'
        menu.style.borderRight = '1px solid #8d6934';
        menuOpen = true;
    }
}

function buttonControl(e) {
    if (e == true) {
        genButton.disabled = false;
    } else {
        genButton.disabled = true;
    }
}

function selectControl() {
    setSelect.disabled = true;
    typeSelect.disabled = true;
}

// function generate() {
//     if (currentSealedType == 'classic') {
//         genClassic(currentSet);
//     }
//     if (currentSealedType == 'starter') {
//         genStarter(currentSet);
//     }
//     if (currentSealedType == 'single') {
//         genSingle(currentSet);
//     }
// }

function genClassic(set) {
    selectControl();
    buttonControl(false);
    addPacks (6, set, "classic");
}

function genStarter(set) {
    selectControl();
    buttonControl(false);
    addStarter(set);
}

function genSingle(set) {
    addPacks (1, set, "classic");
}

function addPacks(num, set, type) {
    for (let index = 1; index <= num; index++) {
        let clonedPack = pack.cloneNode(true);
        const clonedBooster = clonedPack.querySelector(".booster");
        clonedBooster.classList.add(set+(Math.floor(Math.random() * 2)+1), set, type);
        itemsOnScreen++;
        clonedBooster.id = itemsOnScreen;
        const clonedOutput = clonedBooster.querySelector('.output');
        clonedOutput.id = `${itemsOnScreen}output`;
        track.appendChild(clonedPack);
    }
}

function addStarter(set) {
    let clonedBox = box.cloneNode(true);
    const clonedStarter = clonedBox.querySelector(".starter");
    clonedStarter.classList.add(set);
    itemsOnScreen++;
    clonedStarter.id = itemsOnScreen;
    const clonedOutput = clonedStarter.querySelector('.output');
    clonedOutput.id = `${itemsOnScreen}output`;
    track.appendChild(clonedBox);
};