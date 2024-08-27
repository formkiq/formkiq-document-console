import { Edit, Trash } from '../../Components/Icons/icons';
import { Mapping } from '../../helpers/types/mappings';
import { Link, useLocation } from 'react-router-dom';

type MappingTableProps = {
  mappings: Mapping[];
  onMappingDelete: (mappingId: string) => void;
  showMappingEditTab: (mapping: Mapping) => void;
};

function MappingsTable({
  mappings,
  onMappingDelete,
  showMappingEditTab,
}: MappingTableProps) {
  const pathname = decodeURI(useLocation().pathname);
  return (
    <table className="w-full border-collapse text-sm table-fixed ">
      <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
        <tr>
          <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Name
          </th>
          <th className=" w-full border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Description
          </th>
          <th className=" w-full border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Attributes
          </th>
          <th className=" w-full border-b border-t p-4 pr-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {mappings && mappings.length > 0 ? (
          <>
            {mappings.map((mapping: Mapping) => {
              return (
                <tr
                  key={mapping.mappingId}
                  className="text-neutral-900 border-neutral-300"
                >
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate font-semibold">
                    <Link
                      title={mapping.name}
                      to={`${pathname}/${mapping.mappingId}`}
                      className="cursor-pointer hover:text-primary-500"
                    >
                      {mapping.name}
                    </Link>
                  </td>

                  <td className="border-b p-4">
                    <p style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                       title={mapping.description}
                    >
                      {mapping.description}
                      </p>
                  </td>
                  <td className="border-b p-4 ">
                    <div className="flex flex-wrap gap-2">
                    {mapping.attributes
                      .map((attr) => (
                        <div key={attr.attributeKey}
                             className="inline-block bg-neutral-100 rounded-full px-2 py-1 text-xs font-semibold"
                        >
                          {attr.attributeKey}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="border-b border-neutral-300 p-4 pr-8">
                    <div className="flex items-center justify-end gap-2 mr-3">
                      {/*<NavLink*/}
                      {/*  title="Open in editor"*/}
                      {/*  to={`/schemas/${mapping.mappingId}?editor=true`}*/}
                      {/*  className="h-6"*/}
                      {/*>*/}
                      {/*  <button*/}
                      {/*    className="w-6 h-auto"*/}
                      {/*    title="Open in JSON Editor"*/}
                      {/*  >*/}
                      {/*    <Json />*/}
                      {/*  </button>*/}
                      {/*</NavLink>*/}

                      <button
                        title="Edit"
                        className="w-4 h-auto text-neutral-900 cursor-pointer hover:text-primary-500 my-[3px]"
                        onClick={() => showMappingEditTab(mapping)}
                      >
                        <Edit />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => onMappingDelete(mapping.mappingId as string)}
                        className="w-4 h-auto text-neutral-900 cursor-pointer hover:text-primary-500 my-[3px]"
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
            <td colSpan={3} className="text-center p-2">
              No mappings have been added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default MappingsTable;
