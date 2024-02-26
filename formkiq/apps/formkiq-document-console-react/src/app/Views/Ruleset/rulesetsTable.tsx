import { Link, useLocation } from 'react-router-dom';
import { Edit, Trash } from '../../Components/Icons/icons';
import { formatDate } from '../../helpers/services/toolService';
import { Ruleset } from '../../helpers/types/rulesets';

type RulesetsTableProps = {
  rulesets: Ruleset[];
  onRulesetDelete: (rulesetId: string) => void;
  showRulesetEditTab: (rulesetId: string) => void;
};

function RulesetsTable({
  rulesets,
  onRulesetDelete,
  showRulesetEditTab,
}: RulesetsTableProps) {
  const pathname = decodeURI(useLocation().pathname);
  return (
    <table
      className="w-full border-collapse text-sm table-fixed "
      id="rulesetsTable"
    >
      <thead className="sticky top-0 bg-white z-10 pt-2 border-b nodark:border-slate-600">
        <tr>
          <th className="w-1/2 max-w-52 border-b nodark:border-slate-600 font-medium p-4 pl-8 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Description
          </th>
          <th className="w-36 border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Date
          </th>
          <th className=" border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Priority
          </th>
          <th className="border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Version
          </th>
          <th className=" border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Status
          </th>
          <th className=" border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white nodark:bg-slate-800">
        {rulesets && rulesets.length > 0 ? (
          <>
            {rulesets.map((ruleset: Ruleset) => {
              return (
                <tr key={ruleset.rulesetId}>
                  <td className="border-b max-w-52 border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400 truncate">
                    <Link
                      to={`${pathname}/${ruleset.rulesetId}`}
                      className="cursor-pointer"
                    >
                      {ruleset.description}
                    </Link>
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400">
                    {formatDate(ruleset.insertedDate)}
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400">
                    {ruleset.priority}
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400">
                    {ruleset.version}
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400">
                    {ruleset.status}
                  </td>

                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400">
                    <div className="flex items-center">
                      <button
                        onClick={() => showRulesetEditTab(ruleset.rulesetId)}
                        className="w-4 h-auto text-gray-400 mr-3 cursor-pointer hover:text-coreOrange-500 my-[3px]"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => onRulesetDelete(ruleset.rulesetId)}
                        className="w-3 h-auto text-gray-400 mr-3 cursor-pointer hover:text-coreOrange-500 my-[3px]"
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
            <td colSpan={6} className="text-center p-2">
              No Rulesets have been found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default RulesetsTable;
