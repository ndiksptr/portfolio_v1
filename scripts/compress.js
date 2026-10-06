const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../image/penelitian_tdsm');

if (!fs.existsSync(targetDir)) {
    console.log(`Directory ${targetDir} does not exist. Skipping compression.`);
    process.exit(0);
}

fs.readdir(targetDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(targetDir, file);
        const ext = path.extname(file).toLowerCase();

        // Process only image files
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const outputFileName = file.replace(ext, '.webp');
            const outputPath = path.join(targetDir, `compressed_${outputFileName}`);

            sharp(filePath)
                .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200px
                .webp({ quality: 80 }) // Adjust quality to hit ~250kb depending on image
                .toFile(outputPath)
                .then(info => {
                    console.log(`Compressed: ${file} -> ${outputFileName} (${(info.size / 1024).toFixed(2)} KB)`);
                    
                    // Rename compressed file to original name (with webp extension)
                    // and backup original
                    const backupPath = path.join(targetDir, `orig_${file}`);
                    fs.renameSync(filePath, backupPath);
                    fs.renameSync(outputPath, path.join(targetDir, outputFileName));
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});
