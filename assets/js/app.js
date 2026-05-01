(function () {
  const PROGRESS_KEY = 'js-everybody:last-read';
  const toc = document.querySelector('#daftar-isi');

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
    if (language === 'typescript') return stripTypescript(code);
    if (language === 'javascript' || language === 'js') return code;
    return null;
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
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
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
      const runnerSource = code ? runnableCode(code.textContent, language) : null;
      if (!runnerSource) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-runner';
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

      button.addEventListener('click', () => {
        executeCode(runnerSource, output);
      });
      closeButton.addEventListener('click', () => {
        output.classList.remove('is-visible', 'is-error');
      });

      actions.appendChild(button);
      pre.after(wrapper);
      wrapper.append(actions, output);
    });
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
