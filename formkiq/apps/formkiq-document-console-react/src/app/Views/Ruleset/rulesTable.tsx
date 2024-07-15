import { useLocation } from 'react-router-dom';
import { Edit, Json, Trash } from '../../Components/Icons/icons';
import { Rule } from '../../helpers/types/rulesets';

type RulesTableProps = {
  rules: Rule[];
  onRuleDelete: (ruleId: string) => void;
  showRuleEditTab: (rulesetId: string) => void;
  setNewRuleValue: (newValue: { rule: Rule }) => void;
};

function RulesTable({
  rules,
  onRuleDelete,
  showRuleEditTab,
  setNewRuleValue,
}: RulesTableProps) {
  const { pathname } = useLocation();

  const editRule = (rule: Rule) => {
    showRuleEditTab(rule.ruleId);
    setNewRuleValue({ rule: rule });
  };

  return (
    <table
      className="w-full border-collapse text-sm table-fixed "
      id="rulesetsTable"
    >
      <thead className="sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t font-bold text-transparent text-left border-neutral-300">
        <tr>
          <th className="w-1/5 max-w-52 border-b border-t border-neutral-300  p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Description
          </th>
          <th className=" border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Priority
          </th>
          <th className=" border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Status
          </th>
          <th className="w-1/2 border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Conditions
          </th>
          <th className=" w-1/5 border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white nodark:bg-slate-800">
        {rules && rules.length > 0 ? (
          <>
            {rules.map((rule: Rule, index: number) => {
              return (
                <tr
                  key={'rule_' + index}
                  className="text-neutral-900 align-top"
                >
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 ">
                    {rule.description}
                  </td>
                  <td className="border-b border-neutral-300 p-4 ">
                    {rule.priority}
                  </td>
                  <td className="border-b border-neutral-300 p-4 ">
                    {rule.status}
                  </td>
                  <td className="border-b border-neutral-300 p-4 ">
                    {rule.conditions.must.length > 0 &&
                      rule.conditions.must.map((condition, index) => {
                        return (
                          <div className=" truncate" key={'condition_' + index}>
                            {condition.attribute} - <i>{condition.fieldName}</i>
                            &nbsp;
                            <b>{condition.operation}</b> "{condition.value}"
                          </div>
                        );
                      })}
                  </td>

                  <td className="border-b border-neutral-300 p-4 pr-8 ">
                    <div className="flex items-center">
                      <button
                        onClick={() => editRule(rule)}
                        className="w-4 h-auto mr-3 hover:text-primary-500 my-[3px]"
                      >
                        <Edit />
                        <span className="sr-only">Edit</span>
                      </button>

                      <a
                        href={pathname + '/rule/' + rule.ruleId}
                        className="w-5 h-auto font-bold mr-3 cursor-pointer hover:text-primary-500 my-[3px] whitespace-nowrap"
                      >
                        <Json />
                      </a>

                      <button
                        onClick={() => onRuleDelete(rule.ruleId)}
                        className="w-4 h-auto mr-3 hover:text-primary-500 my-[3px]"
                      >
                        <Trash />
                        <span className="sr-only">Delete</span>
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
              No Rules have been found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default RulesTable;
