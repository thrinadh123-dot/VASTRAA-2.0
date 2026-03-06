const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const usedUrls = new Set();

const menContent = fs.readFileSync(path.join(dataDir, 'menProducts.ts'), 'utf8');
const urlRegex = /(https:\/\/[^\s'"]+)/g;

let match;
while ((match = urlRegex.exec(menContent)) !== null) {
    usedUrls.add(match[1].split('?')[0]);
}

let loremIndex = 1;

const replaceDuplicates = (file, keyword) => {
    let content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    let count = 0;

    // Refresh the regex for the incoming string
    const localUrlRegex = /(https:\/\/[^\s'"]+)/g;

    content = content.replace(localUrlRegex, (fullMatch, url) => {
        const base = url.split('?')[0];
        if (usedUrls.has(base) || url.includes('loremflickr')) {
            // Replace any remaining duplicates with a visually distinct targeted loremflickr
            const newUrl = `https://loremflickr.com/800/1000/${keyword},fashion?random=${loremIndex++}`;
            count++;
            usedUrls.add(newUrl);
            return newUrl;
        }
        usedUrls.add(base);
        return fullMatch;
    });

    fs.writeFileSync(path.join(dataDir, file), content);
    return count;
};

// First run women, then kids
const wCount = replaceDuplicates('womenProducts.ts', 'womens');
const kCount = replaceDuplicates('kidsProducts.ts', 'kids');

console.log(`Replaced remaining ${wCount} duplicates in Women's and ${kCount} duplicates in Kids using unique LoremFlickr generators.`);
