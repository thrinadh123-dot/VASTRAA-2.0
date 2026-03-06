import https from 'https';
import fs from 'fs';

https.get('https://unsplash.com', (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        const match = body.match(/"clientId":"([^"]+)"/);
        if (!match) {
            console.log("No client id found");
            return;
        }
        const clientId = match[1];

        const fetchPhotos = (query, limit) => {
            return new Promise((resolve) => {
                https.get(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=${limit}`, {
                    headers: { 'Authorization': `Client-ID ${clientId}` }
                }, (res2) => {
                    let body2 = '';
                    res2.on('data', chunk => body2 += chunk);
                    res2.on('end', () => {
                        const data = JSON.parse(body2);
                        resolve(data.results.map(r => r.id));
                    });
                });
            });
        };

        Promise.all([
            fetchPhotos('womens fashion', 30),
            fetchPhotos('womens apparel', 30),
            fetchPhotos('kids clothing', 30),
            fetchPhotos('childrens apparel', 30)
        ]).then(results => {
            const womenIds = [...new Set([...results[0], ...results[1]])];
            const kidsIds = [...new Set([...results[2], ...results[3]])];

            fs.writeFileSync('unsplash_ids.json', JSON.stringify({ womenIds, kidsIds }, null, 2));
            console.log(`Saved unsplash_ids.json with ${womenIds.length} women and ${kidsIds.length} kids ids`);
        });
    });
});
