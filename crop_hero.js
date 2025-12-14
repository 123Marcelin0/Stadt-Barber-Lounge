import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'assets', 'images', 'IMG_3535.jpg');
const outputPath = path.join(__dirname, 'assets', 'images', 'hero_cropped.jpg');

async function cropImage() {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // We want to remove the right side where the door is.
        // Let's keep the left 70% of the image.
        const newWidth = Math.floor(metadata.width * 0.75);

        await image
            .extract({ left: 0, top: 0, width: newWidth, height: metadata.height })
            .toFile(outputPath);

        console.log(`Cropped image saved to ${outputPath}`);
    } catch (error) {
        console.error("Error cropping image:", error);
    }
}

cropImage();
