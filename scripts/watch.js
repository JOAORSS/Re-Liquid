import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src/components');

let debounceTimer;

console.log('\x1b[36mObservando alteracoes em src/components...\x1b[0m\n');

fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;

const normalizedFilename = filename.replace(/\\/g, '/');
  const ext = path.extname(normalizedFilename);
  
  if (!['.tsx', '.ts', '.css', '.json'].includes(ext)) return;
  if (normalizedFilename.endsWith('.types.ts')) return;

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const componentName = normalizedFilename.split('/')[0];

    if (!componentName || componentName === normalizedFilename) return;

    console.log(`\n\x1b[33mAlteracao detectada: ${normalizedFilename}\x1b[0m`);
    console.log(`\x1b[36mReconstruindo ilha: ${componentName}...\x1b[0m`);

    try {
      execSync(`npm run build -- ${componentName}`, { stdio: 'inherit' });
      console.log('\x1b[36mAguardando novas alteracoes...\x1b[0m\n');
    } catch (error) {
      console.error(`\x1b[31mFalha ao compilar ${componentName}. Corrija o erro e salve novamente.\x1b[0m`);
    }
  }, 300);
});