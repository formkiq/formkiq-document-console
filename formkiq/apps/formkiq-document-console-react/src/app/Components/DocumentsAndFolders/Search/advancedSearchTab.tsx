import OpensearchSearchByAttributes from "./opensearchSearchByAttributes";
import TypesenseSearchByAttributes from "./typesenseSearchByAttributes";
import {useLocation, useSearchParams} from "react-router-dom";
import DocumentsSearch from "./defaultSearchByAttributes";

function AdvancedSearchTab({
                                       siteId,
                                       formkiqVersion,
                                       subfolderUri,
                                     }: {
  siteId: string,
  formkiqVersion: any,
  subfolderUri: any,
}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const search = useLocation().search;
  const advancedSearch = new URLSearchParams(search).get('advancedSearch');

  const closeAdvancedSearch = () => {
    searchParams.delete('advancedSearch');
    setSearchParams(searchParams);
  };


  return (
    <div className={"w-full h-56 p-4 flex flex-col justify-between relative "+(advancedSearch==='hidden' &&'hidden')}>
      <div
        className="absolute flex w-full h-40 justify-center items-center font-bold text-5xl text-gray-100 mb-2 -z-10">
        Search
      </div>
      {
        !formkiqVersion.modules.includes('opensearch') &&
        !formkiqVersion.modules.includes('typesense') &&
        <DocumentsSearch siteId={siteId}
                         formkiqVersion={formkiqVersion}
                         subfolderUri={subfolderUri}
                         closeAdvancedSearch={closeAdvancedSearch}
        />
      }
      {
        formkiqVersion.modules.includes('opensearch') &&
        <OpensearchSearchByAttributes siteId={siteId}
                                      formkiqVersion={formkiqVersion}
                                      subfolderUri={subfolderUri}

        />}
      {
        formkiqVersion.modules.includes('typesense') &&
        <TypesenseSearchByAttributes siteId={siteId}
                                     formkiqVersion={formkiqVersion}
                                     subfolderUri={subfolderUri}
                                     closeAdvancedSearch={closeAdvancedSearch}
        />
      }

    </div>);
}

export default AdvancedSearchTab;
