import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dbPath = path.join(process.cwd(), 'server', 'data', 'db.json');

export const readDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      // Create empty db structures if file does not exist
      const defaultDb = { products: [], orders: [], coupons: [], settings: {} };
      fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from JSON database:', error);
    return { products: [], orders: [], coupons: [], settings: {} };
  }
};

export const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to JSON database:', error);
    return false;
  }
};
