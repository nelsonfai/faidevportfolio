'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics() {
  useEffect(() => {
    function trackClick(event) {
      if (!(event.target instanceof Element)) return;
      const action = event.target.closest('[data-analytics-click]');
      if (!action) return;

      window.umami?.track('portfolio_click', { action: action.dataset.analyticsClick });
    }

    function trackChecklistChange(event) {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || !input.dataset.checklistItem) return;

      window.umami?.track('checklist_toggle', {
        item: input.dataset.checklistItem,
        checked: input.checked,
        language: input.closest('[lang]')?.lang,
      });
    }

    document.addEventListener('click', trackClick, { capture: true, passive: true });
    document.addEventListener('change', trackChecklistChange);
    return () => {
      document.removeEventListener('click', trackClick, true);
      document.removeEventListener('change', trackChecklistChange);
    };
  }, []);

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="d9cef5f8-81f4-477a-a9d2-ee62f1056b6b"
      strategy="afterInteractive"
    />
  );
}
