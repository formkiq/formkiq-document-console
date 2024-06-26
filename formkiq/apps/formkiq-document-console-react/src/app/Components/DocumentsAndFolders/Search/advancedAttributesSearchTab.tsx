import OpensearchSearchByAttributes from "./opensearchSearchByAttributes";
import TypesenseSearchByAttributes from "./typesenseSearchByAttributes";
import {useSearchParams} from "react-router-dom";

function AdvancedAttributesSearchTab({
                                       siteId,
                                       formkiqVersion,
                                       subfolderUri,
                                     }: {
  siteId: string,
  formkiqVersion: any,
  subfolderUri: any,
}) {

  const [searchParams, setSearchParams] = useSearchParams();

  const closeAdvancedSearch = () => {
    searchParams.delete('advancedAttributesSearch');
    setSearchParams(searchParams);
  };


  return (
    <div className="w-full h-56 p-4 flex flex-col justify-between relative">
      <div
        className="absolute flex w-full h-40 justify-center items-center font-bold text-5xl text-gray-100 mb-2 -z-10">
        Advanced Search
      </div>
      {
        formkiqVersion.modules.includes('opensearch') &&
        <OpensearchSearchByAttributes siteId={siteId}
                                      formkiqVersion={formkiqVersion}
                                      subfolderUri={subfolderUri}
                                      closeAdvancedSearch={closeAdvancedSearch}

        />}
      {
        // !formkiqVersion.modules.includes('typesense') && // TODO: uncomment
        <TypesenseSearchByAttributes siteId={siteId}
                                     formkiqVersion={formkiqVersion}
                                     subfolderUri={subfolderUri}
                                     closeAdvancedSearch={closeAdvancedSearch}
        />
      }
    </div>);
}

export default AdvancedAttributesSearchTab;
