import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync } from 'fs';

async function checkPdf() {
  const data = new Uint8Array(readFileSync('c:/Users/fkore/OneDrive/바탕 화면/AntiTest/VibeProject/Flipbook Maker/nrf.pdf'));
  try {
    const loadingTask = getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log('Total pages:', pdf.numPages);
  } catch (error) {
    console.error('Error reading PDF:', error);
  }
}

checkPdf();
