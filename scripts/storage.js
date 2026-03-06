// ─────────────────────────────────────────────────────────────
//  STORAGE
//  IndexedDB persistence via Dexie.js.
//
//  Public API:
//    initStorage()
//    getAllBundles()          — active only, sorted by sortOrder
//    getBinnedBundles()       — binned only
//    saveBundle(items, id?, name?, createdAt?)
//    loadBundle(id)
//    deleteBundle(id)
//    duplicateBundle(id)
//    moveBundleRelativeTo(draggedId, targetId, insertBefore)
//    binBundle(id)
//    restoreBundle(id)
//    emptyBin()
//    exportBundleJSON(id)
//    exportAllBundles()
//    deleteAllBundles()
//    importBundleJSON(file, singleOnly?)
// ─────────────────────────────────────────────────────────────

const db = new Dexie('WarcraftPacks');

// Version 1 — original schema
db.version(1).stores({
    bundles: '++id, createdAt',
});

// Version 2 — adds sortOrder index and binned field
db.version(2).stores({
    bundles: '++id, sortOrder',
}).upgrade(async tx => {
    const all = await tx.table('bundles').toArray();
    // Preserve creation order: newest first = lowest sortOrder (top of list)
    all.sort((a, b) => b.createdAt - a.createdAt);
    for (let i = 0; i < all.length; i++) {
        await tx.table('bundles').update(all[i].id, { sortOrder: i, binned: false });
    }
});


// ── initStorage ───────────────────────────────────────────────

async function initStorage() {
    await db.open();
    console.log('[storage] DB ready (version', db.verno, ')');
}


// ── reindexBundles ────────────────────────────────────────────
// Normalises sortOrder to 0, 1, 2... for all non-binned bundles.
// Called after any structural change (add, delete, move, restore).

async function reindexBundles() {
    const all    = await db.bundles.toArray();
    const active = all.filter(b => !b.binned).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    for (let i = 0; i < active.length; i++) {
        if (active[i].sortOrder !== i) {
            await db.bundles.update(active[i].id, { sortOrder: i });
        }
    }
}


// ── getAllBundles ──────────────────────────────────────────────

async function getAllBundles() {
    const all = await db.bundles.toArray();
    return all.filter(b => !b.binned).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}


// ── getBinnedBundles ──────────────────────────────────────────

async function getBinnedBundles() {
    const all = await db.bundles.toArray();
    return all.filter(b => b.binned).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}


// ── saveBundle ────────────────────────────────────────────────
// Creates a new bundle or overwrites an existing one.
// New bundles are placed at the top (lowest sortOrder).

async function saveBundle(items, id = null, nameOverride = null, createdAtOverride = null) {
    const now  = new Date();
    const name = nameOverride ?? now.toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).replace(',', '');

    if (id !== null) {
        const existing = await db.bundles.get(id);
        const bundle   = {
            ...existing,
            items,
            name:      nameOverride      ?? existing?.name      ?? name,
            createdAt: createdAtOverride ?? existing?.createdAt ?? now.getTime(),
        };
        await db.bundles.put(bundle);
        console.log(`[storage] Bundle #${id} overwritten.`);
        return id;
    }

    // New bundle: place at top
    const all      = await db.bundles.toArray();
    const active   = all.filter(b => !b.binned);
    const minOrder = active.length > 0 ? Math.min(...active.map(b => b.sortOrder ?? 0)) : 0;

    const newId = await db.bundles.add({
        name,
        createdAt: createdAtOverride ?? now.getTime(),
        items,
        sortOrder: minOrder - 1,
        binned:    false,
    });
    await reindexBundles();
    console.log(`[storage] Bundle saved as #${newId}.`);
    return newId;
}


// ── loadBundle ────────────────────────────────────────────────

async function loadBundle(id) {
    return (await db.bundles.get(id)) ?? null;
}


// ── deleteBundle ──────────────────────────────────────────────

async function deleteBundle(id) {
    await db.bundles.delete(id);
    await reindexBundles();
    console.log(`[storage] Bundle #${id} deleted.`);
}


// ── duplicateBundle ───────────────────────────────────────────
// Clones a bundle and places it immediately below the original.

async function duplicateBundle(id) {
    const original = await loadBundle(id);
    if (!original) return null;

    const all    = await db.bundles.toArray();
    const base   = original.name.replace(/ \(copy(?: \d+)?\)$/, '');
    const copies = all.filter(b => {
        const stripped = b.name.replace(/ \(copy(?: \d+)?\)$/, '');
        return stripped === base && b.id !== id;
    });
    const suffix  = copies.length === 0 ? '(copy)' : `(copy ${copies.length + 1})`;
    const newName = `${base} ${suffix}`;

    // sortOrder + 0.5 places it just after original; reindex normalises
    const newId = await db.bundles.add({
        name:      newName,
        createdAt: original.createdAt + 1,
        items:     original.items,
        sortOrder: original.sortOrder + 0.5,
        binned:    false,
    });
    await reindexBundles();
    console.log(`[storage] Bundle #${id} duplicated as #${newId}.`);
    return newId;
}


// ── moveBundleRelativeTo ──────────────────────────────────────
// Reorders bundles by moving draggedId before or after targetId.

async function moveBundleRelativeTo(draggedId, targetId, insertBefore) {
    const all    = await db.bundles.toArray();
    const active = all.filter(b => !b.binned).sort((a, b) => a.sortOrder - b.sortOrder);

    const draggedIdx = active.findIndex(b => b.id === draggedId);
    if (draggedIdx === -1) return;
    const [dragged]  = active.splice(draggedIdx, 1);

    const targetIdx = active.findIndex(b => b.id === targetId);
    if (targetIdx === -1) return;

    active.splice(insertBefore ? targetIdx : targetIdx + 1, 0, dragged);

    for (let i = 0; i < active.length; i++) {
        await db.bundles.update(active[i].id, { sortOrder: i });
    }
}


// ── binBundle / restoreBundle / emptyBin ──────────────────────

async function binBundle(id) {
    await db.bundles.update(id, { binned: true });
    await reindexBundles();
    console.log(`[storage] Bundle #${id} moved to bin.`);
}

async function restoreBundle(id) {
    const all      = await db.bundles.toArray();
    const active   = all.filter(b => !b.binned);
    const minOrder = active.length > 0 ? Math.min(...active.map(b => b.sortOrder ?? 0)) : 0;
    await db.bundles.update(id, { binned: false, sortOrder: minOrder - 1 });
    await reindexBundles();
    console.log(`[storage] Bundle #${id} restored.`);
}

async function emptyBin() {
    const all    = await db.bundles.toArray();
    const binned = all.filter(b => b.binned);
    for (const b of binned) await db.bundles.delete(b.id);
    console.log(`[storage] Bin emptied (${binned.length} bundle(s) deleted).`);
}


// ── exportBundleJSON ──────────────────────────────────────────

async function exportBundleJSON(id) {
    const bundle = await loadBundle(id);
    if (!bundle) return;
    const json     = JSON.stringify(bundle, null, 2);
    const blob     = new Blob([json], { type: 'application/json' });
    const url      = URL.createObjectURL(blob);
    const filename = `${bundle.name.replace(/[^a-z0-9]/gi, '-')}.json`;
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}


// ── exportAllBundles (backup) ─────────────────────────────────

async function exportAllBundles() {
    const bundles = await getAllBundles();
    if (!bundles.length) { console.warn('[storage] Nothing to back up.'); return; }
    const json     = JSON.stringify(bundles, null, 2);
    const blob     = new Blob([json], { type: 'application/json' });
    const url      = URL.createObjectURL(blob);
    const date     = new Date().toISOString().slice(0, 10);
    const filename = `warcraft-packs-backup-${date}.json`;
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log(`[storage] Backed up ${bundles.length} bundle(s) as ${filename}.`);
}


// ── deleteAllBundles ──────────────────────────────────────────

async function deleteAllBundles() {
    await db.bundles.clear();
    console.log('[storage] All bundles deleted.');
}


// ── importBundleJSON ──────────────────────────────────────────
// Accepts a single-bundle file or a backup (array of bundles).
// singleOnly: true → throws if file contains multiple bundles (backup).
// Imported bundles are placed at the top, preserving relative order.

async function importBundleJSON(file, singleOnly = false) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async e => {
            try {
                const data = JSON.parse(e.target.result);
                const list = Array.isArray(data) ? data : [data];

                if (singleOnly && Array.isArray(data)) {
                    throw new Error('This looks like a backup file. Use Restore instead.');
                }

                for (const entry of list) {
                    if (!entry.items || !Array.isArray(entry.items)) {
                        throw new Error('Invalid bundle file — missing items array.');
                    }
                }

                // Find current min sortOrder
                const all      = await db.bundles.toArray();
                const active   = all.filter(b => !b.binned);
                let   minOrder = active.length > 0
                    ? Math.min(...active.map(b => b.sortOrder ?? 0))
                    : 0;

                const ids = [];
                // Import in reverse so first entry ends up at the top
                for (let i = list.length - 1; i >= 0; i--) {
                    const entry = list[i];
                    minOrder   -= 1;
                    const newId = await db.bundles.add({
                        name:      entry.name      ?? 'Imported bundle',
                        createdAt: entry.createdAt ?? Date.now(),
                        items:     entry.items,
                        sortOrder: minOrder,
                        binned:    false,
                    });
                    ids.push(newId);
                }

                await reindexBundles();
                console.log(`[storage] Imported ${ids.length} bundle(s).`);
                resolve(ids);
            } catch (err) {
                console.error('[storage] Import failed:', err);
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
    });
}
