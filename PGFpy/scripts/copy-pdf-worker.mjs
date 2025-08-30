import fs from 'fs';
import path from 'path';

const source = path.resolve(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.min.js');
const destination = path.resolve(process.cwd(), 'public/pdf.worker.min.js');

try {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destination);
    console.log('✅ Copied pdf.worker.min.js to public directory.');
  } else {
    // Attempt to resolve the path differently if the first fails
    const alternativeSource = require.resolve('pdfjs-dist/build/pdf.worker.min.js');
    fs.copyFileSync(alternativeSource, destination);
    console.log('✅ Copied pdf.worker.min.js from resolved path to public directory.');
  }
} catch (error) {
    console.error('❌ Could not copy pdf.worker.min.js.');
    console.error('Please ensure pdfjs-dist is installed correctly.');
    process.exit(1);
}
