const { spawn } = require('child_process');

console.log('========================================================');
console.log(' ✨ ZERO TO ONE - Dual Server Launcher');
console.log(' 🌐 Boutique Storefront: http://localhost:3000');
console.log(' 👑 Atelier Admin Suite:  http://localhost:3001/admin');
console.log('========================================================\n');

// Run Storefront on port 3000
const storefront = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' }
});

// Run Admin on port 3001
const admin = spawn('npx', ['next', 'dev', '-p', '3001'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3001' }
});

const cleanup = () => {
  try {
    storefront.kill();
    admin.kill();
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
