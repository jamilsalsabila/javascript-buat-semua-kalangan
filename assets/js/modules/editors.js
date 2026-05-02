import { createCodeEditor } from './monaco.js';
import { isRunnableLanguage } from './transpiler.js';
import { getSnippetFilePath, registerSnippetEditor } from './snippets.js';
import { runCode, showRunnerError } from './runner.js';

export function enhanceCodeBlocks() {
  document.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    const language = [...(code?.classList || [])]
      .find((name) => name.startsWith('language-'))
      ?.replace('language-', '');

    if (!code || !isRunnableLanguage(language)) return;

    const filePath = getSnippetFilePath(pre);
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
    const adapter = createCodeEditor(editor, language, filePath);
    if (filePath) {
      registerSnippetEditor(filePath, adapter);
    }

    button.addEventListener('click', async () => {
      const currentCode = adapter.getValue();
      try {
        await runCode({
          source: currentCode,
          language,
          filePath,
          output
        });
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
  });
}
