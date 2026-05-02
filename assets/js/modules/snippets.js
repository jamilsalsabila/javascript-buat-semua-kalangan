const MANIFEST_URL = 'assets/snippets/manifest.json';

const snippetState = {
  manifestPromise: null,
  sourceCache: new Map(),
  editorRegistry: new Map()
};

export async function hydrateSnippetBlocks(root = document) {
  const manifest = await loadSnippetManifest();
  const labeledBlocks = [...root.querySelectorAll('.code-label + pre.line-numbers code')];

  await Promise.all(manifest.map(async (entry, index) => {
    const codeElement = labeledBlocks[index];
    if (!codeElement) return;

    const source = await readSnippetFile(entry.file);
    const pre = codeElement.parentElement;
    if (!pre) return;

    pre.dataset.snippetId = entry.blockId;
    pre.dataset.snippetFile = entry.file;
    pre.dataset.snippetLanguage = entry.language;
    codeElement.textContent = source;

    if (window.Prism) Prism.highlightElement(codeElement);
  }));
}

export function registerSnippetEditor(filePath, adapter) {
  if (!filePath) return;
  snippetState.editorRegistry.set(filePath, adapter);
}

export async function getSnippetSource(filePath) {
  if (!filePath) return null;

  const adapter = snippetState.editorRegistry.get(filePath);
  if (adapter?.getValue) {
    return adapter.getValue();
  }

  return readSnippetFile(filePath);
}

export function resolveSnippetImport(fromFilePath, specifier) {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    return null;
  }

  const baseSegments = fromFilePath.split('/');
  baseSegments.pop();
  const targetSegments = specifier.split('/');

  for (const segment of targetSegments) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      baseSegments.pop();
      continue;
    }
    baseSegments.push(segment);
  }

  const candidate = baseSegments.join('/');
  const knownFiles = [
    candidate,
    `${candidate}.ts`,
    `${candidate}.js`,
    `${candidate}/index.ts`,
    `${candidate}/index.js`
  ];

  return knownFiles.find((file) => snippetState.sourceCache.has(file) || snippetState.editorRegistry.has(file)) || candidate;
}

export function getSnippetFilePath(preElement) {
  return preElement?.dataset?.snippetFile || null;
}

export async function loadSnippetManifest() {
  if (!snippetState.manifestPromise) {
    snippetState.manifestPromise = fetch(MANIFEST_URL).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat manifest snippet: ${response.status}`);
      }
      return response.json();
    });
  }

  return snippetState.manifestPromise;
}

async function readSnippetFile(filePath) {
  if (snippetState.sourceCache.has(filePath)) {
    return snippetState.sourceCache.get(filePath);
  }

  const response = await fetch(`assets/snippets/${filePath}`);
  if (!response.ok) {
    throw new Error(`Gagal memuat snippet ${filePath}: ${response.status}`);
  }

  const source = await response.text();
  snippetState.sourceCache.set(filePath, source);
  return source;
}
