// List all photo IDs currently used in the catalog
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const files = ['menProducts.ts', 'womenProducts.ts', 'kidsProducts.ts'];
const urlRegex = /photo-([a-zA-Z0-9_-]+)\?/g;

const usedIds = new Set();
files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    let m;
    while ((m = urlRegex.exec(content)) !== null) {
        usedIds.add(m[1]);
    }
});

// Our candidate replacement IDs for kids chelsea boots – try each until we find one NOT in usedIds
const candidates = [
    '1519257337-29779b8ad9e6', // boots white studio
    '1543163521-1bf539c55dd2', // boots woman
    '1595950653106-6c9ebd614d3a', // loafers woman
    '1568702846914-96b305d2aaeb', // leather shoes formal
    '1464773434670-891ba0a7b2bc', // leather boots  
    '1511556532-303b23c27bf9', // denim jacket – DIFFERENT
];

for (const id of candidates) {
    if (!usedIds.has(id)) {
        console.log('AVAILABLE:', id);
        break;
    } else {
        console.log('USED:', id);
    }
}
console.log('\nAll IDs in catalog:\n', [...usedIds].sort().join('\n'));
