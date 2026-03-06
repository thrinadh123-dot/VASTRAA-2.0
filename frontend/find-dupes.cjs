const fs = require('fs');
const files = ['src/data/menProducts.ts', 'src/data/womenProducts.ts', 'src/data/kidsProducts.ts'];
const allUrls = [];
files.forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    const re = /images:\s*\['([^']+)'\]/g;
    let m;
    while ((m = re.exec(c))) allUrls.push({ file: f, url: m[1] });
});
const urlMap = {};
allUrls.forEach(({ file, url }) => {
    if (!urlMap[url]) urlMap[url] = [];
    urlMap[url].push(file);
});
Object.entries(urlMap).filter(([_, files]) => files.length > 1).forEach(([url, files]) => {
    console.log(`DUPLICATE: ${url}`);
    files.forEach(f => console.log(`  in: ${f}`));
});
