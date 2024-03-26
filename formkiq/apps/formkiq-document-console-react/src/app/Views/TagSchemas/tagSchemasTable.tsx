import {Link, NavLink, useLocation} from 'react-router-dom';
import {Edit, Trash} from '../../Components/Icons/icons';
import {formatDate} from '../../helpers/services/toolService';
import {TagSchema} from "../../helpers/types/tagSchemas";

type TagSchemaTableProps = {
  tagSchemas: TagSchema[];
  onTagSchemaDelete: (tagSchemaId: string) => void;
  showRulesetEditTab: (tagSchemaId: string) => void;
};

function TagSchemasTable({
                           tagSchemas,
                           onTagSchemaDelete,
                           showRulesetEditTab,
                         }: TagSchemaTableProps) {
  const pathname = decodeURI(useLocation().pathname);
  return (
    <table
      className="w-full border-collapse text-sm table-fixed "
      id="rulesetsTable"
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
          In Use
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
      {tagSchemas && tagSchemas.length > 0 ? (
        <>
          {tagSchemas.map((tagSchema: TagSchema) => {
            return (
              <tr key={tagSchema.tagSchemaId} className="text-neutral-900 border-neutral-300">
                <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate">
                  <Link
                    to={`${pathname}/${tagSchema.tagSchemaId}`}
                    className="cursor-pointer"
                  >
                    {tagSchema.name}
                  </Link>
                </td>
                <td className="border-b p-4 ">
                  {tagSchema.inUse ? <span className="text-green-500 font-medium">Yes</span> : "No"}
                </td>
                <td className="border-b p-4 ">
                  {formatDate(tagSchema.insertedDate)}
                </td>

                <td className="border-b border-neutral-300 p-4 pr-8">
                  <div className="flex items-center justify-end">
                    <NavLink
                      to={`/tag-schemas/${tagSchema.tagSchemaId}?editor=true`}
                      className="w-4 h-auto text-neutral-900  mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
                    >
                      <Edit/>
                    </NavLink>
                    <button
                      onClick={() => onTagSchemaDelete(tagSchema.tagSchemaId)}
                      className="w-3 h-auto text-neutral-900 mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
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
          <td colSpan={6} className="text-center p-2">
            No tag schemas have been added yet
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

export default TagSchemasTable;
