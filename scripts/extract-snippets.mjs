import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const indexPath = path.join(rootDir, 'index.html');
const snippetsRoot = path.join(rootDir, 'assets', 'snippets');
const manifestPath = path.join(snippetsRoot, 'manifest.json');

const html = fs.readFileSync(indexPath, 'utf8');
const tokenRegex = /<div class="chapter-number">BAB\s+(\d+)<\/div>|<div class="code-label">([\s\S]*?)<\/div>\s*<pre class="line-numbers"><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g;
const usedPaths = new Map();
const manifest = [];

fs.rmSync(snippetsRoot, { recursive: true, force: true });
fs.mkdirSync(snippetsRoot, { recursive: true });

let currentChapter = 0;
let match = null;
let blockIndex = 0;

while ((match = tokenRegex.exec(html)) !== null) {
  if (match[1]) {
    currentChapter = Number(match[1]);
    continue;
  }

  if (!match[2] || !match[3] || !match[4] || currentChapter === 0) continue;

  const label = decodeHtml(match[2].trim());
  const language = match[3].trim();
  const content = decodeHtml(match[4]).replace(/\r\n/g, '\n');
  const chapterDirName = `bab-${String(currentChapter).padStart(2, '0')}`;
  const chapterDir = path.join(snippetsRoot, chapterDirName);
  fs.mkdirSync(chapterDir, { recursive: true });

  const relativeFilePath = buildRelativeFilePath({ currentChapter, label, language, usedPaths });
  const absoluteFilePath = path.join(snippetsRoot, relativeFilePath);
  fs.mkdirSync(path.dirname(absoluteFilePath), { recursive: true });
  fs.writeFileSync(absoluteFilePath, content, 'utf8');

  manifest.push({
    blockId: `snippet-${String(++blockIndex).padStart(3, '0')}`,
    chapter: currentChapter,
    chapterDir: chapterDirName,
    label,
    language,
    file: relativeFilePath.replace(/\\/g, '/')
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

function buildRelativeFilePath({ currentChapter, label, language, usedPaths }) {
  const chapterDirName = `bab-${String(currentChapter).padStart(2, '0')}`;
  const normalizedLabel = label.replace(/\s+/g, ' ').trim();

  let relativePath = normalizedLabel;
  if (relativePath.includes('/')) {
    relativePath = relativePath
      .split('/')
      .map((segment) => sanitizeSegment(segment))
      .join('/');
  } else {
    relativePath = sanitizeFilename(normalizedLabel, language);
  }

  if (relativePath !== '.env' && !path.extname(relativePath)) {
    relativePath += extensionFor(language, normalizedLabel);
  }

  const key = `${chapterDirName}/${relativePath}`.replace(/\\/g, '/');
  const count = usedPaths.get(key) || 0;
  usedPaths.set(key, count + 1);
  if (count === 0) {
    return key;
  }

  const ext = path.extname(relativePath);
  const base = relativePath.slice(0, relativePath.length - ext.length);
  return `${chapterDirName}/${base}-${String(count + 1).padStart(2, '0')}${ext}`.replace(/\\/g, '/');
}

function sanitizeFilename(label, language) {
  if (label === '.env') return '.env';

  const compoundFileMatch = label.match(/^(.+?\.[a-z0-9]+)\s*\(([^)]+)\)$/i);
  if (compoundFileMatch) {
    const originalFile = compoundFileMatch[1];
    const qualifier = sanitizeSegment(compoundFileMatch[2]);
    const ext = path.extname(originalFile).toLowerCase();
    const basename = sanitizeSegment(path.basename(originalFile, ext));
    return `${basename}-${qualifier}${ext}`;
  }

  const normalizedLabel = label.replace(/\((.*?)\)/g, '-$1').replace(/\s+/g, ' ').trim();
  const ext = path.extname(normalizedLabel);
  if (ext) {
    const basename = path.basename(normalizedLabel, ext);
    const normalizedBase = sanitizeSegment(basename);
    return `${normalizedBase}${ext.toLowerCase()}`;
  }

  if (/^powershell$/i.test(label)) return 'powershell';
  if (/^terminal$/i.test(label)) return 'terminal';
  return sanitizeSegment(label);
}

function sanitizeSegment(value) {
  return value
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'snippet';
}

function extensionFor(language, label) {
  if (/^powershell$/i.test(label)) return '.ps1';
  if (language === 'typescript') return '.ts';
  if (language === 'javascript' || language === 'js') return '.js';
  if (language === 'bash' || language === 'shell') return '.sh';
  return '.txt';
}

function decodeHtml(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
