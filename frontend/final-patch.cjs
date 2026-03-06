// Final targeted patch: fixes the last 7 duplicates with fresh unique Unsplash photo IDs
// (after wmn-048 was already manually patched to 1530577197743)
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, 'src', 'data');
const Q = 'w=800&auto=format&fit=crop&q=80';

// productId -> fresh Unsplash photo Id (hand-picked, not in catalog)
const finalFixes = {
    'wmn-021': '1520975661278-20b24a55bbde',   // women leather biker jacket
    'kid-014': '1516762689069-e5bfd704e5ad',    // kids sun dress
    'kid-023': '1553062407-98eeb64c6a62',       // keep but kid-024 gets new:
    'kid-024': '1555274175-6cbf6f3b137b',       // kids canvas daypack
    'kid-026': '1491553895911-0055eca6402d',    // kids planet pajamas
    'kid-034': '1529374255404-65d395b0a203',    // kids trucker cap
    'kid-035': '1543327889-c2dbf14f87c5',       // kids bucket hat
    'kid-036': '1605924698891-9b9b02d5f3ef',    // kids beanie
    'kid-038': '1536766768-f618d0c1add5',       // kids party dress sequin
    'kid-044': '1519328572-9d6dadb9bbda',       // kids mary janes
    'kid-050': '1600181957996-937462f0a3a8',    // kids chelsea boots
};

['womenProducts.ts', 'kidsProducts.ts'].forEach(file => {
    let content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    let changed = 0;
    Object.entries(finalFixes).forEach(([productId, newPhotoId]) => {
        const idKey = `'${productId}'`;
        if (!content.includes(idKey)) return;
        const idIndex = content.indexOf(`id: ${idKey}`);
        if (idIndex === -1) return;
        const imagesStart = content.indexOf(`images: ['https://`, idIndex);
        if (imagesStart === -1) return;
        const urlStart = imagesStart + 10;
        const urlEnd = content.indexOf(`'`, urlStart + 1);
        if (urlEnd === -1) return;
        const newUrl = `https://images.unsplash.com/photo-${newPhotoId}?${Q}`;
        content = content.substring(0, urlStart) + newUrl + content.substring(urlEnd);
        changed++;
    });
    fs.writeFileSync(path.join(dataDir, file), content);
    console.log(`Final patched ${changed} in ${file}`);
});
