import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'assets', 'images');

async function optimizeImages() {
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

    console.log(`Found ${imageFiles.length} images to optimize...`);

    for (const file of imageFiles) {
        const filePath = path.join(inputDir, file);
        try {
            const metadata = await sharp(filePath).metadata();
            
            // Skip if already small enough (e.g. width < 2000 and size < 500kb - roughly)
            // But checking size usually requires fs.stat
            const stats = fs.statSync(filePath);
            if (stats.size < 500 * 1024) {
                 console.log(`Skipping ${file} (already small: ${(stats.size/1024).toFixed(2)} KB)`);
                 continue;
            }

            console.log(`Optimizing ${file} (${metadata.width}x${metadata.height}, ${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

            // Resize logic
            let pipeline = sharp(filePath);
            
            // If width > 2000, resize to 2000 width, keeping aspect ratio
            if (metadata.width > 2000) {
                pipeline = pipeline.resize({ width: 2000 });
            }

            // Compress
            if (file.toLowerCase().endsWith('.png')) {
                pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
            } else {
                pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
            }

            const buffer = await pipeline.toBuffer();
            fs.writeFileSync(filePath, buffer);
            
            const newStats = fs.statSync(filePath);
            console.log(`Saved ${file} -> ${(newStats.size / 1024).toFixed(2)} KB`);

        } catch (err) {
            console.error(`Error optimizing ${file}:`, err);
        }
    }
    console.log('Optimization complete!');
}

optimizeImages();
