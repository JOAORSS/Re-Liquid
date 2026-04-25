import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import linaria from '@linaria/vite';
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
  plugins: [
    linaria({
      include: ['**/*.{ts,tsx,jsx,js}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    react({ jsxRuntime: 'classic' })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    cssCodeSplit: true,
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