const https = require('https');
const fs = require('fs');
const path = require('path');

const fetchIds = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                // Look for typical 11-character Unsplash photo IDs in the SSR JSON payload
                const regex = /"id":"([a-zA-Z0-9_\-]{11})"/g;
                const ids = [];
                let match;
                while ((match = regex.exec(body)) !== null) {
                    ids.push(match[1]);
                }
                resolve([...new Set(ids)]);
            });
        });
    });
};

async function run() {
    console.log('Fetching fresh fashion IDs...');
    const [womenIds1, womenIds2, kidsIds] = await Promise.all([
        fetchIds('https://unsplash.com/s/photos/women-fashion-minimal'),
        fetchIds('https://unsplash.com/napi/search/photos?query=womens-fashion&per_page=30'), // NAPI might work without auth for some endpoints? Just in case.
        fetchIds('https://unsplash.com/s/photos/kids-clothing-fashion')
    ]);

    const allWomenIds = [...new Set([...womenIds1, ...womenIds2])].filter(id => id.length === 11);
    const allKidsIds = [...new Set([...kidsIds])].filter(id => id.length === 11);

    console.log(`Found ${allWomenIds.length} women IDs and ${allKidsIds.length} kids IDs.`);

    // Load existing files
    const dataDir = path.join(__dirname, 'src', 'data');
    const files = ['menProducts.ts', 'womenProducts.ts', 'kidsProducts.ts'];

    // Track globally used URLs
    const usedUrls = new Set();

    // Read menProducts first to populate used list (we assume men is good)
    const menContent = fs.readFileSync(path.join(dataDir, 'menProducts.ts'), 'utf8');
    let match;
    const urlRegex = /(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_\-]{11}\?[\w=&]+)/g;
    while ((match = urlRegex.exec(menContent)) !== null) {
        usedUrls.add(match[1].split('?')[0]);
    }

    // Processing womenProducts.ts
    let womenContent = fs.readFileSync(path.join(dataDir, 'womenProducts.ts'), 'utf8');
    let wIdIndex = 0;
    womenContent = womenContent.replace(urlRegex, (fullMatch, url) => {
        const base = url.split('?')[0];
        if (usedUrls.has(base)) {
            if (wIdIndex < allWomenIds.length) {
                const newUrl = `https://images.unsplash.com/photo-${allWomenIds[wIdIndex++]}?w=800&auto=format&fit=crop&q=80`;
                usedUrls.add(`https://images.unsplash.com/photo-${allWomenIds[wIdIndex - 1]}`);
                return newUrl;
            }
        }
        usedUrls.add(base);
        return fullMatch; // Keep original
    });
    fs.writeFileSync(path.join(dataDir, 'womenProducts.ts'), womenContent);

    // Processing kidsProducts.ts
    let kidsContent = fs.readFileSync(path.join(dataDir, 'kidsProducts.ts'), 'utf8');
    let kIdIndex = 0;
    kidsContent = kidsContent.replace(urlRegex, (fullMatch, url) => {
        const base = url.split('?')[0];
        if (usedUrls.has(base)) {
            if (kIdIndex < allKidsIds.length) {
                const newUrl = `https://images.unsplash.com/photo-${allKidsIds[kIdIndex++]}?w=800&auto=format&fit=crop&q=80`;
                usedUrls.add(`https://images.unsplash.com/photo-${allKidsIds[kIdIndex - 1]}`);
                return newUrl;
            }
        }
        usedUrls.add(base);
        return fullMatch;
    });
    fs.writeFileSync(path.join(dataDir, 'kidsProducts.ts'), kidsContent);

    console.log(`Replaced ${wIdIndex} duplicates in Women's and ${kIdIndex} duplicates in Kids.`);
}

run();
