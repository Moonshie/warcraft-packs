// ─────────────────────────────────────────────────────────────
//  RENDER
//  Manages the item track — rendering, opening, and snapshotting
//  packs, boxes, and singleton cards.
//
//  Item types:
//    pack  — a booster pack, openable to reveal cards
//    box   — a big box, openable to reveal cards + spawn extra packs
//    card  — a singleton card (oversize hero, dragged-out card, etc.)
//
//  Depends on: animation.js, storage.js, wow-tcg-definitions.js
// ─────────────────────────────────────────────────────────────

// ── State ─────────────────────────────────────────────────────

const renderedItems   = [];        // All items on the track, indexed by id
const openedIds       = new Set(); // ids of items whose contents are visible
const lockedIds       = new Set(); // ids of items locked against card changes
let   currentBundleId = null;      // id of the loaded bundle, null if unsaved

// Maps set ids to their wowcards.info URL slug
const wowcardsSlug = {
    'Azeroth':    'azeroth',
    'DarkPortal': 'dark-portal',
};


// ── renderAll ─────────────────────────────────────────────────
// Renders an array of items onto the track.

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
// Renders a single item wrapper onto the track.

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
// Opens a pack or box — triggers animation, renders card list,
// and locks the item.

function openItem(id) {
    const item = renderedItems[id];
    if (openedIds.has(id)) return;

    openedIds.add(id);
    lockedIds.add(id);
    itemAnimation(id, item.type);

    if (item.type === 'pack') {
        setTimeout(() => {
            renderCardContents(id, item.cards, item.set);
            bundleCurrentSession().then(() => refreshBundleList());
        }, 670);
    }

    if (item.type === 'box') {
        setTimeout(() => {
            renderCardContents(id, item.cards ?? [], item.set);
            if (item.containedItems?.length) {
                renderAll(item.containedItems);
            }
            bundleCurrentSession().then(() => refreshBundleList());
        }, 700);
    }
}


// ── renderCardContents ────────────────────────────────────────
// Renders the card stack inside an opened item's output div.

function renderCardContents(id, cards, set) {
    const output = document.getElementById(`${id}-output`);
    output.innerHTML = '';
    output.classList.remove('hidden');
    renderCardList(output, cards, set);
}


// ── renderCardList ────────────────────────────────────────────
// Renders a visual stack of cards — each card offset by STRIP_VH,
// showing only its top portion (name area) until hovered.

const CARD_VH  = 36;   // full card height in vh
const STRIP_VH = 3.6;  // visible strip per card (~10%)

function renderCardList(output, cards, set) {
    const slug = wowcardsSlug[set] ?? set.toLowerCase();

    const stackHeight = cards.length > 0
        ? (cards.length - 1) * STRIP_VH + CARD_VH
        : 0;

    const stack = document.createElement('div');
    stack.className    = 'card-stack';
    stack.style.height = `${stackHeight}vh`;

    cards.forEach((card, index) => {
        const item = document.createElement('div');
        item.className    = `card-item rarity-${card.rarity}`;
        item.style.top    = `${index * STRIP_VH}vh`;
        item.style.height = `${CARD_VH}vh`;
        item.style.zIndex = index + 1;

        const img     = document.createElement('img');
        img.className = 'card-img-full';
        img.src       = `./data/cardImg/${card.set}/${card.setNumber}.jpg`;
        img.draggable = false;

        const strip     = document.createElement('div');
        strip.className = 'card-strip';

        strip.addEventListener('mouseenter', () => item.classList.add('hovered'));
        strip.addEventListener('mouseleave', () => item.classList.remove('hovered'));
        strip.addEventListener('click', () => {
            window.open(`http://www.wowcards.info/card/${slug}/en/${card.setNumber}`, '_blank');
        });

        item.appendChild(img);
        item.appendChild(strip);
        stack.appendChild(item);
    });

    // Last card: full height is interactive
    const lastStrip = stack.lastElementChild?.querySelector('.card-strip');
    if (lastStrip) lastStrip.style.height = '100%';

    output.appendChild(stack);
}


// ── centerCorrectly ───────────────────────────────────────────
// Adjusts track padding so items are visually centred.

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
// Locking prevents card changes. Items are locked automatically
// on open, and can be manually unlocked by the user.

function lockItem(id) {
    lockedIds.add(id);
    document.getElementById(id)?.classList.add('locked');
}

function unlockItem(id) {
    lockedIds.delete(id);
    document.getElementById(id)?.classList.remove('locked');
}


// ── clearTrack ────────────────────────────────────────────────
// Removes all items from the track.
// Prompts the user if there are unbundled items.
// Returns true if cleared, false if cancelled.

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
// Builds a storage-ready snapshot of the current track.
// Items are stored as-is since there's no flattening.

function snapshotItems() {
    return renderedItems.map((item, id) => ({
        ...item,
        opened: openedIds.has(id),
        locked: lockedIds.has(id),
    }));
}


// ── hydrateBundle ─────────────────────────────────────────────
// Loads a bundle back onto the track, restoring open/locked state.

async function hydrateBundle(bundleId) {
    const bundle = await loadBundle(bundleId);
    if (!bundle) return;

    const cleared = clearTrack();
    if (!cleared) return;

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
// Snapshots the current track and saves it as a bundle.
// Overwrites the current bundle if one is loaded.

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
