//Card previews
//Adds a mouseover event to all card links to provide a preview
function attachPreviewListeners() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        document.querySelectorAll("a.cardLink").forEach(link => {
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

//Simple flip animation for opened packs
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

//Centering the item track based on leftmost and rightmost items
function centerCorrectly() {
    let offsetLeft = 0;
    let offsetRight = 0;

    let leftmostItem = track.firstElementChild.className;
    if (leftmostItem === 'booster-wrapper') {
        offsetLeft = 15;
    } else if (leftmostItem === 'bigBox-wrapper') {
        offsetLeft = 21;
    }

    let rightmostItem = track.lastElementChild.className;
    if (rightmostItem === 'booster-wrapper') {
        offsetRight = 15;
    } else if (rightmostItem === 'bigBox-wrapper') {
        offsetRight = 21;
    }

    root.style.setProperty('--padding-left', `${offsetLeft}vh`)
    root.style.setProperty('--padding-right', `${offsetRight}vh`)
}

//Open and close menus
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

//Cleanup selectors on switching
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