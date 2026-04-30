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
    const safeName = entryName.replace(/[^a-zA-Z0-9_]/g, '') || 'component';
    inputs[safeName] = path.resolve(folderPath, tsxFile);
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
      external: [
        'react', 
        'react-dom', 
        'react-dom/client', 
        'react/jsx-runtime'
      ],
      output: {
        format: 'iife',
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
          'react/jsx-runtime': 'React'
        },
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.facadeModuleId) {
            const originalName = path.basename(chunkInfo.facadeModuleId, '.tsx');
            return `${originalName}.js`;
          }
          return '[name].js';
        },
        assetFileNames: '[name].[ext]'
      }
    }
  }
});