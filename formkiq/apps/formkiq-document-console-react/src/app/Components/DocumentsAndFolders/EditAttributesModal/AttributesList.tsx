import {DocumentAttribute} from "../../../helpers/types/attributes";
import {useEffect, useState} from "react";

function AttributesList({attributes,handleScroll}:{attributes: DocumentAttribute[],handleScroll:(event:any)=>void}) {

// const [tempAttributes, setTempAttributes] = useState<DocumentAttribute[]>([]);
//
//   useEffect(() => {
//     if (!attributes || attributes.length === 0) {
//         return;
//     }
//     const temp: DocumentAttribute[] = [];
//     for (let i = 0; i < 30; i++) {
//       temp.push(attributes[0]);
//     }
//     setTempAttributes(temp);
//
//   }, [attributes]);


  return (
    <div>
      {attributes.length > 0? (
        <div className="overflow-auto max-h-64" onScroll={handleScroll}>
          <table className="border-collapse table-auto w-full text-sm" id="documentAttributesScrollPane" >
            <thead className="sticky top-0 bg-white">
            <tr>
              <th
                className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Key
              </th>
              <th
                className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Value
              </th>
            </tr>
            </thead>

            <tbody className="bg-white nodark:bg-slate-800">

            {attributes.map((attribute, index) => (
                <tr key={index}>
                    <td className="p-4 text-start w-52 truncate">{attribute.key}</td>
                  {attribute?.stringValue && <td className="p-4 text-start">{attribute.stringValue}</td>}
                  {attribute?.stringValues && <td className="p-4 text-start">{attribute.stringValues.join(', ')}</td>}
                  {attribute?.numberValue && <td className="p-4 text-start">{attribute.numberValue}</td>}
                  {attribute?.numberValues && <td className="p-4 text-start">{attribute.numberValues.join(', ')}</td>}
                  {attribute?.booleanValue && <td className="p-4 text-start">{attribute.booleanValue ? 'true' : 'false'}</td>}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div role="status">
            <div className="overflow-x-auto relative">No metadata found</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttributesList;
