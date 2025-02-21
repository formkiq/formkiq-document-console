import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AuthState } from '../../../Store/reducers/auth';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../../helpers/services/toolService';
import SearchInput from './searchInput';

interface SearchLineProps {
  siteId: string;
  onSearch: (inputValue?: string) => void;
  updateInputValue: (value: string) => void;
  inputValue: string;
  searchType?: 'simplified' | 'enhanced';
}

function SearchLine({
  siteId,
  onSearch,
  updateInputValue,
  inputValue,
  searchType = 'simplified',
}: SearchLineProps) {
  const { user } = useSelector(AuthState);
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteDocumentsRootUri } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
  }, [pathname]);

  const handleKeyDown = (ev: any) => {
    if (inputValue) {
      if (ev.key === 'Enter') {
        onSearch(inputValue);
      }
    }
  };

  return (
    <div className="flex items-center gap-5 w-1/3">
      <SearchInput
        onChange={(e: any) => updateInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        siteId={siteId}
        documentsRootUri={currentDocumentsRootUri}
        value={inputValue}
        expandAdvancedSearch={() => {}}
        searchType={searchType ?? 'simplified'}
      />
    </div>
  );
}

export default SearchLine;
