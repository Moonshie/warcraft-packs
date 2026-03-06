// ─────────────────────────────────────────────────────────────
//  STORAGE
//  Handles all persistence via IndexedDB (Dexie.js).
//  Dexie is loaded via CDN in index.html before this file.
//
//  Public API:
//    initStorage()              — must be called on page load
//    saveBundle(items, id?)     — create new or overwrite existing bundle
//    loadBundle(id)             — returns bundle object
//    getAllBundles()             — returns array of all bundles (metadata only)
//    deleteBundle(id)           — removes bundle by id
//    duplicateBundle(id)        — clones bundle with new id and fresh timestamp
//    exportBundleJSON(id)       — triggers download of bundle as .json file
//    importBundleJSON(file)     — imports a .json file as a new bundle
//
//  Bundle shape in DB:
//  {
//      id:        number (auto),
//      name:      string  (e.g. '2026-03-05 14:32'),
//      createdAt: number  (Date.now()),
//      items: [
//          // Closed pack
//          { type: 'pack', definitionName: 'Classic Booster', set: 'Azeroth',
//            artID: 'AzerothBooster1', cards: [...] },
//          // Closed box
//          { type: 'box', definitionName: 'Starter Deck', set: 'Azeroth',
//            artID: 'AzerothBigBox', cardContents: [...], otherContents: [...] },
//          // Card pile (from any opened pack or box)
//          { type: 'cardPile', cards: [...] },
//      ]
//  }
// ─────────────────────────────────────────────────────────────

let db;

// ── initStorage ───────────────────────────────────────────────
// Sets up the Dexie database. Call once on page load before
// any other storage functions.

function initStorage() {
    db = new Dexie('WarcraftPackGenerator');

    db.version(1).stores({
        // Only index id, name, createdAt — items blob is not indexed
        bundles: '++id, name, createdAt',
    });

    console.log('[storage] IndexedDB initialised.');
    return db.open().catch(err => {
        console.error('[storage] Failed to open database:', err);
    });
}


// ── saveBundle ────────────────────────────────────────────────
// Snapshots the current rendered items into a bundle.
// If id is provided, overwrites that bundle in place.
// If id is omitted, creates a new bundle.
//
// items    — array of item snapshots (built by snapshotItems in render.js)
// id       — optional existing bundle id to overwrite

async function saveBundle(items, id = null, nameOverride = null, createdAtOverride = null) {
    const now = new Date();
    const name = nameOverride ?? now.toLocaleString('en-GB', {
        year:   'numeric', month:  '2-digit', day:    '2-digit',
        hour:   '2-digit', minute: '2-digit',
    }).replace(',', '');

    const bundle = {
        name,
        createdAt: createdAtOverride ?? now.getTime(),
        items,
    };

    if (id !== null) {
        const existing = await db.bundles.get(id);
        bundle.id        = id;
        bundle.name      = nameOverride ?? existing?.name      ?? bundle.name;
        bundle.createdAt = createdAtOverride ?? existing?.createdAt ?? bundle.createdAt;
        await db.bundles.put(bundle);
        console.log(`[storage] Bundle #${id} overwritten.`);
        return id;
    } else {
        const newId = await db.bundles.add(bundle);
        console.log(`[storage] Bundle #${newId} created.`);
        return newId;
    }
}


// ── loadBundle ────────────────────────────────────────────────
// Returns the full bundle object including items array.

async function loadBundle(id) {
    const bundle = await db.bundles.get(id);
    if (!bundle) {
        console.warn(`[storage] Bundle #${id} not found.`);
        return null;
    }
    console.log(`[storage] Loaded bundle #${id} — ${bundle.items.length} item(s).`);
    return bundle;
}


// ── getAllBundles ─────────────────────────────────────────────
// Returns all bundles sorted newest-first.
// Returns full bundle objects including items, so the sidebar
// can show contents on hover without a separate fetch.

async function getAllBundles() {
    const bundles = await db.bundles.orderBy('createdAt').reverse().toArray();
    console.log(`[storage] Found ${bundles.length} bundle(s).`);
    return bundles;
}


// ── deleteBundle ──────────────────────────────────────────────

async function deleteBundle(id) {
    await db.bundles.delete(id);
    console.log(`[storage] Bundle #${id} deleted.`);
}


// ── duplicateBundle ───────────────────────────────────────────
// Clones an existing bundle with a fresh id and timestamp.
// Returns the new bundle's id.

async function duplicateBundle(id) {
    const original = await loadBundle(id);
    if (!original) return null;

    // saveBundle without an id always creates new
    const newId = await saveBundle(original.items);
    console.log(`[storage] Bundle #${id} duplicated as #${newId}.`);
    return newId;
}


// ── exportBundleJSON ──────────────────────────────────────────
// Serialises the bundle to JSON and triggers a file download.

async function exportBundleJSON(id) {
    const bundle = await loadBundle(id);
    if (!bundle) return;

    const json     = JSON.stringify(bundle, null, 2);
    const blob     = new Blob([json], { type: 'application/json' });
    const url      = URL.createObjectURL(blob);
    const filename = `bundle-${bundle.name.replace(/[/:, ]/g, '-')}.json`;

    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();

    // Clean up the object URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log(`[storage] Bundle #${id} exported as ${filename}.`);
}


// ── importBundleJSON ──────────────────────────────────────────
// Reads a .json file (from an <input type="file"> change event)
// and saves it as a new bundle. Returns the new bundle's id.
//
// Usage:
//   fileInput.addEventListener('change', async e => {
//       const id = await importBundleJSON(e.target.files[0]);
//   });

async function importBundleJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async e => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.items || !Array.isArray(data.items)) {
                    throw new Error('Invalid bundle file — missing items array.');
                }

                // Always import as a brand new bundle, ignoring original id
                const newId = await saveBundle(data.items, null, data.name, data.createdAt);
                console.log(`[storage] Imported bundle as #${newId}.`);
                resolve(newId);
            } catch (err) {
                console.error('[storage] Import failed:', err);
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
    });
}
