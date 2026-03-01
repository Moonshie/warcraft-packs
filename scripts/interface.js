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

//  ── Cut animation ─────────────────────────────────────────────────────────

// Build a jagged path of [x,y] points across the element at the given angle
function buildCutPath(angle, W, H) {
    const cx = W / 2, cy = H / 2;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const diagonal = Math.sqrt(W * W + H * H);
    const steps = 90;
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) - 0.5;
        const along = t * diagonal * 1.3;
        const jitter = (Math.random() - 0.5) * 3 + (Math.random() - 0.5) * 1;
        points.push([
            cx + along * cos - jitter * sin,
            cy + along * sin + jitter * cos
        ]);
    }
    return points;
}

// Build the closed clipping polygon for one half of the cut
function buildHalfPolygon(cutPoints, side, W, H) {
    const MARGIN = 40;
    const pts = [...cutPoints];
    if (side === 'top') {
        pts.push([W + MARGIN, -MARGIN], [-MARGIN, -MARGIN]);
    } else {
        pts.push([W + MARGIN, H + MARGIN], [-MARGIN, H + MARGIN]);
    }
    return pts;
}

function easeIn(t)    { return t * t * t; }
function easeOut(t)   { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }

// Phase 1: draw the slash line travelling across the pack image
function animateSlash(container, cutPoints, W, H, onComplete) {
    const SLASH_DURATION = 300;
    const cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    cvs.className = 'cut-canvas';
    cvs.style.zIndex = 3;
    container.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    const start = performance.now();

    function frame(now) {
        const t = Math.min((now - start) / SLASH_DURATION, 1);
        const easedT = easeInOut(t);
        ctx.clearRect(0, 0, W, H);

        const maxIdx = Math.floor(easedT * (cutPoints.length - 1));
        if (maxIdx < 1) { requestAnimationFrame(frame); return; }

        // Shadow line
        ctx.beginPath();
        ctx.moveTo(cutPoints[0][0], cutPoints[0][1]);
        for (let i = 1; i <= maxIdx; i++) ctx.lineTo(cutPoints[i][0], cutPoints[i][1]);
        ctx.strokeStyle = 'rgba(0,0,0,0.55)';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Bright core line
        ctx.beginPath();
        ctx.moveTo(cutPoints[0][0], cutPoints[0][1]);
        for (let i = 1; i <= maxIdx; i++) ctx.lineTo(cutPoints[i][0], cutPoints[i][1]);
        ctx.strokeStyle = 'rgba(255,245,220,0.92)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Glint at the tip
        const tip = cutPoints[maxIdx];
        const grd = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 18);
        grd.addColorStop(0,   'rgba(255,255,255,0.95)');
        grd.addColorStop(0.2, 'rgba(255,220,120,0.7)');
        grd.addColorStop(1,   'rgba(255,200,80,0)');
        ctx.beginPath();
        ctx.arc(tip[0], tip[1], 18, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tip[0], tip[1], 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fill();

        if (t < 1) {
            requestAnimationFrame(frame);
        } else {
            setTimeout(() => {
                let fadeStart = null;
                function fade(now) {
                    if (!fadeStart) fadeStart = now;
                    const ft = Math.min((now - fadeStart) / 120, 1);
                    cvs.style.opacity = 1 - ft;
                    if (ft < 1) requestAnimationFrame(fade);
                    else { cvs.remove(); onComplete(); }
                }
                requestAnimationFrame(fade);
            }, 60);
        }
    }
    requestAnimationFrame(frame);
}

// Phase 2: split the image into two halves and fly them apart
function flyApart(container, packImg, cutPoints, angle, W, H, onComplete) {
    const nx = -Math.sin(angle), ny = Math.cos(angle);

    const halves = ['top', 'bottom'].map(side => {
        const cvs = document.createElement('canvas');
        cvs.width = W; cvs.height = H;
        cvs.className = 'cut-canvas';
        cvs.style.zIndex = 2;
        container.appendChild(cvs);

        const ctx = cvs.getContext('2d');
        const poly = buildHalfPolygon(cutPoints, side, W, H);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(packImg, 0, 0, W, H);
        ctx.restore();

        return { cvs, side };
    });

    // Hide the source image now that canvases cover it
    packImg.style.visibility = 'hidden';

    const DURATION = 900, TRAVEL = Math.max(W, H) * 0.7, ROT_DEG = (Math.random() * 35) * (Math.random() < 0.5 ? -1 : 1);
    const start = performance.now();

    function animate(now) {
        const rawT = Math.min((now - start) / DURATION, 1);
        const t = easeIn(rawT);
        halves.forEach(({ cvs, side }) => {
            const dir = side === 'top' ? -1 : 1;
            cvs.style.transform = `translate(${dir * nx * TRAVEL * t}px, ${dir * ny * TRAVEL * t}px) rotate(${dir * ROT_DEG * easeOut(rawT)}deg)`;
            cvs.style.opacity = 1 - easeOut(rawT);
        });
        if (rawT < 1) {
            requestAnimationFrame(animate);
        } else {
            halves.forEach(({ cvs }) => cvs.remove());
            onComplete();
        }
    }
    requestAnimationFrame(animate);
}

// Main entry point — replaces the old flip animation
function itemAnimation(id) {
    const itemElement = document.getElementById(id);
    const packImg = itemElement.querySelector('.booster-img');
    itemElement.classList.add('open');

    // Disable further clicks and tilt effects
    itemElement.onclick = false;
    itemElement.classList.add('cutting');
    const tilt = itemElement.parentElement;
    tilt.glareIntensity = 0;
    tilt.scaleFactor = 1;
    tilt.tiltFactor = 0;
    tilt.removeAttribute('shadow');

    // Measure actual pixel size at runtime (dimensions are vh-based)
    const rect = itemElement.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const angle = (Math.random() - 0.5) * Math.PI * 0.55 + (Math.random() > 0.5 ? 0 : Math.PI / 2 * (Math.random() - 0.5));
    const cutPoints = buildCutPath(angle, W, H);

    // Phase 1: slash, then reveal card output and phase 2: fly apart
    animateSlash(itemElement, cutPoints, W, H, () => {
        const output = itemElement.querySelector('.output');
        output.classList.remove('hidden');
        flyApart(itemElement, packImg, cutPoints, angle, W, H, () => {});
    });
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
    } else if (leftmostItem === 'card-wrapper') {
        offsetLeft = 12.5;
    }

    let rightmostItem = track.lastElementChild.className;
    if (rightmostItem === 'booster-wrapper') {
        offsetRight = 15;
    } else if (rightmostItem === 'bigBox-wrapper') {
        offsetRight = 21;
    } else if (leftmostItem === 'card-wrapper') {
        offsetRight = 12.5;
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
        } else if (id === 'fullscreen') {
            fullscreenMenu.classList.add('closed');
            fullscreenMenu.style.translate = `0 -${window.getComputedStyle(fullscreenMenu).getPropertyValue('height')}`;
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
        } else if (id === 'fullscreen') {
            fullscreenMenu.classList.remove('closed');
            fullscreenMenu.style.translate = ``;
            openMenus[id] = true;
        }
    }
}

//Cleanup selectors on switching
function checkSelectors() {
    extraSelect = extraFiltersSelectors[typeSelect.value];
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