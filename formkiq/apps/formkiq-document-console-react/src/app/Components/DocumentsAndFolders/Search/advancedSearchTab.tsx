import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultSearchByAttributes from './defaultSearchByAttributes';
import OpensearchSearchByAttributes from './opensearchSearchByAttributes';
import TypesenseSearchByAttributes from './typesenseSearchByAttributes';

interface AdvancedSearchTabProps {
  siteId: string;
  formkiqVersion: any;
  subfolderUri: any;
  infoDocumentId: string;
}

function AdvancedSearchTab({
  siteId,
  formkiqVersion,
  subfolderUri,
  infoDocumentId,
}: AdvancedSearchTabProps): JSX.Element {
  const [searchType, setSearchType] = useState<'simplified' | 'enhanced'>(
    'enhanced'
  );
  const location = useLocation();
  const navigate = useNavigate();

  const search = location.search;
  const searchParams = new URLSearchParams(search);
  const advancedSearch = searchParams.get('advancedSearch');
  const pathname = decodeURI(location.pathname);

  const minimizeAdvancedSearch = (): void => {
    searchParams.set('advancedSearch', 'hidden');
    navigate(
      {
        pathname:
          pathname +
          '?' +
          searchParams.toString() +
          (infoDocumentId.length > 0 ? `#id=${infoDocumentId}` : ''),
      },
      { replace: true }
    );
  };

  const closeAdvancedSearch = (): void => {
    searchParams.delete('advancedSearch');
    searchParams.delete('searchWord');
    navigate(
      {
        pathname:
          pathname +
          (searchParams.toString().length > 0
            ? '?' + searchParams.toString()
            : '') +
          (infoDocumentId.length > 0 ? `#id=${infoDocumentId}` : ''),
      },
      { replace: true }
    );
  };

  // When typesense is enabled, only Typesense search is used.
  if (formkiqVersion.modules.includes('typesense')) {
    return (
      <div
        className={
          'w-full p-3 flex flex-col justify-between relative ' +
          (advancedSearch === 'hidden' ? 'hidden' : '')
        }
      >
        <TypesenseSearchByAttributes
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
          minimizeAdvancedSearch={minimizeAdvancedSearch}
          closeAdvancedSearch={closeAdvancedSearch}
        />
      </div>
    );
  }

  // Determine which search component to show based on drop‑down selection.
  let searchComponent;
  if (formkiqVersion.modules.includes('opensearch')) {
    searchComponent =
      searchType === 'simplified' ? (
        <DefaultSearchByAttributes
          key="simplified"
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
          minimizeAdvancedSearch={minimizeAdvancedSearch}
          closeAdvancedSearch={closeAdvancedSearch}
          searchType={searchType}
        />
      ) : (
        <OpensearchSearchByAttributes
          key="enhanced"
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
          minimizeAdvancedSearch={minimizeAdvancedSearch}
          closeAdvancedSearch={closeAdvancedSearch}
          searchType={searchType}
        />
      );
  } else {
    // If opensearch is not enabled, only default is available.
    searchComponent = (
      <DefaultSearchByAttributes
        key="default"
        siteId={siteId}
        formkiqVersion={formkiqVersion}
        subfolderUri={subfolderUri}
        minimizeAdvancedSearch={minimizeAdvancedSearch}
        closeAdvancedSearch={closeAdvancedSearch}
        searchType={searchType}
      />
    );
  }

  return (
    <div
      className={
        'w-full p-3 flex flex-col justify-between relative ' +
        (advancedSearch === 'hidden' ? 'hidden' : '')
      }
    >
      {formkiqVersion.modules.includes('opensearch') && (
        <div className="mb-2 text-sm">
          <label htmlFor="search-toggle" className="mr-2">
            Search Type:
          </label>
          <select
            id="search-toggle"
            value={searchType}
            onChange={(e) =>
              setSearchType(e.target.value as 'simplified' | 'enhanced')
            }
          >
            <option value="enhanced">Enhanced Search</option>
            <option value="simplified">Simplified Search</option>
          </select>
        </div>
      )}
      {searchComponent}
    </div>
  );
}

export default AdvancedSearchTab;
