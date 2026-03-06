const https = require('https');
const fs = require('fs');
const path = require('path');

const fetchGithub = (url) => {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'NodeJS/18' } }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve(body));
        });
    });
};

async function run() {
    console.log('Fetching from GitHub search...');
    const jsonStr = await fetchGithub('https://api.github.com/search/code?q=images.unsplash.com/photo+language:json&per_page=100');

    try {
        const data = JSON.parse(jsonStr);
        const regex = /photo-([a-zA-Z0-9_\-]{11})/g;
        let allIds = [];

        // We can just regex the entire JSON response string for photo IDs
        let match;
        while ((match = regex.exec(jsonStr)) !== null) {
            allIds.push(match[1]);
        }

        allIds = [...new Set(allIds)];
        console.log(`Found ${allIds.length} unique Unsplash IDs.`);

        // Load existing files
        const dataDir = path.join(__dirname, 'src', 'data');

        // Track globally used URLs
        const usedUrls = new Set();

        const menContent = fs.readFileSync(path.join(dataDir, 'menProducts.ts'), 'utf8');
        const urlRegex = /(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_\-]{11}\?[\w=&]+)/g;
        while ((match = urlRegex.exec(menContent)) !== null) {
            usedUrls.add(match[1].split('?')[0]);
        }

        let idIndex = 0;
        const getNextId = () => {
            while (idIndex < allIds.length) {
                const nextId = allIds[idIndex++];
                const nextBaseUrl = `https://images.unsplash.com/photo-${nextId}`;
                if (!usedUrls.has(nextBaseUrl)) {
                    return nextId;
                }
            }
            return null;
        };

        let womenContent = fs.readFileSync(path.join(dataDir, 'womenProducts.ts'), 'utf8');
        let wCount = 0;
        womenContent = womenContent.replace(urlRegex, (fullMatch, url) => {
            const base = url.split('?')[0];
            if (usedUrls.has(base)) {
                const nextId = getNextId();
                if (nextId) {
                    wCount++;
                    const newUrl = `https://images.unsplash.com/photo-${nextId}?w=800&auto=format&fit=crop&q=80`;
                    usedUrls.add(`https://images.unsplash.com/photo-${nextId}`);
                    return newUrl;
                }
            }
            usedUrls.add(base);
            return fullMatch;
        });
        fs.writeFileSync(path.join(dataDir, 'womenProducts.ts'), womenContent);

        let kidsContent = fs.readFileSync(path.join(dataDir, 'kidsProducts.ts'), 'utf8');
        let kCount = 0;
        kidsContent = kidsContent.replace(urlRegex, (fullMatch, url) => {
            const base = url.split('?')[0];
            if (usedUrls.has(base)) {
                const nextId = getNextId();
                if (nextId) {
                    kCount++;
                    const newUrl = `https://images.unsplash.com/photo-${nextId}?w=800&auto=format&fit=crop&q=80`;
                    usedUrls.add(`https://images.unsplash.com/photo-${nextId}`);
                    return newUrl;
                }
            }
            usedUrls.add(base);
            return fullMatch;
        });
        fs.writeFileSync(path.join(dataDir, 'kidsProducts.ts'), kidsContent);

        console.log(`Replaced ${wCount} duplicates in Women's and ${kCount} duplicates in Kids.`);
    } catch (e) {
        console.error(e);
    }
}

run();
