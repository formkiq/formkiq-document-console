import {DocumentAttribute} from "../../../helpers/types/attributes";
import {Pencil, Trash} from "../../Icons/icons";
import {useEffect, useState} from "react";

function AttributesList({
                          attributes,
                          handleScroll,
                          deleteDocumentAttribute,
                          editAttribute
                        }: {
  attributes: DocumentAttribute[],
  handleScroll: (event: any) => void,
  deleteDocumentAttribute: (key: string) => void,
  editAttribute: (key: string, value: any) => void
}) {

  const [editAttributeKey, setEditAttributeKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);

  const handleEditAttribute = (attribute: DocumentAttribute) => {
    setEditAttributeKey(attribute.key);
    const value = attribute?.stringValue || attribute?.stringValues || attribute?.numberValue || attribute?.numberValues || attribute?.booleanValue
    setEditValue(value);
  }

  return (
    <div>
      {attributes.length > 0 ? (
        <div className="overflow-auto max-h-64" onScroll={handleScroll}>
          <table className="border border-neutral-300 border-collapse table-auto w-full text-sm" id="documentAttributesScrollPane">
            <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100">
            <tr>
              <th
                className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Key
              </th>
              <th
                className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Value
              </th>
              <th></th>
            </tr>
            </thead>

            <tbody className="bg-white nodark:bg-slate-800">

            {attributes.map((attribute, index) => (
              <tr key={index} className="border-t border-neutral-300">
                <td className="p-4 text-start w-52 truncate">{attribute.key}</td>
                {attribute?.stringValue && <td className="p-4 text-start">{attribute.stringValue}</td>}
                {attribute?.stringValues && <td className="p-4 text-start">{attribute.stringValues.join(', ')}</td>}
                {attribute?.numberValue && <td className="p-4 text-start">{attribute.numberValue}</td>}
                {attribute?.numberValues && <td className="p-4 text-start">{attribute.numberValues.join(', ')}</td>}
                {attribute?.booleanValue !== undefined &&
                  <td className="p-4 text-start">{attribute.booleanValue ? 'true' : 'false'}</td>}
                <td className="p-4 text-end">
                  <button className="w-4 h-4 hover:text-primary-500 mr-2" type="button"
                          onClick={() => handleEditAttribute(attribute)}>
                    <Pencil/>
                  </button>
                  <button className="w-4 h-4 hover:text-primary-500 mr-2" type="button"
                          onClick={() => deleteDocumentAttribute(attribute.key)}>
                    <Trash/>
                  </button>
                </td>
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
