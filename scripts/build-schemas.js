import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const startTime = performance.now();

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_SRC_DIR = path.resolve(__dirname, '../src/schemas');
const THEME_PATH = process.env.SHOPIFY_THEME_PATH;

if (!THEME_PATH) {
  process.exit(1);
}

const CONFIG_DIR = path.resolve(THEME_PATH, 'config');
const SETTINGS_SCHEMA_PATH = path.join(CONFIG_DIR, 'settings_schema.json');

let currentSchema = [];
if (fs.existsSync(SETTINGS_SCHEMA_PATH)) {
  try {
    const content = fs.readFileSync(SETTINGS_SCHEMA_PATH, 'utf8');
    currentSchema = JSON.parse(content);
    if (!Array.isArray(currentSchema)) currentSchema = [];
  } catch (e) {
    currentSchema = [];
  }
}

if (!fs.existsSync(SETTINGS_SRC_DIR)) {
  fs.mkdirSync(SETTINGS_SRC_DIR, { recursive: true });
}

const fragmentFiles = fs.readdirSync(SETTINGS_SRC_DIR).filter(f => f.endsWith('.json'));

fragmentFiles.forEach(file => {
  const filePath = path.join(SETTINGS_SRC_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const fragments = JSON.parse(content);
    const fragmentsArray = Array.isArray(fragments) ? fragments : [fragments];

    fragmentsArray.forEach(newBlock => {
      if (!newBlock.name) return;

      const existingIndex = currentSchema.findIndex(item => item.name === newBlock.name);
      if (existingIndex > -1) {
        currentSchema[existingIndex] = newBlock;
      } else {
        currentSchema.push(newBlock);
      }
    });
  } catch (e) {}
});

if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

fs.writeFileSync(SETTINGS_SCHEMA_PATH, JSON.stringify(currentSchema, null, 2), 'utf8');

const endTime = performance.now();
const timeTaken = Math.round(endTime - startTime);

console.log(`\x1b[32m✓ schemas builded in ${timeTaken}ms\x1b[0m`);