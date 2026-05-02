let monacoReady = null;
let monacoIntellisenseConfigured = false;
let monacoModelCounter = 0;

const MONACO_VS_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs';

export function createCodeEditor(textarea, language, filePath) {
  const adapter = {
    editor: null,
    getValue: () => textarea.value
  };

  setupFallbackTextarea(textarea);

  getMonaco().then((monaco) => {
    if (monaco) {
      adapter.editor = createMonacoEditor(monaco, textarea, language, filePath);
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
        getWorker(_, label) {
          const workerPath = label === 'typescript' || label === 'javascript'
            ? `${MONACO_VS_BASE}/language/typescript/ts.worker.js`
            : `${MONACO_VS_BASE}/editor/editor.worker.js`;
          const workerSource = `
            self.MonacoEnvironment = { baseUrl: '${MONACO_VS_BASE}/' };
            importScripts('${workerPath}');
          `;
          const blob = new Blob([workerSource], { type: 'text/javascript' });
          return new Worker(URL.createObjectURL(blob));
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
    isolatedModules: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    typeRoots: ['node_modules/@types']
  };

  if (monaco.languages.typescript.ModuleDetectionKind?.Force !== undefined) {
    compilerOptions.moduleDetection = monaco.languages.typescript.ModuleDetectionKind.Force;
  }

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
  registerGlobalIntellisense(monaco, 'javascript');
  registerGlobalIntellisense(monaco, 'typescript');
  registerConsoleIntellisense(monaco, 'javascript');
  registerConsoleIntellisense(monaco, 'typescript');
  registerTutorialSnippets(monaco, 'javascript');
  registerTutorialSnippets(monaco, 'typescript');
}

function createMonacoEditor(monaco, textarea, language, filePath) {
  const host = document.createElement('div');
  host.className = 'monaco-editor-host';
  textarea.after(host);
  textarea.classList.add('is-hidden-editor-source');
  const fileExtension = language === 'typescript' ? 'ts' : 'js';
  const modelUri = monaco.Uri.parse(
    filePath
      ? `file:///assets/snippets/${filePath}`
      : `file:///tutorial-${++monacoModelCounter}.${fileExtension}`
  );
  const model = monaco.editor.createModel(
    textarea.value,
    language === 'typescript' ? 'typescript' : 'javascript',
    modelUri
  );

  const editor = monaco.editor.create(host, {
    model,
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
    hover: { enabled: true },
    snippetSuggestions: 'top',
    suggest: {
      showMethods: true,
      showFunctions: true,
      showConstructors: true,
      showVariables: true,
      showClasses: true,
      showModules: true,
      showKeywords: true,
      showSnippets: true
    }
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

function registerGlobalIntellisense(monaco, language) {
  const globals = [
    ['console', 'Global console object untuk logging dan debugging.', 'const console: Console'],
    ['fetch', 'Mengirim HTTP request dan mengembalikan Promise<Response>.', 'function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>'],
    ['setTimeout', 'Menjalankan fungsi sekali setelah delay tertentu.', 'function setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number'],
    ['setInterval', 'Menjalankan fungsi berulang tiap interval tertentu.', 'function setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number'],
    ['clearTimeout', 'Membatalkan timer dari setTimeout.', 'function clearTimeout(id?: number): void'],
    ['clearInterval', 'Membatalkan timer dari setInterval.', 'function clearInterval(id?: number): void'],
    ['Promise', 'Representasi nilai async yang akan tersedia di masa depan.', 'class Promise<T>'],
    ['Map', 'Collection key-value dengan key bertipe bebas.', 'class Map<K, V>'],
    ['Set', 'Collection nilai unik.', 'class Set<T>'],
    ['Date', 'Objek tanggal dan waktu.', 'class Date'],
    ['Math', 'Utility matematika statis.', 'namespace Math'],
    ['JSON', 'Utility parse dan stringify JSON.', 'namespace JSON'],
    ['Array', 'Constructor dan helper untuk array.', 'class Array<T>'],
    ['Object', 'Constructor dan helper dasar object.', 'class Object'],
    ['String', 'Constructor dan helper string.', 'class String'],
    ['Number', 'Constructor dan helper angka.', 'class Number'],
    ['Boolean', 'Constructor dan helper boolean.', 'class Boolean'],
    ['Error', 'Base class untuk error.', 'class Error'],
    ['URL', 'Representasi dan parser URL.', 'class URL'],
    ['parseInt', 'Mengubah string menjadi integer.', 'function parseInt(string: string, radix?: number): number'],
    ['parseFloat', 'Mengubah string menjadi angka pecahan.', 'function parseFloat(string: string): number'],
    ['isNaN', 'Mengecek apakah sebuah nilai adalah NaN.', 'function isNaN(number: number): boolean'],
    ['Bun', 'Runtime Bun untuk server, env, file, dan utilitas lain.', 'const Bun: BunRuntime']
  ];

  const keywords = [
    ['const', 'Deklarasi binding yang tidak bisa di-reassign.', 'const nama = value'],
    ['let', 'Deklarasi variabel block-scoped.', 'let nama = value'],
    ['function', 'Deklarasi fungsi.', 'function nama() {}'],
    ['class', 'Deklarasi class.', 'class NamaClass {}'],
    ['interface', 'Kontrak struktur object di TypeScript.', 'interface NamaInterface {}'],
    ['type', 'Alias tipe di TypeScript.', 'type NamaType = ...'],
    ['extends', 'Pewarisan class atau perluasan interface.', 'class Anak extends Induk {}'],
    ['implements', 'Implementasi interface oleh class.', 'class Kelas implements Interface {}'],
    ['async', 'Menandai fungsi asynchronous.', 'async function nama() {}'],
    ['await', 'Menunggu Promise selesai di dalam async function.', 'const hasil = await promise'],
    ['try', 'Memulai blok penanganan error.', 'try { ... } catch (error) { ... }'],
    ['catch', 'Menangkap error dari blok try.', 'catch (error) { ... }'],
    ['return', 'Mengembalikan nilai dari fungsi.', 'return nilai']
  ];

  const globalLookup = new Map([...globals, ...keywords].map((item) => [item[0], item]));

  monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      const prefix = word.word.toLowerCase();
      const suggestions = [...globals, ...keywords]
        .filter(([label]) => !prefix || label.toLowerCase().startsWith(prefix))
        .map(([label, documentation, signature]) => ({
          label,
          kind: keywords.some((item) => item[0] === label)
            ? monaco.languages.CompletionItemKind.Keyword
            : monaco.languages.CompletionItemKind.Function,
          detail: signature,
          documentation,
          insertText: label,
          range
        }));

      return { suggestions };
    }
  });

  monaco.languages.registerHoverProvider(language, {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const item = globalLookup.get(word.word);
      if (!item) return null;

      const [label, documentation, signature] = item;
      return {
        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
        contents: [
          { value: `\`\`\`ts\n${signature}\n\`\`\`` },
          { value: `**${label}** - ${documentation}` }
        ]
      };
    }
  });
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
    ['clog', 'console.log(...)', 'console.log(${1:value});'],
    ['fn', 'function declaration', 'function ${1:namaFungsi}(${2:parameter}) {\n  ${3:// kode}\n}'],
    ['afn', 'arrow function', 'const ${1:namaFungsi} = (${2:parameter}) => {\n  ${3:// kode}\n};'],
    ['forof', 'for...of loop', 'for (const ${1:item} of ${2:items}) {\n  ${3:// kode}\n}'],
    ['trycatch', 'try/catch block', 'try {\n  ${1:// kode}\n} catch (${2:error}) {\n  console.error(${2:error});\n}'],
    ['asyncfn', 'async function', 'async function ${1:namaFungsi}(${2:parameter}) {\n  const ${3:hasil} = await ${4:promise};\n  return ${3:hasil};\n}'],
    ['fetchjson', 'fetch JSON', 'const response = await fetch("${1:https://example.com/api}");\nconst data = await response.json();\nconsole.log(data);'],
    ['class', 'class with constructor', 'class ${1:NamaClass} {\n  constructor(${2:parameter}) {\n    ${3:// inisialisasi}\n  }\n\n  ${4:method}() {\n    ${5:// kode}\n  }\n}'],
    ['interface', 'TypeScript interface', 'interface ${1:NamaInterface} {\n  ${2:properti}: ${3:string};\n}'],
    ['type', 'TypeScript type alias', 'type ${1:NamaType} = {\n  ${2:properti}: ${3:string};\n};'],
    ['bunserve', 'Bun.serve HTTP server', 'const server = Bun.serve({\n  port: ${1:3000},\n  fetch(request) {\n    return new Response("${2:Hello Bun!}");\n  }\n});\n\nconsole.log(`Server berjalan di http://localhost:${server.port}`);']
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
        suggestions: snippets.map(([label, detail, insertText]) => ({
          label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail,
          insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range
        }))
      };
    }
  });
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
