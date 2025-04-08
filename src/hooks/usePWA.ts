import { useEffect } from 'react';
declare global {
  interface Window {
    workbox?: any;
  }
}

export const usePWA = () => {
  useEffect(() => {
    // Only run on client-side and if workbox is available
    if (typeof window === 'undefined' || !('serviceWorker' in navigator))
      return;

    const wb = window.workbox;
    if (!wb) return;

    const promptNewVersionAvailable = () => {
      if (confirm('A new version is available! Refresh to update?')) {
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });
        wb.messageSkipWaiting();
      }
    };

    wb.addEventListener('waiting', promptNewVersionAvailable);
    wb.addEventListener('externalwaiting', promptNewVersionAvailable);

    wb.register();

    // Cleanup function
    return () => {
      wb.removeEventListener('waiting', promptNewVersionAvailable);
      wb.removeEventListener('externalwaiting', promptNewVersionAvailable);
    };
  }, []); // Empty dependency array ensures this runs only once
};
