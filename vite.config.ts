import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const componentsDir = path.resolve(__dirname, 'src/components');
const componentFolders = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const inputs: Record<string, string> = {};

componentFolders.forEach(folder => {
  const folderPath = path.join(componentsDir, folder);
  const files = fs.readdirSync(folderPath);
  const tsxFile = files.find(f => f.endsWith('.tsx'));
  
  if (tsxFile) {
    const entryName = tsxFile.replace('.tsx', '');
    inputs[entryName] = path.resolve(folderPath, tsxFile);
  }
});

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    rollupOptions: {
      input: inputs,
      external: ['react', 'react-dom'],
      output: {
        format: 'iife',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});