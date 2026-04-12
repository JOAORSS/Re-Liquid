import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import CleanCSS from 'clean-css';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const SRC_COMPONENTS_DIR = path.resolve(__dirname, '../src/components');
const THEME_PATH = process.env.SHOPIFY_THEME_PATH;

if (!THEME_PATH) {
  console.error('\x1b[31mErro: SHOPIFY_THEME_PATH nao definido no arquivo .env\x1b[0m');
  process.exit(1);
}

const args = process.argv.slice(2);
const targetComponent = args[0];

const files = fs.existsSync(DIST_DIR) ? fs.readdirSync(DIST_DIR) : [];
let compiledComponents = files
  .filter(f => f.endsWith('.js'))
  .map(f => path.basename(f, '.js'));

if (targetComponent && targetComponent !== '--all') {
  if (compiledComponents.includes(targetComponent)) {
    compiledComponents = [targetComponent];
  } else {
    console.error(`\x1b[31mErro: Arquivo compilado para '${targetComponent}' nao encontrado em dist.\x1b[0m`);
    process.exit(1);
  }
}

const componentFolders = fs.readdirSync(SRC_COMPONENTS_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log('\x1b[36mIniciando montagem do formato Liquid...\x1b[0m\n');
let processedCount = 0;

compiledComponents.forEach(name => {
  let jsContent = fs.readFileSync(path.join(DIST_DIR, `${name}.js`), 'utf8');
  
  jsContent = jsContent.replace(/['"`]\[\[LIQUID_([\s\S]*?)_LIQUID\]\]['"`]/g, '{{ $1 }}');
  jsContent = jsContent.replace(/['"`]\[\[RAW_([\s\S]*?)_RAW\]\]['"`]/g, '$1');

  let cssContent = '';
  let schemaContent = '{}';

  const folderName = componentFolders.find(f => f.toLowerCase() === name.toLowerCase());
  
  if (folderName) {
    const sourceCssPath = path.join(SRC_COMPONENTS_DIR, folderName, `${name}.css`);
    
    if (fs.existsSync(sourceCssPath)) {
      const rawCss = fs.readFileSync(sourceCssPath, 'utf8');
      const minifiedOutput = new CleanCSS().minify(rawCss);
      cssContent = minifiedOutput.styles;
    }

    const schemaPath = path.join(SRC_COMPONENTS_DIR, folderName, `${name}.schema.json`);
    if (fs.existsSync(schemaPath)) {
      try {
        const rawJson = fs.readFileSync(schemaPath, 'utf8');
        const parsedJson = JSON.parse(rawJson);
        
        parsedJson.blocks = [];
        const blocksDir = path.join(SRC_COMPONENTS_DIR, folderName, 'blocks');
        
        if (fs.existsSync(blocksDir)) {
          const blockFolders = fs.readdirSync(blocksDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

          blockFolders.forEach(blockName => {
            const blockSchemaPath = path.join(blocksDir, blockName, `${blockName}.schema.json`);
            if (fs.existsSync(blockSchemaPath)) {
              const blockSchemaContent = fs.readFileSync(blockSchemaPath, 'utf8');
              const parsedBlockSchema = JSON.parse(blockSchemaContent);
              parsedJson.blocks.push(parsedBlockSchema);
            }
          });
        }
        
        schemaContent = JSON.stringify(parsedJson, null, 2);
      } catch (e) {
        schemaContent = fs.readFileSync(schemaPath, 'utf8').trim();
      }
    }
  }

  const liquidTemplate = `
<div id="react-widget-{{ section.id }}" class="react-widget-${name.toLowerCase()}" data-settings='{{ section.settings | json | escape }}'></div>

<style>
${cssContent}
</style>

<script>
document.addEventListener("DOMContentLoaded", function() {
  ${jsContent}

  const e=document.getElementById("react-widget-{{ section.id }}");
  if(e&&window.React&&window.ReactDOM){
    const t="${name}";
    const n={
      settings: {{ section.settings | json }},
      blocks: [{%- for block in section.blocks -%}{"id": "{{ block.id }}","type": "{{ block.type }}","settings": {{ block.settings | json }}}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}],
      id: "{{ section.id }}"
    };
    "function"==typeof window[t]&&window.ReactDOM.createRoot(e).render(window.React.createElement(window[t],n))
  }
});
</script>

{% schema %}
${schemaContent}
{% endschema %}
`.trim();

  const finalPath = path.join(THEME_PATH, `sections/${name}.liquid`);
  fs.writeFileSync(finalPath, liquidTemplate, 'utf8');
  
  console.log(`\x1b[32mOK\x1b[0m Injetado: \x1b[90msections/${name}.liquid\x1b[0m`);
  processedCount++;
});

console.log(`\n\x1b[32mProcesso finalizado:\x1b[0m ${processedCount} arquivos Liquid gerados com sucesso.`);