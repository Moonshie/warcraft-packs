// ─────────────────────────────────────────────────────────────
//  GENERATION
//  Three exported functions: generateCard, generatePack, generateBox
//  All are pure — no globals read or written, no side effects.
// ─────────────────────────────────────────────────────────────

// ── generateCard ─────────────────────────────────────────────
// Picks a single card from a set's pool matching filters, after
// applying any eligible replacements.
//
// set        — the full set object (e.g. Azeroth). Used to resolve
//              override replacement pools by name.
// pool       — the already-selected working pool (e.g. set.pools.main),
//              passed in so callers can narrow it for duplicates.
// filters    — key/value pairs to match against card properties.
// replacements — array of replacement definitions from the pack config.
// firedCounts  — Map of replacement index → fire count this pack.

function generateCard(set, pool, filters, replacements = [], firedCounts = new Map()) {
    let activeFilters = { ...filters };
    let activePool = pool;
    console.log('[generateCard] Starting. Filters:', activeFilters, '| Pool size:', pool.length);

    // Collect eligible replacements: condition must match filters,
    // and the replacement must not have reached its limit.
    const eligible = replacements
        .map((r, i) => ({ r, i }))
        .filter(({ r, i }) => {
            const fired = firedCounts.get(i) ?? 0;
            if (r.limit !== null && fired >= r.limit) {
                console.log(`[generateCard] Replacement #${i} skipped — limit reached (${fired}/${r.limit})`);
                return false;
            }
            const conditionMet = Object.entries(r.condition).every(([key, value]) => activeFilters[key] === value);
            if (!conditionMet) {
                console.log(`[generateCard] Replacement #${i} skipped — condition not met:`, r.condition, 'vs active filters:', activeFilters);
            }
            return conditionMet;
        })
        .sort((a, b) => b.r.priority - a.r.priority);

    console.log(`[generateCard] ${eligible.length} eligible replacement(s) after filtering:`, eligible.map(({ r, i }) => `#${i} priority ${r.priority}`));

    // Roll each eligible replacement in priority order — first to
    // fire wins. Others are skipped for this card.
    for (const { r, i } of eligible) {
        const roll = Math.random();
        console.log(`[generateCard] Rolling replacement #${i} (chance ${r.chance}, priority ${r.priority}): rolled ${roll.toFixed(4)} — ${roll < r.chance ? 'FIRED' : 'missed'}`);
        if (roll < r.chance) {
            const before = { ...activeFilters };
            if (r.mode === 'override') {
                // Override discards existing filters entirely. If the
                // replacement names a pool (e.g. 'promo'), look it up on
                // the set object. Falls back to the full main pool if the
                // named pool doesn't exist or no pool is specified.
                activeFilters = { ...r.replace };
                activePool = (r.pool && set.pools[r.pool]) ? set.pools[r.pool] : set.pools.main;
            } else {
                // Merge only replaces the specific keys in r.replace,
                // leaving other filters (e.g. type) intact.
                activeFilters = { ...activeFilters, ...r.replace };
            }
            firedCounts.set(i, (firedCounts.get(i) ?? 0) + 1);
            console.log(`[generateCard] Replacement #${i} fired (${r.mode}). Filters: ${JSON.stringify(before)} → ${JSON.stringify(activeFilters)}${r.mode === 'override' ? ' | Pool reset to full' : ''}`);
            break;
        }
    }

    // Filter pool down to cards matching all active filters.
    const filtered = activePool.filter(card => {
        return Object.entries(activeFilters).every(([key, value]) => {
            const cardValue = card[key];
            const cardValues = Array.isArray(cardValue) ? cardValue : [cardValue];
            const filterValues = Array.isArray(value) ? value : [value];

            const positive = filterValues.filter(v => !String(v).startsWith('!'));
            const negative = filterValues.filter(v =>  String(v).startsWith('!')).map(v => String(v).slice(1));

            if (positive.length > 0 && !cardValues.some(cv => positive.includes(cv))) return false;
            if (negative.length > 0 &&  cardValues.some(cv => negative.includes(cv))) return false;
            return true;
        });
    });

    console.log(`[generateCard] Pool filtered to ${filtered.length} card(s) matching`, activeFilters);

    if (filtered.length === 0) {
        console.warn('[generateCard] No cards matched filters', activeFilters);
        return null;
    }

    const picked = filtered[Math.floor(Math.random() * filtered.length)];
    console.log(`[generateCard] Picked: ${picked.name} (${picked.rarity} ${picked.type}, set #${picked.setNumber})`);
    return picked;
}


// ── generatePack ─────────────────────────────────────────────
// Generates a pack from a definition against a set object.
// Defaults to set.pools.main as the card pool.

function generatePack(set, definition) {
    const { slots, replacements = [], allowDuplicates = true, pool: poolKey = 'main' } = definition;
    console.log(`[generatePack] Starting. ${slots.length} slot type(s), ${replacements.length} replacement(s), allowDuplicates: ${allowDuplicates}, pool: '${poolKey}'`);

    const pack = {
        type: 'pack',
        cards: [],
    };

    const firedCounts = new Map();
    let remainingPool = [...(set.pools[poolKey] ?? set.pools.main)];

    for (const [slotIndex, slot] of slots.entries()) {
        console.log(`[generatePack] Slot ${slotIndex + 1}/${slots.length}: filters ${JSON.stringify(slot.filters)}, count ${slot.count}. Pool remaining: ${remainingPool.length}`);
        for (let i = 0; i < slot.count; i++) {
            const card = generateCard(set, remainingPool, slot.filters, replacements, firedCounts);

            if (card) {
                pack.cards.push(card);
                if (!allowDuplicates) {
                    remainingPool = remainingPool.filter(c => c !== card);
                }
            }
        }
    }

    console.log(`[generatePack] Done. Generated ${pack.cards.length} card(s):`, pack.cards.map(c => c.name));
    return pack;
}


// ── generateBox ──────────────────────────────────────────────
// Generates a box from a definition against a set object.
// Boxes can nest other boxes, packs, or singleton cards.

function generateBox(set, definition) {
    console.log(`[generateBox] Starting. ${definition.contents.length} content entry/entries.`);

    const box = {
        type:           'box',
        cards:          [],   // inline items shown when the box is opened
        containedItems: [],   // spawned items that appear on the track
    };

    for (const [entryIndex, entry] of definition.contents.entries()) {
        const count   = entry.count ?? 1;
        const display = entry.display ?? 'inline';
        console.log(`[generateBox] Entry ${entryIndex + 1}: type '${entry.type}', display '${display}', count ${count}`);

        for (let i = 0; i < count; i++) {

            if (entry.type === 'box') {
                console.log(`[generateBox] Generating nested box ${i + 1}/${count}...`);
                const nested = generateBox(set, entry.definition);
                if (display === 'spawned') box.containedItems.push(nested);
                else box.cards.push(...nested.cards); // flatten inline nested box cards

            } else if (entry.type === 'pack') {
                console.log(`[generateBox] Generating pack ${i + 1}/${count}...`);
                const pack = generatePack(set, entry.definition);
                pack._definition = entry.definition; // used by ui.js for art resolution
                if (display === 'spawned') box.containedItems.push(pack);
                else box.cards.push(...pack.cards); // flatten inline pack cards

            } else if (entry.type === 'card') {
                // pool property overrides set.pools.main for this entry
                const pool = entry.pool ? (set.pools[entry.pool] ?? set.pools.main) : set.pools.main;
                console.log(`[generateBox] Generating card ${i + 1}/${count} from pool '${entry.pool ?? 'main'}' with filters:`, entry.filters);
                const card = generateCard(set, pool, entry.filters ?? {});
                if (card) box.cards.push(card);

            } else if (entry.type === 'precon') {
                // Pick a random precon deck from set.precons and resolve card objects
                const preconNames = Object.keys(set.precons);
                const heroName    = preconNames[Math.floor(Math.random() * preconNames.length)];
                const deckList    = set.precons[heroName];
                const cards       = deckList.map(n => set.pools.main[n - 1]).filter(Boolean);
                console.log(`[generateBox] Precon '${heroName}': ${cards.length} card(s)`);
                box.cards.push(...cards);
            }
        }
    }

    console.log(`[generateBox] Done. ${box.cards.length} inline card(s), ${box.containedItems.length} spawned item(s).`);
    return box;
}

// ── generateSealed ────────────────────────────────────────────
// Generates an array of packs from a sealed definition.
// Returns plain pack objects — ui.js stamps set, artID,
// and definitionName on each one afterward.

function generateSealed(set, definition) {
    if (!definition?.contents) return [];

    return definition.contents.flatMap(entry => {
        const packs = [];
        for (let i = 0; i < (entry.count ?? 1); i++) {
            const pack        = generatePack(set, entry.definition);
            pack._definition  = entry.definition; // used by ui.js for metadata stamping
            packs.push(pack);
        }
        return packs;
    });
}
