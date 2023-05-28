import { useLocation } from 'react-router-dom';

/**
 * Convenience hook for accessing the current subfolder path
 *
 * @returns current subfolder path
 */
export const useSubfolderUri = () => {
  const location = useLocation();

  const folderIndex = location.pathname.indexOf('/folders/');

  if (folderIndex > 0) {
    return location.pathname.substring(folderIndex + 9); //9 is the length of /folders/
  }

  return '';
};
