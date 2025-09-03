const fs = require('fs');
const path = require('path');

const directoriesToRemove = [
  'node_modules',
  'dist',
  '.turbo',
  '.swc'
];

directoriesToRemove.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Removed ${dirPath}`);
  }
});

console.log('Clean complete');