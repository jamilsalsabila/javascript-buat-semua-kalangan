const PROGRESS_KEY = 'js-everybody:last-read';

export function initReaderUI() {
  const toc = document.querySelector('#daftar-isi');
  if (!toc) return;

  const chapters = collectSections();
  buildToc(toc, chapters);
  addBackToTocButton(toc);
  observeReadingProgress();
  restoreProgress();
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

function buildToc(toc, chapters) {
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

function addBackToTocButton(toc) {
  const button = document.createElement('a');
  button.href = `#${toc.id}`;
  button.className = 'back-to-toc';
  button.textContent = 'Daftar Isi';
  document.body.appendChild(button);
}

function ensureId(element, fallback) {
  if (!element.id) {
    element.id = slugify(element.textContent || fallback);
  }
  return element.id;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
