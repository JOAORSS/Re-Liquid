import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import CleanCSS from 'clean-css';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const SRC_DIR    = path.resolve(__dirname, '../src/components');
const DIST_DIR   = path.resolve(__dirname, '../dist');
const cleancss   = new CleanCSS();

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' kB';
}

function liquidMacroPlugin() {
  return {
    name: 'liquid-macro',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.tsx') || id.endsWith('.ts')) {

        const minifyLiquid = (content) => {
          return content
            .replace(/\r?\n|\r/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
        };

        let newCode = code.replace(/injectLiquid(?:<[^>]*>)?\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/g, (match, quote, content) => {
          return `${quote}[[LIQUID_${minifyLiquid(content)}_LIQUID]]${quote}`;
        });

        newCode = newCode.replace(/injectLiquidRaw(?:<[^>]*>)?\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/g, (match, quote, content) => {
          const encoded = Buffer.from(minifyLiquid(content)).toString('base64');
          return `${quote}[[RAW_${encoded}_RAW]]${quote}`;
        });

        newCode = newCode.replace(
          /<style>\s*\{`([\s\S]*?)`\}\s*<\/style>/g,
          (match, cssContent) => {
            const interpolations = [];
            const withPlaceholders = cssContent.replace(/\$\{([^}]+)\}/g, (m, expr) => {
              const placeholder = `__INTERP_${interpolations.length}__`;
              interpolations.push(expr);
              return placeholder;
            });

            const minified = cleancss.minify(withPlaceholders).styles;

            const restored = minified.replace(/__INTERP_(\d+)__/g, (_, i) => { 
              return '${' + interpolations[i] + '}';
            });

            return `<style>{\`${restored}\`}</style>`;
          }
        );

        const entryMatch = id.replace(/\\/g, '/').match(/src\/components\/([^/]+)\/\1\.tsx$/);
        if (entryMatch) {
          const folderName = entryMatch[1];
          const exportMatch = newCode.match(/export\s+(?:function|const)\s+(\w+)/);

          if (exportMatch) {
            const exportedName = exportMatch[1];

            newCode = newCode.replace(/\(window\s+as\s+any\)\s*\[['"][^'"]*['"]\]\s*=\s*\w+\s*;?\n?/g,'');

            newCode += `\n(window as any)["${folderName}"] = ${exportedName};`;
          }
        }

        return { code: newCode };
      }
    }
  };
}

async function runBuilds() {
  const args = process.argv.slice(2);
  const targetComponent = args[0];

  let componentsToBuild = [];

  if (targetComponent && targetComponent !== '--all') {
    const targetPath = path.join(SRC_DIR, targetComponent);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      componentsToBuild = [targetComponent];
    } else {
      console.error(`\x1b[31m✗ Componente '${targetComponent}' não encontrado.\x1b[0m`);
      process.exit(1);
    }
  } else {
    componentsToBuild = fs.readdirSync(SRC_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  console.log('\x1b[36mIniciando compilação das ilhas React...\x1b[0m\n');
  const startTime = performance.now();
  let compiledCount = 0;

  for (const folder of componentsToBuild) {
    const entryPath = path.resolve(SRC_DIR, folder, `${folder}.tsx`);

    if (fs.existsSync(entryPath)) {
      await build({
        configFile: false,
        logLevel: 'silent',
        define: {
          'process.env.NODE_ENV': JSON.stringify('production')
        },
        plugins: [
          liquidMacroPlugin(),
          react({ jsxRuntime: 'classic' })
        ],
        build: {
          emptyOutDir: false,
          outDir: 'dist',
          lib: {
            entry: entryPath,
            name: folder.replace(/-/g, '_'),
            formats: ['iife'],
            fileName: () => `${folder}.js`
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM'
              },
              assetFileNames: (assetInfo) => {
                const assetName = assetInfo.names && assetInfo.names.length > 0 ? assetInfo.names[0] : '';
                if (assetName === 'style.css') return `${folder}.css`;
                return assetName || '[name].[ext]';
              }
            }
          }
        }
      });

      const jsPath = path.join(DIST_DIR, `${folder}.js`);
      const cssPath = path.join(DIST_DIR, `${folder}.css`);
      
      let sizeInfo = '';
      if (fs.existsSync(jsPath)) {
        sizeInfo += `JS: ${formatSize(fs.statSync(jsPath).size)}`;
      }
      if (fs.existsSync(cssPath)) {
        sizeInfo += ` | CSS: ${formatSize(fs.statSync(cssPath).size)}`;
      }

      console.log(`\x1b[32m✓\x1b[0m dist/${folder} \x1b[90m(${sizeInfo})\x1b[0m`);
      compiledCount++;
    }
  }

  const endTime = performance.now();
  const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n\x1b[32m✓ Compilação concluída:\x1b[0m ${compiledCount} arquivos em ${timeTaken}s.`);
}

runBuilds();