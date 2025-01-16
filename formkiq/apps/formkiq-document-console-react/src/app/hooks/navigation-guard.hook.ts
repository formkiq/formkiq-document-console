import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function useNavigationGuard(shouldGuard: boolean) {
  const location = useLocation();
  useEffect(() => {
    if (!shouldGuard) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        'Are you sure you want to leave this page? All unsaved changes will be lost.';
      return 'Are you sure you want to leave this page? All unsaved changes will be lost.';
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Override history methods to add confirmation
    window.history.pushState = function (...args) {
      const confirmed = window.confirm(
        'Are you sure you want to leave this page? All unsaved changes will be lost.'
      );
      if (confirmed) {
        originalPushState.apply(this, args);
      }
    };

    window.history.replaceState = function (...args) {
      const confirmed = window.confirm(
        'Are you sure you want to leave this page? All unsaved changes will be lost.'
      );
      if (confirmed) {
        originalReplaceState.apply(this, args);
      }
    };

    // Add beforeunload listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Restore original history methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldGuard, location]);
}
