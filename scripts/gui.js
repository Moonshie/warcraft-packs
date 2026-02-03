function changeSealedType(event){
    currentSealedType = event.target.value;
    if (currentSealedType && currentSet) {
        buttonControl(true);
    }
}

function changeSet(event){
    currentSet = event.target.value;
    if (currentSealedType && currentSet) {
        buttonControl(true);
    }
}

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

function generate() {
    if (currentSealedType == 'classic') {
        genClassic();
    }
    if (currentSealedType == 'single') {
        genSingle();
    }
}

function genClassic() {
    selectControl();
    buttonControl(false);
    addPacks (6, "classic");
}

function genSingle() {
    addPacks (1, "classic");
}

function addPacks (num, type) {
    for (let index = 1; index <= num; index++) {
        let clonedPack = pack.cloneNode(true);
        const clonedBooster = clonedPack.querySelector(".booster");
        clonedBooster.classList.add(currentSet+(Math.floor(Math.random() * 2)+1), type);
        packsOnScreen++;
        clonedBooster.id = packsOnScreen;
        const clonedOutput = clonedBooster.querySelector('.output');
        clonedOutput.id = `${packsOnScreen}output`;
        track.appendChild(clonedPack);
    }
}