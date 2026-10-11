const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageBaseDir = path.join(__dirname, '../image');

async function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const res = await processDirectory(fullPath);
            totalOriginal += res.totalOriginal;
            totalOptimized += res.totalOptimized;
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const stat = fs.statSync(fullPath);
                totalOriginal += stat.size;

                const webpFileName = entry.name.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
                const webpPath = path.join(dir, webpFileName);

                try {
                    let transformer = sharp(fullPath);
                    const metadata = await transformer.metadata();

                    // Resize if excessively large (e.g. photos > 1600px wide)
                    if (metadata.width && metadata.width > 1600) {
                        transformer = transformer.resize({ width: 1600, withoutEnlargement: true });
                    }

                    // Convert to WebP with balanced high quality and high compression
                    await transformer
                        .webp({ quality: 82, effort: 6 })
                        .toFile(webpPath);

                    const webpStat = fs.statSync(webpPath);
                    totalOptimized += webpStat.size;

                    const savedPct = (((stat.size - webpStat.size) / stat.size) * 100).toFixed(1);
                    console.log(`✓ ${path.relative(imageBaseDir, fullPath)}: ${(stat.size / 1024).toFixed(1)} KB -> ${(webpStat.size / 1024).toFixed(1)} KB (-${savedPct}%)`);
                } catch (err) {
                    console.error(`Error processing ${entry.name}:`, err.message);
                    totalOptimized += stat.size;
                }
            } else if (ext === '.webp') {
                const stat = fs.statSync(fullPath);
                totalOptimized += stat.size;
            }
        }
    }
    return { totalOriginal, totalOptimized };
}

(async () => {
    console.log('--- Memulai Kompresi dan Konversi WebP ---');
    const { totalOriginal, totalOptimized } = await processDirectory(imageBaseDir);
    const savedTotal = totalOriginal - totalOptimized;
    console.log('==========================================');
    console.log(`Ukuran Asli    : ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Ukuran WebP    : ${(totalOptimized / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Penghematan    : ${(savedTotal / (1024 * 1024)).toFixed(2)} MB (${((savedTotal / totalOriginal) * 100).toFixed(1)}% LEBIH RINGAN!)`);
    console.log('==========================================');
})();
