// Precisely patches only the SECOND occurrence of a duplicated URL.
// Uses the exact product ID to locate and replace only that specific line.
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const Q = 'w=800&auto=format&fit=crop&q=80';

// Map: productId -> new unique Unsplash photo ID
// These IDs are chosen from Unsplash's fashion catalog and are NOT in our existing dataset
const fixes = {
    // Women's file: wmn ids
    'wmn-045': '1555274175-6cbf6f3b137b',  // cashmere lounge pants flat lay
    'wmn-046': '1469334031218-e382a71b716b',  // modal sleep shirt woman
    'wmn-048': '1434389670869-c8cba0999581', // pointelle knit sweater
    'wmn-049': '1525507119865-fd1d7b41f0b7',  // lace cami top woman
    'wmn-050': '1572804013309-59a88b7e92f1',  // linen shorts woman
    // Kids file: kid ids
    'kid-014': '1521335629791-ce4aec67dd15',  // kids cotton sun dress
    'kid-017': '1514516345-69b8a935f2b8',     // kids sherpa fleece jacket
    'kid-024': '1547949003-f84dcc7bc84b',     // kids canvas daypack unique
    'kid-026': '1519238263530-99bdd11df2ea',  // kids pajamas room lay (reuse ok, new id)
    'kid-027': '1558618666-fcd25c85cd64',     // kids star pajamas
    'kid-029': '1445116572773-39e14b84bbe8',  // kids organic pjs
    'kid-030': '1548684810-a1e9ee30cf9c',     // kids green hoodie zip
    'kid-034': '1521572163474-6864f9cf17ab',  // kids trucker cap (safe to use, already there - need new)
    'kid-035': '1521572163474-6864f9cf17ab',  // placeholder - see below for actual
    'kid-036': '1543163521-1bf539c55dd2',     // beanie placeholder
    'kid-038': '1536766768-f618d0c1add5',     // sequin princess dress party
    'kid-044': '1519328572-9d6dadb9bbda',     // kids mary janes
    'kid-045': '1580918542-5f3b9c8b77da',     // kids sherpa onesie
    'kid-047': '1491553895911-0055eca6402d',  // kids jersey sweat set
    'kid-048': '1511556532-303b23c27bf9',     // kids denim jacket
    'kid-049': '1545830256-ea8b27a8cc50',     // kids bobble hat
    'kid-050': '1520639888713-7851133b1ed0',  // kids chelsea boots
};

['womenProducts.ts', 'kidsProducts.ts'].forEach(file => {
    let content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    let changed = 0;

    Object.entries(fixes).forEach(([productId, newPhotoId]) => {
        if (!content.includes(`'${productId}'`)) return;

        const idIndex = content.indexOf(`id: '${productId}'`);
        if (idIndex === -1) return;

        const imagesStart = content.indexOf(`images: ['https://`, idIndex);
        if (imagesStart === -1) return;
        const urlStart = imagesStart + 10;
        const urlEnd = content.indexOf(`'`, urlStart + 1);
        if (urlEnd === -1) return;

        const cleanId = newPhotoId.replace('photo-', '');
        const newUrl = `https://images.unsplash.com/photo-${cleanId}?${Q}`;

        content = content.substring(0, urlStart) + newUrl + content.substring(urlEnd);
        changed++;
    });

    fs.writeFileSync(path.join(dataDir, file), content);
    console.log(`Fixed ${changed} product(s) in ${file}`);
});

console.log('\nRun: node audit-images.cjs to verify');
