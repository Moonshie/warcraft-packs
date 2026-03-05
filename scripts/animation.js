// ─────────────────────────────────────────────────────────────
//  ANIMATION
//  All visual effects: pack opening, box swing, item entrance.
//  No game logic or state — pure DOM/canvas effects.
// ─────────────────────────────────────────────────────────────

// ── Easing functions ──────────────────────────────────────────

function easeIn(t)    { return t * t * t; }
function easeOut(t)   { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }


// ── Cut path helpers ──────────────────────────────────────────

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


// ── Phase 1: slash line ───────────────────────────────────────

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
        ctx.strokeStyle = '#e6cc80';
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


// ── Phase 2: fly apart ────────────────────────────────────────

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

    packImg.style.visibility = 'hidden';

    const DURATION = 500;
    const TRAVEL   = Math.max(W, H) * 0.7;
    const ROT_DEG  = (Math.random() * 35) * (Math.random() < 0.5 ? -1 : 1);
    const start    = performance.now();

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


// ── Tilt teardown ─────────────────────────────────────────────
// Smoothly eases the hover-tilt back to neutral before animation

function disableTilt(itemElement) {
    const tilt = itemElement.parentElement;
    tilt.glareIntensity = 0;
    tilt.scaleFactor    = 1;
    tilt.tiltFactor     = 0;
    tilt.removeAttribute('shadow');
}


// ── Pack cut animation ────────────────────────────────────────

function packCutAnimation(id) {
    const itemElement = document.getElementById(id);
    const packImg     = itemElement.querySelector('.pack-img');
    itemElement.classList.add('open', 'cutting');
    itemElement.onclick = null;
    disableTilt(itemElement);

    const rect      = itemElement.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const angle     = (Math.random() - 0.5) * Math.PI * 0.55
                    + (Math.random() > 0.5 ? 0 : Math.PI / 2 * (Math.random() - 0.5));
    const cutPoints = buildCutPath(angle, W, H);

    animateSlash(itemElement, cutPoints, W, H, () => {
        const output = itemElement.querySelector('.output');
        output.classList.remove('hidden');
        flyApart(itemElement, packImg, cutPoints, angle, W, H, () => {});
    });
}


// ── Box swing-open animation ──────────────────────────────────

function boxSwingAnimation(id) {
    const itemElement = document.getElementById(id);
    const packImg     = itemElement.querySelector('.pack-img');
    itemElement.classList.add('open', 'cutting');
    itemElement.onclick = null;
    disableTilt(itemElement);

    setTimeout(() => {
        itemElement.style.perspective    = '1200px';
        packImg.style.transformOrigin    = 'left center';
        packImg.style.transition         = 'transform 0.55s cubic-bezier(0.4, 0, 0.8, 0.6), opacity 0.55s ease-in';
        packImg.style.transform          = 'rotateY(-105deg)';
        packImg.style.opacity            = '0';
        setTimeout(() => packImg.remove(), 560);
    }, 150);
}


// ── Item entrance ─────────────────────────────────────────────
// Fly-in for newly rendered pack/box wrappers

function animateItemIn(wrapperEl) {
    wrapperEl.style.opacity    = '0';
    wrapperEl.style.transform  = 'translateY(-40px)';
    wrapperEl.style.transition = 'none';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            wrapperEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            wrapperEl.style.opacity    = '1';
            wrapperEl.style.transform  = 'translateY(0)';
        });
    });
}


// ── Main entry point ──────────────────────────────────────────

function itemAnimation(id, type) {
    if (type === 'box') {
        boxSwingAnimation(id);
    } else {
        packCutAnimation(id);
    }
}
