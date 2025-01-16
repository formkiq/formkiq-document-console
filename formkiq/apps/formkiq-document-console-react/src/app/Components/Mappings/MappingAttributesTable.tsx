import { MappingAttribute } from '../../helpers/types/mappings';
import { Edit, Trash } from '../Icons/icons';

function MappingAttributesTable({
  attributes,
  onDelete,
  onEdit,
}: {
  attributes: MappingAttribute[];
  onDelete: (key: string) => void;
  onEdit: (attribute: MappingAttribute) => void;
}) {
  return (
    <table className="w-full border-collapse text-sm table-auto ">
      <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300 whitespace-nowrap">
        <tr>
          <th className="max-w-52 w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Key
          </th>
          <th className=" border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Default Value(s)
          </th>
          <th className="border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Source Type
          </th>
          <th className=" w-44 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Label Matching Type
          </th>
          <th className=" border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Label Texts
          </th>
          <th className=" border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Metadata Field
          </th>
          <th className=" border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Validation Regex
          </th>
          <th className=" border-b border-t p-4 pr-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-right"></th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {attributes && attributes.length > 0 ? (
          <>
            {attributes.map((attribute: MappingAttribute) => {
              return (
                <tr
                  key={attribute.attributeKey}
                  className="text-neutral-900 border-neutral-300"
                >
                  <td
                    className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate font-semibold"
                    title={attribute.attributeKey}
                  >
                    {attribute.attributeKey}
                  </td>
                  <td className="border-b p-4">
                    {Array.isArray(attribute?.defaultValues) ? (
                      <ul>
                        {attribute.defaultValues.map((value, index) => (
                          <li key={index}>{value}</li>
                        ))}
                      </ul>
                    ) : (
                      attribute?.defaultValue
                    )}
                  </td>
                  <td className="border-b p-4">{attribute.sourceType}</td>
                  <td className="border-b p-4 ">
                    {attribute.labelMatchingType}
                  </td>
                  <td className="border-b p-4 ">
                    {attribute?.labelTexts && attribute.labelTexts.join(', ')}
                  </td>
                  <td className="border-b p-4 ">{attribute.metadataField}</td>
                  <td className="border-b p-4 ">{attribute.validationRegex}</td>

                  <td className="border-b p-4 pr-8">
                    <div className="flex items-center justify-end gap-2 mr-3">
                      <button
                        title="Edit"
                        className="w-4 h-auto text-neutral-900 cursor-pointer hover:text-primary-500 my-[3px]"
                        onClick={() => onEdit(attribute)}
                      >
                        <Edit />
                      </button>

                      <button
                        disabled={attributes.length === 1}
                        title="Delete"
                        onClick={() => onDelete(attribute.attributeKey)}
                        className="w-4 h-auto text-neutral-900 cursor-pointer hover:text-primary-500 my-[3px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-neutral-900"
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </>
        ) : (
          <tr>
            <td colSpan={8} className="text-center p-2">
              No attributes have been added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default MappingAttributesTable;
