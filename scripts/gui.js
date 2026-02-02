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
        menuOpen = false;
    } else {
        menu.style.width = '30vh'
        menuOpen = true;
    }
}