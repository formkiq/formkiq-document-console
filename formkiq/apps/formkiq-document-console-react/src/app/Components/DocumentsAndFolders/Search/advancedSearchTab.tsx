import { useLocation, useNavigate } from 'react-router-dom';
import DefaultSearchByAttributes from './defaultSearchByAttributes';
import OpensearchSearchByAttributes from './opensearchSearchByAttributes';
import TypesenseSearchByAttributes from './typesenseSearchByAttributes';

function AdvancedSearchTab({
  siteId,
  formkiqVersion,
  subfolderUri,
  infoDocumentId,
}: {
  siteId: string;
  formkiqVersion: any;
  subfolderUri: any;
  infoDocumentId: string;
}) {
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const advancedSearch = new URLSearchParams(search).get('advancedSearch');
  const pathname = decodeURI(useLocation().pathname);
  const navigate = useNavigate();

  const minimizeAdvancedSearch = () => {
    searchParams.set('advancedSearch', 'hidden');
    navigate(
      {
        pathname:
          pathname +
          '?' +
          searchParams.toString() +
          (infoDocumentId.length > 0 ? `#id=${infoDocumentId}` : ''),
      },
      {
        replace: true,
      }
    );
  };

  const closeAdvancedSearch = () => {
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
      {
        replace: true,
      }
    );
  };

  return (
    <div
      className={
        'w-full p-3 flex flex-col justify-between relative ' +
        (advancedSearch === 'hidden' && 'hidden')
      }
    >
      {!formkiqVersion.modules.includes('opensearch') &&
        !formkiqVersion.modules.includes('typesense') && (
          <DefaultSearchByAttributes
            siteId={siteId}
            formkiqVersion={formkiqVersion}
            subfolderUri={subfolderUri}
            minimizeAdvancedSearch={minimizeAdvancedSearch}
            closeAdvancedSearch={closeAdvancedSearch}
          />
        )}
      {formkiqVersion.modules.includes('opensearch') && (
        <OpensearchSearchByAttributes
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
          minimizeAdvancedSearch={minimizeAdvancedSearch}
          closeAdvancedSearch={closeAdvancedSearch}
        />
      )}
      {formkiqVersion.modules.includes('typesense') && (
        <TypesenseSearchByAttributes
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
          minimizeAdvancedSearch={minimizeAdvancedSearch}
          closeAdvancedSearch={closeAdvancedSearch}
        />
      )}
    </div>
  );
}

export default AdvancedSearchTab;
