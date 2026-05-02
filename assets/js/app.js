import { enhanceCodeBlocks } from './modules/editors.js';
import { initReaderUI } from './modules/reader.js';
import { hydrateSnippetBlocks } from './modules/snippets.js';

document.addEventListener('DOMContentLoaded', async () => {
  initReaderUI();

  try {
    await hydrateSnippetBlocks();
  } catch (error) {
    console.warn('Snippet manifest tidak berhasil dimuat, menggunakan kode inline sebagai fallback.', error);
  }

  enhanceCodeBlocks();
});
