import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';
import jpeg from 'jpeg-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'assets', 'images');
const outputDir = path.join(__dirname, 'assets', 'images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function convertAll() {
    const files = fs.readdirSync(inputDir);
    const heicFiles = files.filter(f => f.toLowerCase().endsWith('.heic'));

    console.log(`Found ${heicFiles.length} HEIC files to convert...`);

    for (const file of heicFiles) {
        try {
            console.log(`Converting ${file}...`);
            const inputBuffer = fs.readFileSync(path.join(inputDir, file));
            const outputBuffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1 // Max quality
            });

            const outName = file.replace(/\.heic$/i, '.jpg');
            fs.writeFileSync(path.join(outputDir, outName), outputBuffer);
            console.log(`Saved ${outName}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }
    console.log('Conversion complete!');
}

convertAll();
