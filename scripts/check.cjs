'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
for (const folder of ['js', 'scripts', 'tests']) {
  for (const name of fs.readdirSync(path.join(root, folder))) {
    if (/\.(c?js)$/.test(name)) execFileSync(process.execPath, ['--check', path.join(root, folder, name)], { stdio: 'inherit' });
  }
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, reference] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (!reference.includes('://') && !fs.existsSync(path.join(root, reference))) throw new Error('Missing entry asset: ' + reference);
}
console.log('源码与入口引用检查通过。');
