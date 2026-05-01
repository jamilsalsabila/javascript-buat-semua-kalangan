(function () {
  const PROGRESS_KEY = 'js-everybody:last-read';
  const MONACO_VS_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs';
  const toc = document.querySelector('#daftar-isi');
  let monacoReady = null;
  let monacoIntellisenseConfigured = false;

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function ensureId(element, fallback) {
    if (!element.id) {
      element.id = slugify(element.textContent || fallback);
    }
    return element.id;
  }

  function collectSections() {
    const chapters = [];
    document.querySelectorAll('.chapter-header').forEach((chapter, index) => {
      const number = chapter.querySelector('.chapter-number')?.textContent.trim() || '';
      const title = chapter.querySelector('.chapter-title')?.textContent.trim() || `Bagian ${index + 1}`;
      const id = ensureId(chapter, number ? `${number} ${title}` : title);
      const sections = [];
      let node = chapter.nextElementSibling;

      while (node && !node.classList.contains('chapter-header')) {
        if (node.matches('h2')) {
          sections.push({
            id: ensureId(node, node.textContent),
            title: node.textContent.trim()
          });
        }
        node = node.nextElementSibling;
      }

      chapters.push({ id, number, title, sections });
    });
    return chapters;
  }

  function buildToc(chapters) {
    if (!toc) return;

    const saved = readProgress();
    const status = saved?.id
      ? `<div class="toc-status">Terakhir dibaca: <a href="#${saved.id}">${saved.title || 'lanjutkan dari posisi terakhir'}</a></div>`
      : '';

    toc.innerHTML = `<h2>Daftar Isi</h2>${status}`;

    chapters.forEach((chapter, index) => {
      const details = document.createElement('details');
      details.open = index === 0 || chapter.sections.some((section) => section.id === saved?.id) || chapter.id === saved?.id;

      const summary = document.createElement('summary');
      summary.innerHTML = `<a class="toc-chapter-link" href="#${chapter.id}">${chapter.number ? `${chapter.number} - ` : ''}${chapter.title}</a>`;
      details.appendChild(summary);

      if (chapter.sections.length) {
        const list = document.createElement('div');
        list.className = 'toc-sub-list';
        chapter.sections.forEach((section) => {
          const link = document.createElement('a');
          link.href = `#${section.id}`;
          link.textContent = section.title;
          list.appendChild(link);
        });
        details.appendChild(list);
      }

      toc.appendChild(details);
    });
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY));
    } catch {
      return null;
    }
  }

  function saveProgress(target) {
    if (!target?.id) return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      id: target.id,
      title: target.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
      scrollY: window.scrollY,
      savedAt: Date.now()
    }));
  }

  function restoreProgress() {
    const saved = readProgress();
    if (!saved || location.hash) return;

    requestAnimationFrame(() => {
      if (Number.isFinite(saved.scrollY)) {
        window.scrollTo({ top: saved.scrollY, behavior: 'auto' });
        return;
      }

      const target = document.getElementById(saved.id);
      target?.scrollIntoView({ block: 'start' });
    });
  }

  function observeReadingProgress() {
    const markers = [...document.querySelectorAll('.chapter-header, h2')].filter((item) => item.id);
    let current = null;
    let timer = null;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target) {
        current = visible.target;
        saveProgress(current);
      }
    }, { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] });

    markers.forEach((marker) => observer.observe(marker));
    window.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (current) saveProgress(current);
      }, 250);
    }, { passive: true });
  }

  function stripTypescript(source) {
    return source
      .replace(/^\s*import\s+[^;]+;?\s*$/gm, '')
      .replace(/^\s*export\s+(?=class|function|const|let|var)/gm, '')
      .replace(/^\s*export\s+default\s+/gm, '')
      .replace(/interface\s+\w+(?:<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}\s*/g, '')
      .replace(/type\s+\w+(?:<[^>]+>)?\s*=\s*[\s\S]*?;\s*/g, '')
      .replace(/\b(public|private|protected|readonly|abstract)\s+/g, '')
      .replace(/:\s*[A-Za-z_$][\w$<>\[\]\s|&,.?]*(?=[,)=;{])/g, '')
      .replace(/\)\s*:\s*[A-Za-z_$][\w$<>\[\]\s|&,.?]*(?=\s*\{)/g, ')')
      .replace(/<([A-Z][\w$]*)(?:,\s*[A-Z][\w$]*)*>(?=\s*\()/g, '');
  }

  function runnableCode(code, language) {
    if (language === 'typescript') return transpileTypescript(code);
    if (language === 'javascript' || language === 'js') return code;
    return null;
  }

  function transpileTypescript(source) {
    if (!window.ts) return stripTypescript(source);

    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.None,
        target: ts.ScriptTarget.ES2020,
        strict: false,
        esModuleInterop: true,
        importHelpers: false,
        removeComments: false
      },
      reportDiagnostics: true
    });

    const blockingDiagnostics = (transpiled.diagnostics || [])
      .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
    if (blockingDiagnostics.length) {
      throw new Error(formatTypescriptDiagnostics(blockingDiagnostics, source));
    }

    return transpiled.outputText;
  }

  function formatTypescriptDiagnostics(diagnostics, source) {
    const sourceFile = ts.createSourceFile('editor.ts', source, ts.ScriptTarget.ES2020, true);
    return diagnostics.map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (typeof diagnostic.start !== 'number') return `TypeScript: ${message}`;

      const position = sourceFile.getLineAndCharacterOfPosition(diagnostic.start);
      return `TypeScript (${position.line + 1}:${position.character + 1}): ${message}`;
    }).join('\n');
  }

  function isRunnableLanguage(language) {
    return language === 'typescript' || language === 'javascript' || language === 'js';
  }

  async function executeCode(source, output) {
    const logs = [];
    const originalConsole = window.console;
    const scopedConsole = {
      log: (...args) => logs.push(args.map(formatValue).join(' ')),
      warn: (...args) => logs.push(args.map(formatValue).join(' ')),
      error: (...args) => logs.push(args.map(formatValue).join(' '))
    };

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

  function formatValue(value) {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  function enhanceCodeBlocks() {
    document.querySelectorAll('pre').forEach((pre) => {
      const code = pre.querySelector('code');
      const language = [...(code?.classList || [])]
        .find((name) => name.startsWith('language-'))
        ?.replace('language-', '');
      if (!code || !isRunnableLanguage(language)) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-runner';
      const editor = document.createElement('textarea');
      editor.className = 'code-editor';
      editor.spellcheck = false;
      editor.value = code.textContent;
      const actions = document.createElement('div');
      actions.className = 'code-actions';
      const button = document.createElement('button');
      button.className = 'run-button';
      button.type = 'button';
      button.textContent = 'Run';
      const output = document.createElement('div');
      output.className = 'runner-output';
      output.innerHTML = `
        <div class="runner-output-header">
          <span>Output</span>
          <button class="close-output-button" type="button">Close</button>
        </div>
        <pre class="runner-output-content"></pre>
      `;
      const closeButton = output.querySelector('.close-output-button');
      let codeEditor = null;

      button.addEventListener('click', () => {
        const currentCode = codeEditor ? codeEditor.getValue() : editor.value;
        try {
          executeCode(runnableCode(currentCode, language), output);
        } catch (error) {
          showRunnerError(error, output);
        }
      });
      closeButton.addEventListener('click', () => {
        output.classList.remove('is-visible', 'is-error');
      });

      actions.appendChild(button);
      pre.replaceWith(wrapper);
      wrapper.append(editor, actions, output);
      codeEditor = createCodeEditor(editor, language);
    });
  }

  function createCodeEditor(textarea, language) {
    const adapter = {
      editor: null,
      getValue: () => textarea.value
    };

    setupFallbackTextarea(textarea);

    getMonaco().then((monaco) => {
      if (monaco) {
        adapter.editor = createMonacoEditor(monaco, textarea, language);
        adapter.getValue = () => adapter.editor.getValue();
        return;
      }

      if (window.CodeMirror) {
        adapter.editor = createCodeMirrorEditor(textarea, language);
        adapter.getValue = () => adapter.editor.getValue();
      }
    });

    return adapter;
  }

  function getMonaco() {
    if (window.monaco?.editor) {
      configureMonacoIntellisense(window.monaco);
      return Promise.resolve(window.monaco);
    }
    if (!window.require) return Promise.resolve(null);
    if (monacoReady) return monacoReady;

    monacoReady = new Promise((resolve) => {
      try {
        window.MonacoEnvironment = {
          getWorker() {
            const workerSource = `
              self.MonacoEnvironment = { baseUrl: '${MONACO_VS_BASE}/' };
              importScripts('${MONACO_VS_BASE}/base/worker/workerMain.js');
            `;
            const blob = new Blob([workerSource], { type: 'text/javascript' });
            return new Worker(URL.createObjectURL(blob));
          },
          getWorkerUrl() {
            const workerSource = `
              self.MonacoEnvironment = { baseUrl: '${MONACO_VS_BASE}/' };
              importScripts('${MONACO_VS_BASE}/base/worker/workerMain.js');
            `;
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(workerSource)}`;
          }
        };
        window.require.config({ paths: { vs: MONACO_VS_BASE } });
        window.require(['vs/editor/editor.main'], () => {
          if (window.monaco) configureMonacoIntellisense(window.monaco);
          resolve(window.monaco || null);
        }, () => resolve(null));
      } catch {
        resolve(null);
      }
    });

    return monacoReady;
  }

  function configureMonacoIntellisense(monaco) {
    if (monacoIntellisenseConfigured) return;
    monacoIntellisenseConfigured = true;

    const compilerOptions = {
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      lib: ['es2020', 'dom', 'dom.iterable'],
      allowNonTsExtensions: true,
      checkJs: true,
      strict: false,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      typeRoots: ['node_modules/@types']
    };

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    });
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    const tutorialTypes = `
interface BunRuntime {
  version: string;
  env: Record<string, string | undefined>;
  file(path: string): Blob;
  write(path: string, data: string | Blob | ArrayBuffer | Uint8Array): Promise<number>;
  serve(options: {
    port?: number;
    hostname?: string;
    fetch(request: Request): Response | Promise<Response>;
  }): { port: number; hostname: string; stop(closeActiveConnections?: boolean): void };
}

declare const Bun: BunRuntime;

declare module "bun" {
  export const Bun: BunRuntime;
}

declare module "bun:sqlite" {
  export class Database {
    constructor(filename?: string);
    query<T = unknown>(sql: string): {
      all(...params: unknown[]): T[];
      get(...params: unknown[]): T | null;
      run(...params: unknown[]): unknown;
    };
    prepare<T = unknown>(sql: string): {
      all(params?: Record<string, unknown>): T[];
      get(params?: Record<string, unknown>): T | null;
      run(params?: Record<string, unknown>): unknown;
    };
    close(): void;
  }
}

declare module "elysia" {
  export class Elysia {
    get(path: string, handler: (...args: any[]) => any): this;
    post(path: string, handler: (...args: any[]) => any, options?: unknown): this;
    put(path: string, handler: (...args: any[]) => any, options?: unknown): this;
    delete(path: string, handler: (...args: any[]) => any): this;
    listen(port: number): this;
  }
  export const t: Record<string, (...args: any[]) => unknown>;
}

declare module "zod" {
  export const z: any;
}

declare module "dayjs" {
  const dayjs: any;
  export default dayjs;
}

declare module "lodash" {
  const lodash: any;
  export default lodash;
}

declare module "uuid" {
  export function v4(): string;
  export function v5(value: string, namespace: string): string;
}

declare module "chalk" {
  const chalk: any;
  export default chalk;
}
`;

    monaco.languages.typescript.javascriptDefaults.addExtraLib(tutorialTypes, 'file:///tutorial-types.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(tutorialTypes, 'file:///tutorial-types.d.ts');
    registerConsoleIntellisense(monaco, 'javascript');
    registerConsoleIntellisense(monaco, 'typescript');
    registerTutorialSnippets(monaco, 'javascript');
    registerTutorialSnippets(monaco, 'typescript');
  }

  function registerConsoleIntellisense(monaco, language) {
    const consoleItems = [
      ['log', 'Menulis nilai umum ke console.', 'console.log(value)'],
      ['error', 'Menulis pesan error ke console.', 'console.error(error)'],
      ['warn', 'Menulis pesan peringatan ke console.', 'console.warn(message)'],
      ['info', 'Menulis pesan informasi ke console.', 'console.info(message)'],
      ['table', 'Menampilkan array/object sebagai tabel.', 'console.table(data)'],
      ['clear', 'Membersihkan console.', 'console.clear()'],
      ['time', 'Memulai timer bernama.', 'console.time(label)'],
      ['timeEnd', 'Mengakhiri timer bernama dan mencetak durasinya.', 'console.timeEnd(label)'],
      ['group', 'Membuka grup log.', 'console.group(label)'],
      ['groupEnd', 'Menutup grup log.', 'console.groupEnd()']
    ];

    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['.'],
      provideCompletionItems(model, position) {
        const linePrefix = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });
        if (!/\bconsole\.\w*$/.test(linePrefix)) return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return {
          suggestions: consoleItems.map(([label, documentation, signature]) => ({
            label,
            kind: monaco.languages.CompletionItemKind.Method,
            detail: signature,
            documentation,
            insertText: label,
            range
          }))
        };
      }
    });

    monaco.languages.registerHoverProvider(language, {
      provideHover(model, position) {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const lineBeforeWord = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: Math.max(1, word.startColumn - 8),
          endLineNumber: position.lineNumber,
          endColumn: word.startColumn
        });
        if (!/console\.$/.test(lineBeforeWord)) return null;

        const item = consoleItems.find(([label]) => label === word.word);
        if (!item) return null;

        const [label, documentation, signature] = item;
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: [
            { value: `\`\`\`ts\n${signature}\n\`\`\`` },
            { value: `**console.${label}** - ${documentation}` }
          ]
        };
      }
    });
  }

  function registerTutorialSnippets(monaco, language) {
    const snippets = [
      {
        label: 'clog',
        detail: 'console.log(...)',
        insertText: 'console.log(${1:value});'
      },
      {
        label: 'fn',
        detail: 'function declaration',
        insertText: 'function ${1:namaFungsi}(${2:parameter}) {\n  ${3:// kode}\n}'
      },
      {
        label: 'afn',
        detail: 'arrow function',
        insertText: 'const ${1:namaFungsi} = (${2:parameter}) => {\n  ${3:// kode}\n};'
      },
      {
        label: 'forof',
        detail: 'for...of loop',
        insertText: 'for (const ${1:item} of ${2:items}) {\n  ${3:// kode}\n}'
      },
      {
        label: 'trycatch',
        detail: 'try/catch block',
        insertText: 'try {\n  ${1:// kode}\n} catch (${2:error}) {\n  console.error(${2:error});\n}'
      },
      {
        label: 'asyncfn',
        detail: 'async function',
        insertText: 'async function ${1:namaFungsi}(${2:parameter}) {\n  const ${3:hasil} = await ${4:promise};\n  return ${3:hasil};\n}'
      },
      {
        label: 'fetchjson',
        detail: 'fetch JSON',
        insertText: 'const response = await fetch("${1:https://example.com/api}");\nconst data = await response.json();\nconsole.log(data);'
      },
      {
        label: 'class',
        detail: 'class with constructor',
        insertText: 'class ${1:NamaClass} {\n  constructor(${2:parameter}) {\n    ${3:// inisialisasi}\n  }\n\n  ${4:method}() {\n    ${5:// kode}\n  }\n}'
      },
      {
        label: 'interface',
        detail: 'TypeScript interface',
        insertText: 'interface ${1:NamaInterface} {\n  ${2:properti}: ${3:string};\n}'
      },
      {
        label: 'type',
        detail: 'TypeScript type alias',
        insertText: 'type ${1:NamaType} = {\n  ${2:properti}: ${3:string};\n};'
      },
      {
        label: 'bunserve',
        detail: 'Bun.serve HTTP server',
        insertText: 'const server = Bun.serve({\n  port: ${1:3000},\n  fetch(request) {\n    return new Response("${2:Hello Bun!}");\n  }\n});\n\nconsole.log(`Server berjalan di http://localhost:${server.port}`);'
      }
    ];

    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['.', ':'],
      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return {
          suggestions: snippets.map((snippet) => ({
            label: snippet.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: snippet.detail,
            insertText: snippet.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          }))
        };
      }
    });
  }

  function createMonacoEditor(monaco, textarea, language) {
    const host = document.createElement('div');
    host.className = 'monaco-editor-host';
    textarea.after(host);
    textarea.classList.add('is-hidden-editor-source');

    const editor = monaco.editor.create(host, {
      value: textarea.value,
      language: language === 'typescript' ? 'typescript' : 'javascript',
      theme: 'vs',
      automaticLayout: true,
      minimap: { enabled: false },
      fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
      fontSize: 13,
      lineHeight: 21,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      overviewRulerBorder: false,
      renderLineHighlight: 'line',
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      parameterHints: { enabled: true },
      hover: { enabled: true }
    });

    resizeMonacoEditor(editor, host);
    editor.onDidChangeModelContent(() => resizeMonacoEditor(editor, host));
    return editor;
  }

  function resizeMonacoEditor(editor, host) {
    const lineHeight = 21;
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const height = Math.min(Math.max(lineCount * lineHeight + 32, 140), 560);
    host.style.height = `${height}px`;
    editor.layout();
  }

  function createCodeMirrorEditor(textarea, language) {
    textarea.classList.remove('code-editor-fallback');

    const editor = CodeMirror.fromTextArea(textarea, {
      mode: {
        name: 'javascript',
        typescript: language === 'typescript'
      },
      theme: 'eclipse',
      lineNumbers: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      lineWrapping: true,
      viewportMargin: Infinity,
      extraKeys: {
        Tab(cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
            return;
          }
          cm.replaceSelection('  ', 'end');
        }
      }
    });

    editor.setSize('100%', 'auto');
    return editor;
  }

  function showRunnerError(error, output) {
    output.classList.add('is-visible', 'is-error');
    output.querySelector('.runner-output-content').textContent = error?.message || String(error);
  }

  function setupFallbackTextarea(textarea) {
    textarea.classList.add('code-editor-fallback');
    autosizeFallbackEditor(textarea);
    textarea.addEventListener('input', () => autosizeFallbackEditor(textarea));
    textarea.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      insertAtCursor(textarea, '  ');
      autosizeFallbackEditor(textarea);
    });
  }

  function autosizeFallbackEditor(editor) {
    editor.style.height = 'auto';
    editor.style.height = `${Math.max(editor.scrollHeight, 140)}px`;
  }

  function insertAtCursor(editor, text) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = `${editor.value.slice(0, start)}${text}${editor.value.slice(end)}`;
    editor.selectionStart = editor.selectionEnd = start + text.length;
    editor.dispatchEvent(new Event('input'));
  }

  function addBackToTocButton() {
    if (!toc) return;
    const button = document.createElement('a');
    button.href = '#daftar-isi';
    button.className = 'back-to-toc';
    button.textContent = 'Daftar Isi';
    document.body.appendChild(button);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const chapters = collectSections();
    buildToc(chapters);
    enhanceCodeBlocks();
    addBackToTocButton();
    observeReadingProgress();
    restoreProgress();
  });
})();
