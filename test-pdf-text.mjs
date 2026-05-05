import pdfjsDist from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';

async function run() {
  const data = new Uint8Array(fs.readFileSync('./nrf.pdf'));
  const doc = await pdfjsDist.getDocument({ data }).promise;
  
  for (const pageNum of [4, 6, 29, 31]) {
     const page = await doc.getPage(pageNum);
     const textContent = await page.getTextContent();
     const text = textContent.items.map(s => s.str).join(' ');
     console.log(`\n--- PHYSICAL PAGE ${pageNum} TEXT ---`);
     console.log(text.substring(0, 200));
  }
}
run().catch(console.error);
