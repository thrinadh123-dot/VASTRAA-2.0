const fs = require('fs');
const files = ['src/data/menProducts.ts', 'src/data/womenProducts.ts', 'src/data/kidsProducts.ts'];
files.forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    const subs = {};
    const re = /subcategory:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(c))) subs[m[1]] = (subs[m[1]] || 0) + 1;
    const total = Object.values(subs).reduce((a, b) => a + b, 0);
    console.log(`\n${f} (${total} total):`);
    Object.entries(subs).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
});
