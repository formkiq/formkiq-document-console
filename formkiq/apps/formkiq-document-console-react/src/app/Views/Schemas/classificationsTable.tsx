import {Link, NavLink, useLocation} from 'react-router-dom';
import {Edit, Trash} from '../../Components/Icons/icons';
import {formatDate} from '../../helpers/services/toolService';
import {Classification} from '../../helpers/types/schemas';

type TagSchemaTableProps = {
  classifications: Classification[];
  onClassificationDelete: (name: string) => void;
  showClassificationEditTab: (name: string) => void;
};

function ClassificationsTable({
                        classifications,
                        onClassificationDelete,
                        showClassificationEditTab,
                      }: TagSchemaTableProps) {
  const pathname = decodeURI(useLocation().pathname);
  return (
    <table
      className="w-full border-collapse text-sm table-fixed "
    >
      <thead
        className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
      <tr>
        <th
          className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
          Name
        </th>
        <th
          className=" w-full border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
          Date
        </th>
        <th
          className=" w-full border-b border-t p-4 pr-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-right">
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
                key={classification.name}
                className="text-neutral-900 border-neutral-300"
              >
                <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate">
                  <Link
                    to={`${pathname}/${classification.name}`}
                    className="cursor-pointer"
                  >
                    {classification.name}
                  </Link>
                </td>

                <td className="border-b p-4 ">
                  {formatDate(classification.insertedDate)}
                </td>

                <td className="border-b border-neutral-300 p-4 pr-8">
                  <div className="flex items-center justify-end">
                    <NavLink
                      to={`/schemas/${classification.name}?editor=true`}
                      className="w-4 h-auto text-neutral-900  mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
                    >
                      <Edit/>
                    </NavLink>
                    <button
                      onClick={() => onClassificationDelete(classification.name)}
                      className="w-4 h-auto text-neutral-900 mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
                    >
                      <Trash/>
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
