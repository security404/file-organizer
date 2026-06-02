'use strict';

const fs   = require('fs');
const path = require('path');
const { CATEGORIES, OTHERS_FOLDER } = require('./config');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS = {
  reset:  '\x1b[0m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
  dim:    '\x1b[2m',
  bold:   '\x1b[1m',
};
const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

/**
 * Build a reverse map: extension → folder name
 * @returns {Map<string, string>}
 */
function buildExtMap() {
  const map = new Map();
  for (const [folder, exts] of Object.entries(CATEGORIES)) {
    for (const ext of exts) {
      map.set(ext.toLowerCase(), folder);
    }
  }
  return map;
}

/**
 * Get a unique file path to avoid overwriting existing files.
 * e.g. photo.jpg → photo (1).jpg → photo (2).jpg
 * @param {string} destPath
 * @returns {string}
 */
function uniquePath(destPath) {
  if (!fs.existsSync(destPath)) return destPath;
  const dir  = path.dirname(destPath);
  const ext  = path.extname(destPath);
  const base = path.basename(destPath, ext);
  let counter = 1;
  let candidate;
  do {
    candidate = path.join(dir, `${base} (${counter})${ext}`);
    counter++;
  } while (fs.existsSync(candidate));
  return candidate;
}

// ─── Core logic ───────────────────────────────────────────────────────────────

/**
 * Organize files in the given folder.
 * @param {string}  targetDir  - Absolute path to the folder to organize
 * @param {boolean} dryRun     - If true, only simulate (no files are moved)
 */
function organizeFolder(targetDir, dryRun = false) {
  // Validate target
  if (!fs.existsSync(targetDir)) {
    console.error(c('red', `\n✗ Folder tidak ditemukan: ${targetDir}\n`));
    process.exit(1);
  }

  const stat = fs.statSync(targetDir);
  if (!stat.isDirectory()) {
    console.error(c('red', `\n✗ Path bukan folder: ${targetDir}\n`));
    process.exit(1);
  }

  const extMap  = buildExtMap();
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });

  // Only process files at the top level (skip sub-folders and hidden files)
  const files = entries.filter(e => e.isFile() && !e.name.startsWith('.'));

  if (files.length === 0) {
    console.log(c('yellow', '\n⚠ Tidak ada file di folder ini.\n'));
    return;
  }

  // ── Print header ────────────────────────────────────────────────────────────
  console.log('\n' + c('cyan',  '╔══════════════════════════════════════════╗'));
  console.log(c('cyan',         '║         📁  File Organizer  📁           ║'));
  console.log(c('cyan',         '╚══════════════════════════════════════════╝'));
  console.log(c('dim',  `  Folder : ${targetDir}`));
  console.log(c('dim',  `  Files  : ${files.length}`));
  if (dryRun) console.log(c('yellow', '  Mode   : DRY RUN (tidak ada file yang dipindah)'));
  console.log();

  // ── Process each file ───────────────────────────────────────────────────────
  const stats = {};   // folder → count
  const log   = [];   // { file, dest, folder, status }

  for (const entry of files) {
    const ext        = path.extname(entry.name).toLowerCase();
    const folder     = extMap.get(ext) || OTHERS_FOLDER;
    const destDir    = path.join(targetDir, folder);
    const destFile   = uniquePath(path.join(destDir, entry.name));
    const srcFile    = path.join(targetDir, entry.name);

    let status = 'moved';

    if (!dryRun) {
      try {
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.renameSync(srcFile, destFile);
      } catch (err) {
        status = 'error';
      }
    } else {
      status = 'dry-run';
    }

    stats[folder] = (stats[folder] || 0) + 1;
    log.push({ name: entry.name, folder, destFile: path.basename(destFile), status });
  }

  // ── Print file log ──────────────────────────────────────────────────────────
  console.log(c('bold', '  File yang diproses:'));
  console.log(c('dim', '  ──────────────────────────────────────────'));

  for (const item of log) {
    const icon   = item.status === 'error' ? c('red', '  ✗') : c('green', '  ✓');
    const arrow  = c('dim', '→');
    const folder = c('cyan', item.folder + '/');
    const name   = item.name === item.destFile
      ? item.name
      : `${item.name} ${c('yellow', `(disimpan sebagai: ${item.destFile})`)}`;
    console.log(`${icon}  ${name.padEnd(36)} ${arrow} ${folder}`);
  }

  // ── Print summary ───────────────────────────────────────────────────────────
  console.log();
  console.log(c('bold', '  Ringkasan:'));
  console.log(c('dim', '  ──────────────────────────────────────────'));

  const sortedFolders = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  for (const [folder, count] of sortedFolders) {
    const bar   = '█'.repeat(Math.min(count * 2, 20));
    const label = folder.padEnd(12);
    console.log(`  ${c('cyan', label)}  ${c('green', bar)}  ${c('yellow', String(count))} file`);
  }

  console.log();
  const movedCount = log.filter(l => l.status !== 'error').length;
  const errorCount = log.filter(l => l.status === 'error').length;

  if (dryRun) {
    console.log(c('yellow', `  ⚡ Simulasi selesai. ${movedCount} file akan dipindah.`));
    console.log(c('dim',    '  Jalankan tanpa --dry-run untuk memindah file sungguhan.\n'));
  } else {
    console.log(c('green', `  ✅ Selesai! ${movedCount} file berhasil dipindah.`));
    if (errorCount > 0) console.log(c('red', `  ✗ ${errorCount} file gagal dipindah.`));
    console.log();
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const args   = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Allow custom target: node organizer.js /path/to/folder
const customPath = args.find(a => !a.startsWith('--'));

// Default: ~/Downloads (works on Windows, macOS, Linux)
const defaultDownloads = path.join(
  process.env.HOME || process.env.USERPROFILE || require('os').homedir(),
  'Downloads'
);

const targetDir = customPath ? path.resolve(customPath) : defaultDownloads;

organizeFolder(targetDir, dryRun);
