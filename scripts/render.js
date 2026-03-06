// ─────────────────────────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────────────────────────

// ── State ─────────────────────────────────────────────────────

const renderedItems   = [];
const openedIds       = new Set();
const lockedIds       = new Set();
let   currentBundleId = null;

const wowcardsSlug = {
    'Azeroth':    'azeroth',
    'DarkPortal': 'dark-portal',
};


// ── renderAll ─────────────────────────────────────────────────

function renderAll(items) {
    items.forEach(item => {
        const id = renderedItems.length;
        renderedItems.push(item);
        renderItem(id, item);
    });
    centerCorrectly();
    bundleCurrentSession().then(() => refreshBundleList());
}


// ── renderItem ────────────────────────────────────────────────

function renderItem(id, item) {
    const wrapperClass = `${item.type}-wrapper`;
    const cloneWrapper = document.querySelector(`.template > .${wrapperClass}`).cloneNode(true);
    const clone        = cloneWrapper.querySelector(`.${item.type}`);
    const cloneOutput  = clone.querySelector('.output');

    clone.id       = id;
    if (cloneOutput) cloneOutput.id = `${id}-output`;

    if (item.type === 'pack' || item.type === 'box') {
        const packImg     = document.createElement('img');
        packImg.className = 'pack-img';
        packImg.src       = `./data/img/${item.artID}.webp`;
        packImg.draggable = false;
        clone.appendChild(packImg);
        clone.addEventListener('click', () => openItem(id));
    }

    if (item.type === 'card') {
        clone.style.backgroundImage = `url(./data/cardImg/${item.card.set}/${item.card.setNumber}.jpg)`;
    }

    track.appendChild(cloneWrapper);

    if (item.type === 'pack' || item.type === 'box') {
        animateItemIn(cloneWrapper);
    }
}


// ── openItem ──────────────────────────────────────────────────

function openItem(id) {
    const item = renderedItems[id];
    if (openedIds.has(id)) return;

    openedIds.add(id);
    lockedIds.add(id);
    itemAnimation(id, item.type);

    if (item.type === 'pack') {
        setTimeout(() => {
            unwrapHoverTilt(id);
            renderCardContents(id, item.cards, item.set);
            bundleCurrentSession().then(() => refreshBundleList());
        }, 670);
    }

    if (item.type === 'box') {
        setTimeout(() => {
            unwrapHoverTilt(id);
            renderCardContents(id, item.cards ?? [], item.set);
            if (item.containedItems?.length) renderAll(item.containedItems);
            bundleCurrentSession().then(() => refreshBundleList());
        }, 700);
    }
}


// ── unwrapHoverTilt ───────────────────────────────────────────
// After opening, removes the hover-tilt wrapper so its spring
// animation can't interfere with portal positioning or image
// quality (scale transforms affect GPU rasterization).

function unwrapHoverTilt(id) {
    const packEl   = document.getElementById(id);
    if (!packEl) return;
    const tiltEl   = packEl.closest('hover-tilt');
    if (!tiltEl) return;
    const wrapper  = tiltEl.parentElement;
    // Move pack element directly into the wrapper, removing hover-tilt
    wrapper.appendChild(packEl);
    tiltEl.remove();
}


// ── renderCardContents ────────────────────────────────────────

function renderCardContents(id, cards, set) {
    const output = document.getElementById(`${id}-output`);
    if (!output) return;
    output.innerHTML = '';
    output.classList.remove('hidden');
    renderCardList(output, cards, set);
}


// ── Card portal ───────────────────────────────────────────────

const cardPortal = (() => {
    const el        = document.createElement('div');
    el.className    = 'card-portal';
    el.style.display = 'none';
    const img       = document.createElement('img');
    img.className   = 'card-portal-img';
    img.draggable   = false;
    el.appendChild(img);
    document.body.appendChild(el);
    return { el, img };
})();

let portalSourceItem = null;
let portalBaseRect   = null; // locked on mouseenter, stable reference

function showPortal(item, src, e) {
    portalSourceItem = item;
    item.classList.add('hovered');

    if (cardPortal.img.dataset.src !== src) {
        cardPortal.img.src         = src;
        cardPortal.img.dataset.src = src;
    }

    cardPortal.el.className     = 'card-portal ' + item.className.replace('card-item', '').trim();
    cardPortal.el.style.display = 'block';

    // Lock size and base position once — translate handles movement
    portalBaseRect = item.getBoundingClientRect();
    cardPortal.el.style.width  = `${portalBaseRect.width}px`;
    cardPortal.el.style.height = `${portalBaseRect.height}px`;

    updatePortal(e);
}

function updatePortal(e) {
    if (!portalSourceItem || !portalBaseRect) return;

    // Re-read position each move (no hover-tilt drift anymore) but
    // use transform instead of left/top to skip layout recalculation
    const rect = portalSourceItem.getBoundingClientRect();
    cardPortal.el.style.transform = `translate(${rect.left}px, ${rect.top}px)`;

    const relX    = (e.clientX - rect.left) / rect.width;
    const tiltDeg = (relX - 0.5) * 12;
    cardPortal.img.style.transform = `perspective(600px) rotateY(${tiltDeg}deg)`;
}

function hidePortal(item) {
    if (portalSourceItem !== item) return;
    item.classList.remove('hovered');
    cardPortal.el.style.display = 'none';
    cardPortal.img.style.transform = '';
    cardPortal.img.dataset.src = '';
    portalSourceItem = null;
}


// ── renderCardList ────────────────────────────────────────────

const CARD_VH  = 36;
const STRIP_VH = 3.6;

function renderCardList(output, cards, set) {
    const slug = wowcardsSlug[set] ?? set.toLowerCase();

    const stackHeight = cards.length > 0
        ? (cards.length - 1) * STRIP_VH + CARD_VH
        : 0;

    const stack = document.createElement('div');
    stack.className    = 'card-stack';
    stack.style.height = `${stackHeight}vh`;

    cards.forEach((card, index) => {
        const isLast = index === cards.length - 1;
        const src    = `./data/cardImg/${card.set}/${card.setNumber}.jpg`;

        const item = document.createElement('div');
        item.className    = `card-item rarity-${card.rarity}`;
        item.style.top    = `${index * STRIP_VH}vh`;
        item.style.height = `${CARD_VH}vh`;
        item.style.zIndex = index + 1;

        const img     = document.createElement('img');
        img.className = 'card-img-full';
        img.src       = src;
        img.draggable = false;

        // Strip covers full card height — no gap for cursor to fall through
        const strip     = document.createElement('div');
        strip.className = 'card-strip';
        if (isLast) strip.style.height = '100%';

        strip.addEventListener('mouseenter', e => showPortal(item, src, e));
        strip.addEventListener('mousemove',  e => updatePortal(e));
        strip.addEventListener('mouseleave', () => hidePortal(item));
        strip.addEventListener('click', () => {
            window.open(`http://www.wowcards.info/card/${slug}/en/${card.setNumber}`, '_blank');
        });

        item.appendChild(img);
        item.appendChild(strip);
        stack.appendChild(item);
    });

    output.appendChild(stack);
}


// ── centerCorrectly ───────────────────────────────────────────

function centerCorrectly() {
    const paddingFor = className => {
        if (className === 'pack-wrapper') return 15;
        if (className === 'box-wrapper')  return 21;
        if (className === 'card-wrapper') return 12.5;
        return 0;
    };

    const first = track.firstElementChild?.className ?? '';
    const last  = track.lastElementChild?.className  ?? '';

    root.style.setProperty('--padding-left',  `${paddingFor(first)}vh`);
    root.style.setProperty('--padding-right', `${paddingFor(last)}vh`);
}


// ── lockItem / unlockItem ─────────────────────────────────────

function lockItem(id) {
    lockedIds.add(id);
    document.getElementById(id)?.classList.add('locked');
}

function unlockItem(id) {
    lockedIds.delete(id);
    document.getElementById(id)?.classList.remove('locked');
}


// ── clearTrack ────────────────────────────────────────────────

function clearTrack() {
    track.innerHTML      = '';
    track.scrollLeft     = 0;
    renderedItems.length = 0;
    openedIds.clear();
    lockedIds.clear();
    currentBundleId      = null;
    return true;
}


// ── snapshotItems ─────────────────────────────────────────────

function snapshotItems() {
    return renderedItems.map((item, id) => ({
        ...item,
        opened: openedIds.has(id),
        locked: lockedIds.has(id),
    }));
}


// ── hydrateBundle ─────────────────────────────────────────────

async function hydrateBundle(bundleId) {
    const bundle = await loadBundle(bundleId);
    if (!bundle) return;

    clearTrack();
    currentBundleId = bundleId;

    bundle.items.forEach((item, index) => {
        renderedItems.push(item);
        renderItem(index, item);

        if (item.opened) {
            openedIds.add(index);
            const el      = document.getElementById(index);
            const packImg = el?.querySelector('.pack-img');
            el?.classList.add('open', 'cutting');
            if (el) disableTilt(el);
            if (packImg) packImg.style.visibility = 'hidden';
            unwrapHoverTilt(index);
            renderCardContents(index, item.cards ?? [], item.set);
        }
        if (item.locked) {
            lockedIds.add(index);
            document.getElementById(index)?.classList.add('locked');
        }
    });

    centerCorrectly();
    console.log(`[render] Hydrated bundle #${bundleId} — ${bundle.items.length} item(s).`);
}


// ── bundleCurrentSession ──────────────────────────────────────

async function bundleCurrentSession() {
    if (renderedItems.length === 0) {
        console.warn('[render] Nothing to bundle.');
        return null;
    }
    const snapshots = snapshotItems();
    const id = await saveBundle(snapshots, currentBundleId ?? undefined);
    currentBundleId = id;
    console.log(`[render] Session bundled as #${id}.`);
    return id;
}
