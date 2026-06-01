#!/usr/bin/env node
/**
 * Generates project_docs/01-product/sama-naffa-user-flows.pdf from branded HTML.
 *
 * Uses Chrome for Testing (Puppeteer cache) or system Chrome headless.
 * Usage: bun run docs:user-flows-pdf
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'project_docs/01-product/sama-naffa-user-flows.html');
const pdfPath = path.join(root, 'project_docs/01-product/sama-naffa-user-flows.pdf');

if (!fs.existsSync(htmlPath)) {
  console.error('Missing:', htmlPath);
  process.exit(1);
}

function findChrome() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];

  const cacheRoot = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  if (fs.existsSync(cacheRoot)) {
    for (const dir of fs.readdirSync(cacheRoot)) {
      const mac = path.join(
        cacheRoot,
        dir,
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      );
      const linux = path.join(cacheRoot, dir, 'chrome-linux64', 'chrome');
      candidates.push(mac, linux);
    }
  }

  return candidates.find((p) => fs.existsSync(p));
}

const chrome = findChrome();
if (!chrome) {
  console.error(
    'Chrome not found. Install with: npx puppeteer browsers install chrome\n' +
      'Or open the HTML in a browser and Print → Save as PDF:\n' +
      htmlPath,
  );
  process.exit(1);
}

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ],
  { stdio: 'inherit' },
);

if (result.status !== 0 || !fs.existsSync(pdfPath)) {
  process.exit(result.status ?? 1);
}

console.log('Wrote', pdfPath);
