import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

const ListaString           = ['text','textarea','inline_richtext','richtext','html','liquid','url','video_url','color','color_background','color_scheme', 'article','blog','collection','page','product','link_list'];
const ListaStringArray      = ['collection_list','product_list'];
const ListaImagePicker      = ['image_picker'];
const ListaVideo            = ['video'];
const ListaFontPicker       = ['font_picker'];
const ListaTextAlignment    = ['text_alignment'];
const ListaSelect           = ['select','radio'];
const ListaHeaderParagraph  = ['header','paragraph'];


function getTypeScriptType(setting) {
    
    if (ListaString.includes(setting.type)) return 'string';
    
    if (ListaStringArray.includes(setting.type)) return 'string[]';
    
    if (ListaImagePicker.includes(setting.type)) return 'string | null';
    
    if (ListaVideo.includes(setting.type)) return '{ id: string; media_type: string; sources: { url: string; mime_type: string; format: string; height: number; width: number }[] } | null';
    
    if (ListaFontPicker.includes(setting.type)) return '{ family: string; fallback_families: string; weight: number; style: string } | null';
    
    if (ListaTextAlignment.includes(setting.type)) return "'left' | 'center' | 'right' | 'justify'";
    
    if (ListaSelect.includes(setting.type)) {
        if (setting.options && Array.isArray(setting.options)) {
            const literalValues = setting.options.map(opt => `'${opt.value}'`);
            return literalValues.join(' | ') || 'string';
        }
        return 'string';
    } 
    
    if (ListaHeaderParagraph.includes(setting.type)) return null; 
    
    return 'any';
}

function processSchemaFile(filePath) {
  const schemaContent = fs.readFileSync(filePath, 'utf8');
  let parsedSchema;
  
  try {
    parsedSchema = JSON.parse(schemaContent);
  } catch (e) {
    return false;
  }

  if (!parsedSchema.settings) return false;

  let typesContent = 'export interface Settings {\n';

  parsedSchema.settings.forEach(setting => {
    const tsType = getTypeScriptType(setting);
    if (tsType && setting.id) {
      typesContent += `  ${setting.id}: ${tsType};\n`;
    }
  });

  typesContent += '}\n';

  const fileName = path.basename(filePath, '.schema.json');
  const dirName = path.dirname(filePath);
  const typesPath = path.join(dirName, `${fileName}.types.ts`);

  fs.writeFileSync(typesPath, typesContent, 'utf8');
  return true;
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function buildAll() {
  const startTime = performance.now();
  let processedFiles = 0;

  walkDir(SRC_COMPONENTS_DIR, (filePath) => {
    if (filePath.endsWith('.schema.json')) {
      if (processSchemaFile(filePath)) {
        processedFiles++;
      }
    }
  });

  const endTime = performance.now();
  const timeTaken = Math.round(endTime - startTime);
  console.log(`\x1b[32m✓\x1b[0m generated ${processedFiles} types in ${timeTaken}ms`);
}

function watchSchemas() {
  console.log('\x1b[36mWatcher nativo ativado. Observando arquivos .schema.json...\x1b[0m');
  
  fs.watch(SRC_COMPONENTS_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.schema.json')) {
      const fullPath = path.join(SRC_COMPONENTS_DIR, filename);
      
      if (fs.existsSync(fullPath)) {
        const startTime = performance.now();
        if (processSchemaFile(fullPath)) {
          const timeTaken = Math.round(performance.now() - startTime);
          console.log(`\x1b[32m✓\x1b[0m Tipos atualizados para \x1b[90m${filename}\x1b[0m (${timeTaken}ms)`);
        }
      }
    }
  });
}

const args = process.argv.slice(2);

if (args.includes('--watch')) {
  watchSchemas();
} else {
  buildAll();
}
