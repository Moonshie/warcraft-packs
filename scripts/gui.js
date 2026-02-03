function changeSealedType(event){
    currentSealedType = event.target.value;
    if (currentSealedType && currentSet) {
        buttonControl(true);
    }
}

function changeSet(event){
    currentSet = event.target.value;
    if (currentSealedType && currentSet) {
        buttonControl(false);
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

function addPacks(num, set, type) {
    for (let index = 1; index <= num; index++) {
        let clonedPack = pack.cloneNode(true);
        const clonedBooster = clonedPack.querySelector(".booster");
        clonedBooster.classList.add(set+(Math.floor(Math.random() * 2)+1));
        clonedBooster.id = index;
        const clonedOutput = clonedBooster.querySelector('.output');
        clonedOutput.id = `${index}output`;
        track.appendChild(clonedPack);
    }
    genButton.disabled = true;
}

function buttonControl(e) {
    if (e == true) {
        genButton.disabled = false;
    } else {
        genButton.disabled = true;
    }
}