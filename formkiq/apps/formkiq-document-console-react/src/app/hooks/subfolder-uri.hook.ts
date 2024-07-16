import { useParams } from 'react-router-dom';

/**
 * Convenience hook for accessing the current subfolder path
 *
 * @returns current subfolder path
 */
export const useSubfolderUri = () => {
  const params = useParams();
  const subfolderUri = params['*'] || '';

  return subfolderUri;
};
