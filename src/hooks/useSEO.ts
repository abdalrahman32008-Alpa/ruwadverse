import { useEffect } from 'react';

export const useSEO = (title: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Ruwadverse`;

    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content');

    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description);

    return () => {
      document.title = prevTitle;
      if (prevDescription && metaDescription) {
        metaDescription.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
};
