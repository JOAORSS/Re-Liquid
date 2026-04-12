import { execSync } from 'child_process';

const args = process.argv.slice(2);
const target = args[0] ? args[0] : '';

try {
  console.log('\x1b[35m=== Iniciando Pipeline Nextt ===\x1b[0m\n');
  
  execSync(`npm run build:vite -- ${target}`, { stdio: 'inherit' });
  execSync('npm run build:schemas', { stdio: 'inherit' });
  execSync(`node scripts/build-shopify.js ${target}`, { stdio: 'inherit' });
  execSync(`npm run build:types`, { stdio: 'inherit' });

  console.log('\n\x1b[35m=== Pipeline Finalizado com Sucesso ===\x1b[0m\n');
} catch (error) {
  console.error('\x1b[31m\nErro fatal durante o pipeline.\x1b[0m');
  process.exit(1);
}