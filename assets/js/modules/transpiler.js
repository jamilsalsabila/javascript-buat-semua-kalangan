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

export function isRunnableLanguage(language) {
  return language === 'typescript' || language === 'javascript' || language === 'js';
}

export function transpileRunnableCode(code, language, fileName = 'editor.ts') {
  if (language === 'typescript') {
    return transpileTypescript(code, {
      fileName,
      moduleKind: window.ts ? ts.ModuleKind.None : null
    });
  }
  if (language === 'javascript' || language === 'js') return code;
  return null;
}

export function transpileModuleCode(code, language, fileName = 'module.ts') {
  if (language === 'typescript') {
    return transpileTypescript(code, {
      fileName,
      moduleKind: window.ts ? ts.ModuleKind.ESNext : null
    });
  }
  if (language === 'javascript' || language === 'js') return code;
  return null;
}

function transpileTypescript(source, { fileName, moduleKind }) {
  if (!window.ts || moduleKind === null) return stripTypescript(source);

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: moduleKind,
      target: ts.ScriptTarget.ES2020,
      strict: false,
      esModuleInterop: true,
      importHelpers: false,
      removeComments: false
    },
    fileName,
    reportDiagnostics: true
  });

  const blockingDiagnostics = (transpiled.diagnostics || [])
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (blockingDiagnostics.length) {
    throw new Error(formatTypescriptDiagnostics(blockingDiagnostics, source, fileName));
  }

  return transpiled.outputText;
}

function formatTypescriptDiagnostics(diagnostics, source, fileName) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2020, true);
  return diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (typeof diagnostic.start !== 'number') return `TypeScript: ${message}`;

    const position = sourceFile.getLineAndCharacterOfPosition(diagnostic.start);
    return `${fileName} (${position.line + 1}:${position.character + 1}): ${message}`;
  }).join('\n');
}
