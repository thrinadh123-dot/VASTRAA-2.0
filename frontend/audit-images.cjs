const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const files = ['menProducts.ts', 'womenProducts.ts', 'kidsProducts.ts'];
const urlRegex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_-]+\?[^\s'"]+/g;

const seen = new Map(); // url -> file+id
const duplicates = [];
let totalProducts = 0;

files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    // Find IDs too
    const idMatches = [...content.matchAll(/id:\s*'([^']+)'/g)];
    const urlMatches = [...content.matchAll(new RegExp(urlRegex.source, 'g'))];

    totalProducts += idMatches.length;

    urlMatches.forEach((m, i) => {
        const base = m[0].split('?')[0];
        const idMatch = idMatches[i];
        const productId = idMatch ? idMatch[1] : `unknown-${i}`;

        if (seen.has(base)) {
            duplicates.push({
                url: base,
                first: seen.get(base),
                second: `${file}:${productId}`
            });
        } else {
            seen.set(base, `${file}:${productId}`);
        }
    });
});

console.log(`\n✅ Total Products: ${totalProducts}`);
console.log(`✅ Unique Image URLs: ${seen.size}`);
console.log(`${duplicates.length === 0 ? '✅' : '❌'} Duplicate URLs Found: ${duplicates.length}`);

if (duplicates.length > 0) {
    console.log('\nDUPLICATES:');
    duplicates.forEach(d => {
        console.log(`  URL: ${d.url}`);
        console.log(`    First Used: ${d.first}`);
        console.log(`    Reused In:  ${d.second}\n`);
    });
} else {
    console.log('\n🎉 Zero duplicates. Every product has a unique image URL.');
}
