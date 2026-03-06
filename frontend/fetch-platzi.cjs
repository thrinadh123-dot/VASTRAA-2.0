const https = require('https');
const fs = require('fs');
const path = require('path');

async function run() {
    console.log('Fetching from Platzi...');
    https.get('https://api.escuelajs.co/api/v1/products?limit=100&categoryId=1', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            try {
                const data = JSON.parse(body);
                let allImages = [];
                data.forEach(p => {
                    if (p.images && p.images.length > 0) {
                        let imgStr = p.images[0];
                        // Clean up Platzi's weird array-string format: "[\"https://...\"]"
                        imgStr = imgStr.replace(/[\[\]]/g, '').replace(/"/g, '');
                        if (imgStr.startsWith('http')) {
                            allImages.push(imgStr);
                        }
                    }
                });

                allImages = [...new Set(allImages)];
                console.log(`Found ${allImages.length} real fashion images.`);

                const dataDir = path.join(__dirname, 'src', 'data');
                const usedUrls = new Set();

                const menContent = fs.readFileSync(path.join(dataDir, 'menProducts.ts'), 'utf8');
                const urlRegex = /(https:\/\/[^\s'"]+)/g;

                let match;
                while ((match = urlRegex.exec(menContent)) !== null) {
                    usedUrls.add(match[1].split('?')[0]);
                }

                let imgIndex = 0;
                const getNextImg = () => {
                    while (imgIndex < allImages.length) {
                        const nextUrl = allImages[imgIndex++];
                        if (!usedUrls.has(nextUrl)) return nextUrl;
                    }
                    return null;
                };

                const replaceDuplicates = (file) => {
                    let content = fs.readFileSync(path.join(dataDir, file), 'utf8');
                    let count = 0;
                    content = content.replace(urlRegex, (fullMatch, url) => {
                        const base = url.split('?')[0];
                        if (usedUrls.has(base)) {
                            const nextUrl = getNextImg();
                            if (nextUrl) {
                                count++;
                                usedUrls.add(nextUrl);
                                return nextUrl;
                            }
                        }
                        usedUrls.add(base);
                        return fullMatch;
                    });
                    fs.writeFileSync(path.join(dataDir, file), content);
                    return count;
                };

                const wCount = replaceDuplicates('womenProducts.ts');
                const kCount = replaceDuplicates('kidsProducts.ts');

                console.log(`Replaced ${wCount} duplicates in Women's and ${kCount} duplicates in Kids.`);
            } catch (e) {
                console.error('Error parsing or replacing:', e);
            }
        });
    });
}

run();
