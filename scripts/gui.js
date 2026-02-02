function changeSealedType(event){
    currentSealedType = event.target.value;
}

function changeSet(event){
    currentSet = event.target.value;
}

function randomBackgrounds(set) {
    for (let index = 1; index < 7; index++) {
        document.getElementById(index).classList.add(set+(Math.floor(Math.random() * 2)+1));
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
    document.getElementById("generate").disabled = true;
}