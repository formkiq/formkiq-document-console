import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Convenience hook for accessing the current subfolder path
 *
 * @returns current subfolder path
 */
export const useQueueId = () => {
  const location = useLocation();

  const queueId = useMemo(() => {
    const queueIndex = decodeURI(location.pathname).indexOf('/queues/');

    if (queueIndex > 0) {
      return decodeURI(location.pathname).substring(queueIndex + 8); //8 is the length of /queues/
    }

    return '';
  }, [location.pathname]);

  return queueId;
};
