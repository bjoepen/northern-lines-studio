import { mount, unmount } from 'svelte';
import CuratedChecklistPage from './CuratedChecklistPage.svelte';
import { curatedChecklistPages } from './curated-checklist';

const PAGE_BY_ID = new Map(curatedChecklistPages().map((page) => [page.id, page]));

type MountedChecklist = {
  component: ReturnType<typeof mount>;
  host: HTMLElement;
};

export function curatedChecklistPageForId(pageId: string | undefined) {
  return pageId ? PAGE_BY_ID.get(pageId) ?? null : null;
}

/**
 * Build 041 keeps the checklist as product-curated virtual pages rather than
 * persisting duplicate content into every .nls project. App.svelte already
 * exposes the resolved Studio page identity through data-studio-page-id; this
 * bounded host mounts the dedicated checklist view into that same A5 page.
 *
 * It is not a second renderer: Footer, Companion, World variables, A5 geometry
 * and PDF capture remain owned by the existing Studio page.
 */
export function installCuratedChecklistHost(root: HTMLElement): () => void {
  const mounted = new Map<HTMLElement, MountedChecklist>();

  const cleanupDetached = () => {
    for (const [article, entry] of mounted) {
      if (article.isConnected) continue;
      void unmount(entry.component);
      mounted.delete(article);
    }
  };

  const sync = () => {
    cleanupDetached();
    for (const article of root.querySelectorAll<HTMLElement>('.a5-page[data-studio-page-id]')) {
      const page = curatedChecklistPageForId(article.dataset.studioPageId);
      const existing = mounted.get(article);

      if (!page) {
        if (existing) {
          void unmount(existing.component);
          existing.host.remove();
          mounted.delete(article);
        }
        article.classList.remove('curated-checklist-page');
        continue;
      }

      article.classList.add('curated-checklist-page');
      if (existing) continue;

      const host = document.createElement('div');
      host.className = 'curated-checklist-runtime-host';
      article.prepend(host);
      const component = mount(CuratedChecklistPage, {
        target: host,
        props: { page }
      });
      mounted.set(article, { component, host });
    }
  };

  const observer = new MutationObserver(sync);
  observer.observe(root, { childList: true, subtree: true });
  sync();

  return () => {
    observer.disconnect();
    for (const entry of mounted.values()) void unmount(entry.component);
    mounted.clear();
  };
}
