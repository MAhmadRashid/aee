import fs from 'fs';
import path from 'path';
import { perfumes } from '@/data/perfumes';

const dbPath = path.join(process.cwd(), 'local-database.json');

// Initialize DB if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ products: [], users: [], orders: [] }, null, 2));
  }
};

export const getDbData = () => {
  initDb();
  const raw = fs.readFileSync(dbPath, 'utf8');
  let data = JSON.parse(raw);
  
  // Auto-Sync Logic: Always ensure the JSON database has the absolute latest
  // product data from the mock file (catching name changes, price updates, etc).
  data.products = perfumes;
  saveDbData(data);
  
  return data;
};

export const saveDbData = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};
