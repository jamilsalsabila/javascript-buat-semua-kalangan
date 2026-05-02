import { getSnippetSource, resolveSnippetImport } from './snippets.js';
import { transpileModuleCode, transpileRunnableCode } from './transpiler.js';

export async function runCode({ source, language, filePath, output }) {
  if (filePath) {
    return runModuleGraph({ source, language, filePath, output });
  }

  return runInlineCode({
    source: transpileRunnableCode(source, language, filePath || 'editor.ts'),
    output
  });
}

export function showRunnerError(error, output) {
  output.classList.add('is-visible', 'is-error');
  output.querySelector('.runner-output-content').textContent = error?.message || String(error);
}

async function runInlineCode({ source, output }) {
  const logs = [];
  const originalConsole = window.console;
  const scopedConsole = createScopedConsole(logs);

  output.classList.remove('is-error');
  output.querySelector('.runner-output-content').textContent = 'Menjalankan...';
  output.classList.add('is-visible');

  try {
    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
    const fn = new AsyncFunction('console', source);
    await fn(scopedConsole);
    output.querySelector('.runner-output-content').textContent = logs.join('\n') || 'Kode selesai dijalankan tanpa output.';
  } catch (error) {
    output.classList.add('is-error');
    output.querySelector('.runner-output-content').textContent = error?.stack || String(error);
  } finally {
    window.console = originalConsole;
  }
}

async function runModuleGraph({ source, language, filePath, output }) {
  const logs = [];
  const originalConsole = window.console;
  const scopedConsole = createScopedConsole(logs);
  const blobUrls = [];
  const moduleCache = new Map();

  output.classList.remove('is-error');
  output.querySelector('.runner-output-content').textContent = 'Menjalankan...';
  output.classList.add('is-visible');

  try {
    window.console = scopedConsole;
    const entryUrl = await buildModuleUrl({
      source,
      language,
      filePath,
      moduleCache,
      blobUrls
    });

    await import(`${entryUrl}#${Date.now()}`);
    output.querySelector('.runner-output-content').textContent = logs.join('\n') || 'Kode selesai dijalankan tanpa output.';
  } catch (error) {
    output.classList.add('is-error');
    output.querySelector('.runner-output-content').textContent = error?.stack || String(error);
  } finally {
    window.console = originalConsole;
    blobUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}

async function buildModuleUrl({ source, language, filePath, moduleCache, blobUrls }) {
  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }

  const jsSource = transpileModuleCode(source, language, filePath);
  const imports = extractRelativeImports(jsSource);

  let rewrittenSource = jsSource;
  for (const specifier of imports) {
    const resolvedFile = resolveSnippetImport(filePath, specifier);
    if (!resolvedFile) {
      throw new Error(`Import eksternal "${specifier}" belum bisa dijalankan di browser. Hanya import relatif antar snippet lokal yang didukung.`);
    }

    const dependencySource = await getSnippetSource(resolvedFile);
    if (dependencySource == null) {
      throw new Error(`Snippet dependency tidak ditemukan: ${resolvedFile}`);
    }

    const dependencyLanguage = resolvedFile.endsWith('.ts') ? 'typescript' : 'javascript';
    const dependencyUrl = await buildModuleUrl({
      source: dependencySource,
      language: dependencyLanguage,
      filePath: resolvedFile,
      moduleCache,
      blobUrls
    });

    rewrittenSource = rewriteImportSpecifier(rewrittenSource, specifier, dependencyUrl);
  }

  const blobUrl = URL.createObjectURL(new Blob([rewrittenSource], { type: 'text/javascript' }));
  blobUrls.push(blobUrl);
  moduleCache.set(filePath, blobUrl);
  return blobUrl;
}

function extractRelativeImports(source) {
  const matches = [
    ...source.matchAll(/(?:import|export)\s+(?:[^'"]+?\s+from\s+)?["'](\.\/[^"']+|\.\.\/[^"']+)["']/g),
    ...source.matchAll(/import\(\s*["'](\.\/[^"']+|\.\.\/[^"']+)["']\s*\)/g)
  ];

  return [...new Set(matches.map((match) => match[1]))];
}

function rewriteImportSpecifier(source, specifier, replacement) {
  const escapedSpecifier = specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.replace(
    new RegExp(`(["'])${escapedSpecifier}\\1`, 'g'),
    `"${replacement}"`
  );
}

function createScopedConsole(logs) {
  return {
    log: (...args) => logs.push(args.map(formatValue).join(' ')),
    warn: (...args) => logs.push(args.map(formatValue).join(' ')),
    error: (...args) => logs.push(args.map(formatValue).join(' ')),
    info: (...args) => logs.push(args.map(formatValue).join(' ')),
    table: (...args) => logs.push(args.map(formatValue).join(' ')),
    clear: () => {
      logs.length = 0;
    },
    time: () => {},
    timeEnd: () => {}
  };
}

function formatValue(value) {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
