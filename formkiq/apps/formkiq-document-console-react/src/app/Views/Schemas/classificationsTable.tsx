import { Link, NavLink, useLocation } from 'react-router-dom';
import { Edit, Json, Trash } from '../../Components/Icons/icons';
import { formatDate } from '../../helpers/services/toolService';
import { Classification } from '../../helpers/types/schemas';

type TagSchemaTableProps = {
  classifications: Classification[];
  onClassificationDelete: (classificationId: string) => void;
  showClassificationEditTab: (classificationId: string) => void;
};

function ClassificationsTable({
  classifications,
  onClassificationDelete,
  showClassificationEditTab,
}: TagSchemaTableProps) {
  const pathname = decodeURI(useLocation().pathname);
  return (
    <table className="w-full border-collapse text-sm table-fixed ">
      <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
        <tr>
          <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Name
          </th>
          <th className=" w-full border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Date
          </th>
          <th className=" w-full border-b border-t p-4 pr-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {classifications && classifications.length > 0 ? (
          <>
            {classifications.map((classification: Classification) => {
              return (
                <tr
                  key={classification.classificationId}
                  className="text-neutral-900 border-neutral-300"
                >
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate">
                    <Link
                      to={`${pathname}/${classification.classificationId}`}
                      className="cursor-pointer hover:text-primary-500"
                    >
                      {classification.name}
                    </Link>
                  </td>

                  <td className="border-b p-4 ">
                    {formatDate(classification.insertedDate)}
                  </td>

                  <td className="border-b border-neutral-300 p-4 pr-8">
                    <div className="flex items-center justify-end gap-2 mr-3">
                      <NavLink
                        title="Open in editor"
                        to={`${pathname}/${classification.classificationId}?editor=true`}
                        className="h-6"
                      >
                        <button
                          className="w-6 h-auto"
                          title="Open in JSON Editor"
                        >
                          <Json />
                        </button>
                      </NavLink>

                      <button
                        title="Edit"
                        className="w-4 h-auto text-neutral-900 cursor-pointer hover:text-primary-500 my-[3px]"
                        onClick={() =>
                          showClassificationEditTab(
                            classification.classificationId
                          )
                        }
                      >
                        <Edit />
                      </button>

                      <button
                        title="Delete"
                        onClick={() =>
                          onClassificationDelete(
                            classification.classificationId
                          )
                        }
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
              No classifications have been added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ClassificationsTable;
