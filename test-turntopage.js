// Test script to verify turnToPage behavior with showCover=true
// Run with: node test-turntopage.js

const fs = require('fs');
const path = require('path');

// Read metadata
const metaPath = path.join(__dirname, 'data/books/book_1777947974579/metadata.json');
const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

console.log('=== Page Navigation Analysis ===');
console.log(`Total pages: ${metadata.totalPages}`);
console.log('');

// Simulate react-pageflip spread creation with showCover=true
const spreads = [];
// Cover page alone
spreads.push([0]);
// Rest in pairs
for (let i = 1; i < metadata.totalPages; i += 2) {
    if (i < metadata.totalPages - 1) {
        spreads.push([i, i + 1]);
    } else {
        spreads.push([i]);
    }
}

console.log('First 10 spreads:');
for (let i = 0; i < 10; i++) {
    console.log(`  Spread ${i}: pages [${spreads[i].join(', ')}]`);
}
console.log('...');

// getSpreadIndexByPage simulation
function getSpreadIndexByPage(pageNum) {
    for (let i = 0; i < spreads.length; i++) {
        if (pageNum === spreads[i][0] || pageNum === spreads[i][1]) return i;
    }
    return null;
}

// show() simulation - returns what currentPageIndex would be set to
function simulateShow(pageNum) {
    const spreadIndex = getSpreadIndexByPage(pageNum);
    if (spreadIndex !== null) {
        const spread = spreads[spreadIndex];
        return { spreadIndex, leftPage: spread[0], currentPageIndex: spread[0] };
    }
    return null;
}

console.log('');
console.log('=== Test Cases (User Reports) ===');
console.log('');

// Case 1: "Go to page 6" links (on content pages like page 14)
// In metadata: destPage = 6 (0-based)
// Old code tooltip: "Go to page 6" (shows destPage directly)
// New code tooltip: "Go to page 7" (shows destPage + 1)
// Old code onClick: onJump(6 - 1) = turnToPage(5)
// New code onClick: onJump(6) = turnToPage(6)

console.log('--- Case: "Go to page 6" link on content pages ---');
console.log('  metadata destPage = 6 (0-based)');
console.log('');

// With OLD code: turnToPage(5)
let result5 = simulateShow(5);
console.log(`  OLD code: turnToPage(5)`);
console.log(`    → spreadIndex=${result5.spreadIndex}, spread=[${spreads[result5.spreadIndex].join(',')}]`);
console.log(`    → currentPageIndex=${result5.currentPageIndex}, counter shows: Page ${result5.currentPageIndex + 1}`);

// With NEW code: turnToPage(6)
let result6 = simulateShow(6);
console.log(`  NEW code: turnToPage(6)`);
console.log(`    → spreadIndex=${result6.spreadIndex}, spread=[${spreads[result6.spreadIndex].join(',')}]`);
console.log(`    → currentPageIndex=${result6.currentPageIndex}, counter shows: Page ${result6.currentPageIndex + 1}`);

console.log('');

// Case 2: "Go to page 62" from TOC
// Find a link in TOC pages (pages 5-10) with destPage around 61
const tocPages = [5, 6, 7, 8, 9, 10];
let found62 = null;
for (const pi of tocPages) {
    const pg = metadata.pages[pi];
    if (pg && pg.links) {
        for (const link of pg.links) {
            if (link.destPage === 61) { // destPage=61 → old tooltip "Go to page 61", new tooltip "Go to page 62"
                found62 = { pageIndex: pi, destPage: link.destPage };
                break;
            }
        }
    }
    if (found62) break;
}

console.log('--- Case: TOC link to page around 62 ---');
if (found62) {
    console.log(`  Found on page[${found62.pageIndex}]: destPage=${found62.destPage}`);
    const resultOld = simulateShow(found62.destPage - 1);
    const resultNew = simulateShow(found62.destPage);
    console.log(`  OLD code tooltip: "Go to page ${found62.destPage}", turnToPage(${found62.destPage - 1})`);
    console.log(`    → counter shows: Page ${resultOld.currentPageIndex + 1}`);
    console.log(`  NEW code tooltip: "Go to page ${found62.destPage + 1}", turnToPage(${found62.destPage})`);
    console.log(`    → counter shows: Page ${resultNew.currentPageIndex + 1}`);
} else {
    // Try to find destPage=62 (could be stored as 1-based)
    console.log('  No exact destPage=61 found, checking destPage values near 62...');
    for (const pi of tocPages) {
        const pg = metadata.pages[pi];
        if (pg && pg.links) {
            for (const link of pg.links) {
                if (link.destPage >= 60 && link.destPage <= 64) {
                    const result = simulateShow(link.destPage);
                    const resultMinus1 = simulateShow(link.destPage - 1);
                    console.log(`  page[${pi}] destPage=${link.destPage}`);
                    console.log(`    OLD code: tooltip="Go to page ${link.destPage}", turnToPage(${link.destPage - 1}) → counter=${resultMinus1 ? resultMinus1.currentPageIndex + 1 : 'null'}`);
                    console.log(`    NEW code: tooltip="Go to page ${link.destPage + 1}", turnToPage(${link.destPage}) → counter=${result.currentPageIndex + 1}`);
                }
            }
        }
    }
}

console.log('');
console.log('--- Case: Link to page around 173 ---');
for (const pi of tocPages) {
    const pg = metadata.pages[pi];
    if (pg && pg.links) {
        for (const link of pg.links) {
            if (link.destPage >= 171 && link.destPage <= 175) {
                const result = simulateShow(link.destPage);
                const resultMinus1 = simulateShow(link.destPage - 1);
                console.log(`  page[${pi}] destPage=${link.destPage}`);
                console.log(`    OLD code: tooltip="Go to page ${link.destPage}", turnToPage(${link.destPage - 1}) → counter=${resultMinus1 ? resultMinus1.currentPageIndex + 1 : 'null'}`);
                console.log(`    NEW code: tooltip="Go to page ${link.destPage + 1}", turnToPage(${link.destPage}) → counter=${result.currentPageIndex + 1}`);
            }
        }
    }
}

console.log('');
console.log('=== Physical page 6 (0-based) content verification ===');
console.log(`  Page[5] is spread: [${spreads[getSpreadIndexByPage(5)].join(',')}]`);
console.log(`  Page[6] is spread: [${spreads[getSpreadIndexByPage(6)].join(',')}]`);
console.log('  The TOC page (목차) is at physical index 5 and 6');
console.log('  With showCover=true, these are in spreads:', getSpreadIndexByPage(5), 'and', getSpreadIndexByPage(6));
