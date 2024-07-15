import { Link, useLocation } from 'react-router-dom';
import { Edit, Rules, Trash } from '../../Components/Icons/icons';
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
      <thead className="sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
        <tr>
          <th className="w-1/2 max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Description
          </th>
          <th className="w-36 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Date
          </th>
          <th className=" border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Priority
          </th>
          <th className="border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Version
          </th>
          <th className="border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Status
          </th>
          <th className="border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {rulesets && rulesets.length > 0 ? (
          <>
            {rulesets.map((ruleset: Ruleset) => {
              return (
                <tr
                  key={ruleset.rulesetId}
                  className="text-neutral-900 border-neutral-300 hover:bg-neutral-100 hover:font-medium"
                >
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate">
                    <div className="flex grow w-full justify-start">
                      <Link
                        to={`${pathname}/${ruleset.rulesetId}`}
                        className="cursor-pointer w-full"
                      >
                        {ruleset.description}
                      </Link>
                    </div>
                  </td>
                  <td className="border-b p-4 border-neutral-300">
                    {formatDate(ruleset.insertedDate)}
                  </td>
                  <td className="border-b p-4 border-neutral-300">
                    {ruleset.priority}
                  </td>
                  <td className="border-b p-4 border-neutral-300">
                    {ruleset.version}
                  </td>
                  <td className="border-b p-4 border-neutral-300">
                    {ruleset.status}
                  </td>

                  <td className="border-b border-neutral-300 p-4 pr-8 ">
                    <div className="flex items-center">
                      <button
                        onClick={() => showRulesetEditTab(ruleset.rulesetId)}
                        className="w-4 h-auto text-neutral-900  mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
                      >
                        <Edit />
                      </button>
                      <Link
                        to={`${pathname}/${ruleset.rulesetId}`}
                        className="cursor-pointer w-6 h-auto mr-2"
                      >
                        <Rules />
                      </Link>
                      <button
                        onClick={() => onRulesetDelete(ruleset.rulesetId)}
                        className="w-4 h-auto text-neutral-900 mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
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
