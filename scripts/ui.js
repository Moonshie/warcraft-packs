// ─────────────────────────────────────────────────────────────
//  UI
//  DOM references, menu state, selector logic, card preview,
//  generate button, bundle button, and sidebar bundle list.
//
//  All game-specific values come from GameConfig in the loaded
//  definitions file — this module contains no WoW-specific logic.
//
//  Depends on: render.js, storage.js, generation.js,
//              [game]-definitions.js, set files
// ─────────────────────────────────────────────────────────────

// ── DOM references ────────────────────────────────────────────

const root           = document.querySelector(':root');
const track          = document.querySelector('.item-track');
const genButton      = document.getElementById('generate');
const left           = document.querySelector('.sidebar#left');
const center         = document.querySelector('.menu-wrapper');
const right          = document.querySelector('.sidebar#right');
const fullscreenMenu = document.querySelector('.fullscreen');
const setSelect      = document.getElementById('set-select');
const typeSelect     = document.getElementById('type-select');
const extrasContainer = document.getElementById('extras-container');
const previewBox     = document.getElementById('preview-box');
const previewImage   = document.getElementById('preview-image');
const previewLoader  = document.getElementById('preview-loader');
const bundleList     = document.querySelector('.bundle-list');


// ── Menu state ────────────────────────────────────────────────

const openMenus = {
    left:       false,
    center:     true,
    right:      false,
    fullscreen: false,
};

function toggleMenu(id) {
    const isOpen = openMenus[id];
    openMenus[id] = !isOpen;

    if (id === 'left') {
        left.classList.toggle('closed', isOpen);

    } else if (id === 'right') {
        right.classList.toggle('closed', isOpen);

    } else if (id === 'center') {
        center.classList.toggle('closed', isOpen);
        center.style.translate = isOpen
            ? `0 -${window.getComputedStyle(center).height}`
            : '';

    } else if (id === 'fullscreen') {
        fullscreenMenu.classList.toggle('closed', isOpen);
        fullscreenMenu.style.translate = isOpen
            ? `0 -${window.getComputedStyle(fullscreenMenu).height}`
            : '';
    }
}


// ── Selector population ───────────────────────────────────────
// Builds set, type, and extra selectors entirely from GameConfig.
// HTML only needs the bare <select> elements with the right ids.

function populateSelectors() {
    // Set selector
    setSelect.innerHTML = '<option value="">— Set —</option>';
    Object.keys(GameConfig.sets).forEach(id => {
        const opt   = document.createElement('option');
        opt.value   = id;
        opt.textContent = GameConfig.sets[id].name;
        setSelect.appendChild(opt);
    });

    // Type selector — grouped by category
    typeSelect.innerHTML = '<option value="">— Type —</option>';
    const groups = {};
    GameConfig.itemTypes.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
    });
    Object.entries(groups).forEach(([category, items]) => {
        const group = document.createElement('optgroup');
        group.label = category.charAt(0).toUpperCase() + category.slice(1);
        items.forEach(item => {
            const opt       = document.createElement('option');
            opt.value       = item.name;
            opt.dataset.category = item.category;
            opt.dataset.extraFilter = item.extraFilter ?? '';
            opt.textContent = item.name;
            group.appendChild(opt);
        });
        typeSelect.appendChild(group);
    });

    // Extra selectors — one per unique extraFilter key in GameConfig
    extrasContainer.innerHTML = '';
    const seen = new Set();
    GameConfig.itemTypes.forEach(item => {
        if (!item.extraFilter || seen.has(item.extraFilter)) return;
        seen.add(item.extraFilter);

        const wrapper = document.createElement('div');
        wrapper.className         = 'extra-select-wrapper';
        wrapper.dataset.filterKey = item.extraFilter;

        const label       = document.createElement('label');
        label.textContent = GameConfig.extraFilterLabels[item.extraFilter] ?? item.extraFilter;

        const select             = document.createElement('select');
        select.id                = `extra-${item.extraFilter}`;
        select.dataset.filterKey = item.extraFilter;
        select.className         = 'extra-select disabled';
        select.innerHTML         = '<option value="">— Any —</option>';

        GameConfig.extraFilterOptions[item.extraFilter].forEach(val => {
            const opt       = document.createElement('option');
            opt.value       = val;
            opt.textContent = val;
            select.appendChild(opt);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        extrasContainer.appendChild(wrapper);
    });

    typeSelect.addEventListener('change', checkSelectors);
    checkSelectors();
}


// ── Selector management ───────────────────────────────────────
// Enables/disables extra selectors based on selected type.

function checkSelectors() {
    const selectedOpt    = typeSelect.selectedOptions[0];
    const activeFilter   = selectedOpt?.dataset.extraFilter ?? '';

    extrasContainer.querySelectorAll('.extra-select').forEach(sel => {
        const isNeeded = sel.dataset.filterKey === activeFilter;
        if (isNeeded) {
            sel.classList.remove('disabled');
        } else {
            sel.selectedIndex = 0;
            sel.classList.add('disabled');
        }
    });
}


// ── Generate button ───────────────────────────────────────────

genButton.addEventListener('click', () => {
    const setId    = setSelect.value;
    const typeName = typeSelect.value;

    if (!setId)    { alert('Please select a set.');  return; }
    if (!typeName) { alert('Please select a type.'); return; }

    const set        = GameConfig.sets[setId];
    const typeConfig = GameConfig.itemTypes.find(t => t.name === typeName);

    if (!set)        { alert('Set data not found.');  return; }
    if (!typeConfig) { alert('Type config not found.'); return; }

    // Collect active extra filter value if required
    let extraFilterValue = {};
    if (typeConfig.extraFilter) {
        const sel = document.getElementById(`extra-${typeConfig.extraFilter}`);
        if (!sel?.value) { alert(`Please select a ${GameConfig.extraFilterLabels[typeConfig.extraFilter] ?? typeConfig.extraFilter}.`); return; }
        extraFilterValue = { [typeConfig.extraFilter]: sel.value };
    }

    const items = [];

    if (typeConfig.category === 'booster') {
        const definition = injectExtraFilters(typeConfig.definition, extraFilterValue);
        const pack       = generatePack(set, definition);
        pack.definitionName = typeName;
        pack.set            = setId;
        pack.artID          = resolveArtID(set, typeConfig, extraFilterValue);
        items.push(pack);
    }

    if (typeConfig.category === 'box') {
        const box = generateBox(set, typeConfig.definition);
        box.definitionName  = typeName;
        box.set             = setId;
        box.artID           = resolveArtID(set, typeConfig, extraFilterValue);
        // Stamp set and artID onto any spawned contained items,
        // resolving art from their own definition's typeConfig
        box.containedItems.forEach(item => {
            item.set = item.set ?? setId;
            const itemTypeConfig = GameConfig.itemTypes.find(t => t.definition === item._definition);
            item.artID          ??= resolveArtID(set, itemTypeConfig ?? { artCategory: 'booster' }, {});
            item.definitionName ??= itemTypeConfig?.name ?? 'Booster';
        });
        items.push(box);
    }

    if (typeConfig.category === 'sealed') {
        const packs = generateSealed(set, typeConfig.definition);
        packs.forEach(pack => {
            const itemTypeConfig    = GameConfig.itemTypes.find(t => t.definition === pack._definition);
            pack.set                = setId;
            pack.definitionName     = itemTypeConfig?.name ?? 'Booster';
            pack.artID              = resolveArtID(set, itemTypeConfig ?? { artCategory: 'booster' }, {});
            items.push(pack);
        });
    }

    if (items.length > 0) renderAll(items);
});


// ── Generation helpers ────────────────────────────────────────

// Injects extra filters (e.g. { classRestriction: 'Druid' }) into
// every slot of a pack definition without mutating the original.
function injectExtraFilters(definition, extra) {
    if (!extra || Object.keys(extra).length === 0) return definition;
    return {
        ...definition,
        slots: definition.slots.map(slot => ({
            ...slot,
            filters: { ...slot.filters, ...extra },
        })),
    };
}


// ── Art ID resolution ─────────────────────────────────────────

function resolveArtID(set, typeConfig, extra) {
    // Enhanced booster types get their own dedicated art path
    if (typeConfig.extraFilter === 'classRestriction' && extra.classRestriction) {
        return `enhanced/Class Booster ${extra.classRestriction}`;
    }
    if (typeConfig.extraFilter === 'faction' && extra.faction) {
        return `enhanced/Faction Booster ${extra.faction}`;
    }
    if (typeConfig.name === 'Equipment Booster') return 'enhanced/Equipment Booster';
    if (typeConfig.name === 'Neutral Booster')   return 'enhanced/Neutral Booster';

    const artCat = typeConfig.artCategory ?? typeConfig.category;
    const options = availableImages[set.id]?.[artCat] ?? [];
    return options[Math.floor(Math.random() * options.length)] ?? '';
}


// ── Bundle sidebar ────────────────────────────────────────────

async function refreshBundleList() {
    const bundles = await getAllBundles();
    bundleList.innerHTML = '';

    if (bundles.length === 0) {
        const empty       = document.createElement('p');
        empty.className   = 'bundle-empty';
        empty.textContent = 'No bundles yet.';
        bundleList.appendChild(empty);
        return;
    }

    bundles.forEach(bundle => {
        const isActive = bundle.id === currentBundleId;

        const el          = document.createElement('div');
        el.className      = `bundle-entry${isActive ? ' active' : ''}`;
        el.dataset.id     = bundle.id;

        const nameEl      = document.createElement('span');
        nameEl.className  = 'bundle-name';
        nameEl.textContent = bundle.name;
        nameEl.title      = `Double-click to rename\n${'─'.repeat(20)}\n${buildBundleSummary(bundle.items)}`;

        nameEl.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.className   = 'bundle-name-input';
            input.value       = bundle.name;
            input.spellcheck  = false;
            nameEl.replaceWith(input);
            input.focus();
            input.select();

            const commit = async () => {
                const newName = input.value.trim() || bundle.name;
                const full    = await loadBundle(bundle.id);
                if (full) await saveBundle(full.items, bundle.id, newName, full.createdAt);
                await refreshBundleList();
            };

            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); commit(); }
                if (e.key === 'Escape') refreshBundleList();
            });
            input.addEventListener('blur', commit);
        });

        el.appendChild(nameEl);

        if (isActive) {
            const unloadBtn = makeIconBtn('unload', () => {
                clearTrack(true);
                refreshBundleList();
            });
            unloadBtn.title = 'Unload';
            el.appendChild(unloadBtn);
        } else {
            const loadBtn   = makeIconBtn('load', async () => {
                await hydrateBundle(bundle.id);
                await refreshBundleList();
            });
            const exportBtn = makeIconBtn('export',    () => exportBundleJSON(bundle.id));
            const dupBtn    = makeIconBtn('duplicate', async () => {
                await duplicateBundle(bundle.id);
                await refreshBundleList();
            });
            const delBtn    = makeIconBtn('delete', async () => {
                if (confirm(`Delete bundle "${bundle.name}"?`)) {
                    await deleteBundle(bundle.id);
                    await refreshBundleList();
                }
            });
            el.append(loadBtn, exportBtn, dupBtn, delBtn);
        }

        bundleList.appendChild(el);
    });
}

function makeIconBtn(action, onClick) {
    const btn     = document.createElement('button');
    btn.className = `bundle-btn bundle-btn--${action}`;
    btn.title     = action.charAt(0).toUpperCase() + action.slice(1);
    btn.addEventListener('click', e => { e.stopPropagation(); onClick(); });
    return btn;
}

function buildBundleSummary(items) {
    const counts = {};
    items.forEach(item => {
        const setName = GameConfig.sets[item.set]?.name ?? item.set;
        const key = `${setName} ${item.definitionName}`;
        counts[key] = (counts[key] ?? 0) + 1;
    });
    return Object.entries(counts).map(([n, c]) => `${c}x ${n}`).join('\n');
}


// ── Import button ─────────────────────────────────────────────

function initSidebarPanel() {
    const importInput  = document.getElementById('import-input');
    const importBtn    = document.getElementById('import-btn');
    const exportAllBtn = document.getElementById('export-all-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    importBtn?.addEventListener('click', () => importInput.click());
    importInput?.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await importBundleJSON(file);
            await refreshBundleList();
        } catch (err) {
            alert(`Import failed: ${err.message}`);
        }
        importInput.value = '';
    });

    exportAllBtn?.addEventListener('click', () => exportAllBundles());

    deleteAllBtn?.addEventListener('click', async () => {
        if (!confirm('Delete all bundles? This cannot be undone.')) return;
        await deleteAllBundles();
        clearTrack();
        await refreshBundleList();
    });
}


// ── Card preview ──────────────────────────────────────────────

const imageCache = {};

function attachPreviewListeners() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.querySelectorAll('a.cardLink').forEach(link => {
        if (link.dataset.previewAttached) return;
        link.dataset.previewAttached = 'true';

        const imgUrl = link.getAttribute('dataImg');

        link.addEventListener('mouseenter', () => {
            previewBox.style.display = 'block';
            previewBox.classList.add('show');

            if (previewImage.dataset.src === imgUrl) return;

            if (imageCache[imgUrl]) {
                previewLoader.style.display = 'none';
                previewImage.style.display  = 'block';
                previewImage.src            = imgUrl;
                previewImage.dataset.src    = imgUrl;
                return;
            }

            previewImage.style.display  = 'none';
            previewLoader.style.display = 'flex';

            const img   = new Image();
            img.src     = imgUrl;
            img.onload  = () => {
                imageCache[imgUrl]          = true;
                previewImage.src            = imgUrl;
                previewImage.dataset.src    = imgUrl;
                previewLoader.style.display = 'none';
                previewImage.style.display  = 'block';
            };
            img.onerror = () => { previewLoader.textContent = 'Failed to load'; };
        });

        link.addEventListener('mousemove', e => {
            const offset    = 20;
            const boxWidth  = previewBox.offsetWidth;
            const boxHeight = previewBox.offsetHeight;
            let x = e.clientX + offset;
            let y = e.clientY + offset;
            if (x + boxWidth  > window.innerWidth)  x = e.clientX - boxWidth  - offset;
            if (y + boxHeight > window.innerHeight)  y = e.clientY - boxHeight - offset;
            previewBox.style.left = `${x}px`;
            previewBox.style.top  = `${y}px`;
        });

        link.addEventListener('mouseleave', () => {
            previewBox.classList.remove('show');
            previewBox.style.display = 'none';
        });
    });
}


// ── Scroll handler ────────────────────────────────────────────

track.addEventListener('wheel', e => {
    let el = document.elementFromPoint(e.clientX, e.clientY);
    while (el && el !== document.body) {
        const { overflowY } = window.getComputedStyle(el);
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) return;
        el = el.parentElement;
    }
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
    }
}, { passive: false });


// ── Init ──────────────────────────────────────────────────────

async function initUI() {
    await initStorage();
    populateSelectors();
    await refreshBundleList();
    initSidebarPanel();
    track.scrollLeft = 0;

    document.querySelectorAll('hover-tilt').forEach(el => {
        el.style.touchAction = 'pan-x';
    });
}

initUI();
