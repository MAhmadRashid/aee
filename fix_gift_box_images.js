const fs = require('fs');

try {
    let content = fs.readFileSync('./src/data/perfumes.ts', 'utf8');
    const exportStr = "export const perfumes = ";
    const startIndex = content.indexOf(exportStr);
    
    if (startIndex !== -1) {
        let jsonStr = content.substring(startIndex + exportStr.length).trim();
        if(jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
        
        let perfumes = eval(jsonStr);
        let updatedCount = 0;
        
        // Map products to their local high-quality images
        const imageMapping = {
            "Aurora Forest": "/images/gift_green_box.jpg",
            "Emerald Wood": "/images/gift_green_box_1788335581533.jpg",
            "Crystal Breeze": "/images/gift_blue_box.jpg",
            "Cool Breeze Duo": "/images/gift_blue_box_1788335469264.jpg",
            "CEO Bundle - For Him": "/images/gift_grey_box.jpg",
            "Floral Duo": "/images/gift_red_box.jpg",
            "Crystal Vanilla": "/images/gift_purple_box.jpg"
        };
        
        for (let p of perfumes) {
            if (p.category === 'Gift Box' || p.category === 'Gifting') {
                if (imageMapping[p.name]) {
                    p.image = imageMapping[p.name];
                    p.image_url = imageMapping[p.name];
                    updatedCount++;
                }
            }
        }
        
        let newContent = content.substring(0, startIndex + exportStr.length) + JSON.stringify(perfumes, null, 2) + ';\n';
        fs.writeFileSync('./src/data/perfumes.ts', newContent, 'utf8');
        console.log(`Updated images for ${updatedCount} Gift Boxes to use high-quality local images.`);
    }
} catch(e) {
    console.log("Error updating gift box images: ", e);
}
