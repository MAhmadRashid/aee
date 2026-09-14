const fs = require('fs');

try {
    let content = fs.readFileSync('./src/data/perfumes.ts', 'utf8');
    const exportStr = "export const perfumes = ";
    const startIndex = content.indexOf(exportStr);
    
    if (startIndex !== -1) {
        let jsonStr = content.substring(startIndex + exportStr.length).trim();
        if(jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
        
        let perfumes = eval(jsonStr);
        
        let dbPath = './local-database.json';
        let db = {};
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
        
        if(!db.products) db.products = [];
        
        let currentProducts = db.products;
        let newProductsMap = new Map(perfumes.map(p => [p.id, p]));
        
        for(let i=0; i<currentProducts.length; i++){
            if(newProductsMap.has(currentProducts[i].id)){
                currentProducts[i] = Object.assign({}, currentProducts[i], newProductsMap.get(currentProducts[i].id));
                newProductsMap.delete(currentProducts[i].id);
            }
        }
        
        newProductsMap.forEach(p => {
            currentProducts.push(p);
        });
        
        db.products = currentProducts;
        
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        console.log("Local database synced successfully! All frontend changes are now in the backend DB.");
    }
} catch(e) {
    console.log("Error syncing: ", e);
}
