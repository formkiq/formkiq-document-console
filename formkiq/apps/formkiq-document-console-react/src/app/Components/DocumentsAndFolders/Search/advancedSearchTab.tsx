import { useLocation } from 'react-router-dom';
import DefaultSearchByAttributes from './defaultSearchByAttributes';
import OpensearchSearchByAttributes from './opensearchSearchByAttributes';
import TypesenseSearchByAttributes from './typesenseSearchByAttributes';

function AdvancedSearchTab({
  siteId,
  formkiqVersion,
  subfolderUri,
}: {
  siteId: string;
  formkiqVersion: any;
  subfolderUri: any;
}) {
  const search = useLocation().search;
  const advancedSearch = new URLSearchParams(search).get('advancedSearch');

  return (
    <div
      className={
        'w-full p-3 flex flex-col justify-between relative ' +
        (advancedSearch === 'hidden' && 'hidden')
      }
    >
      <div className="absolute flex w-full h-full justify-center items-center font-bold text-5xl text-gray-100 mb-2 -z-10">
        Search
      </div>
      {!formkiqVersion.modules.includes('opensearch') &&
        !formkiqVersion.modules.includes('typesense') && (
          <DefaultSearchByAttributes
            siteId={siteId}
            formkiqVersion={formkiqVersion}
            subfolderUri={subfolderUri}
          />
        )}
      {formkiqVersion.modules.includes('opensearch') && (
        <OpensearchSearchByAttributes
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
        />
      )}
      {formkiqVersion.modules.includes('typesense') && (
        <TypesenseSearchByAttributes
          siteId={siteId}
          formkiqVersion={formkiqVersion}
          subfolderUri={subfolderUri}
        />
      )}
    </div>
  );
}

export default AdvancedSearchTab;
