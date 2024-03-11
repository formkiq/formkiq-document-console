import { useLocation } from 'react-router-dom';
import { Edit, Trash } from '../../Components/Icons/icons';
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
      <thead className="sticky top-0 bg-white z-10 pt-2 border-b nodark:border-slate-600">
        <tr>
          <th className="w-1/5 max-w-52 border-b nodark:border-slate-600 font-medium p-4 pl-8 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Description
          </th>
          <th className=" border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Priority
          </th>
          <th className=" border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Status
          </th>
          <th className="w-1/2 border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Conditions
          </th>
          <th className=" w-1/5 border-b nodark:border-slate-600 font-medium p-4 py-3 text-slate-400 nodark:text-slate-200 text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white nodark:bg-slate-800">
        {rules && rules.length > 0 ? (
          <>
            {rules.map((rule: Rule, index: number) => {
              return (
                <tr key={'rule_' + index}>
                  <td className="border-b max-w-52 border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400 truncate align-top">
                    {rule.description}
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400 align-top">
                    {rule.priority}
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400 align-top">
                    {rule.status}
                  </td>
                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400 align-top">
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

                  <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400 align-top">
                    <div className="flex items-center">
                      <button
                        onClick={() => editRule(rule)}
                        className="w-4 h-auto text-gray-400 mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
                      >
                        <Edit />
                      </button>

                      <button
                        onClick={() => onRuleDelete(rule.ruleId)}
                        className="w-3 h-auto text-gray-400 mr-3 cursor-pointer hover:text-primary-500 my-[3px]"
                      >
                        <Trash />
                      </button>

                      <a
                        href={pathname + '/rule/' + rule.ruleId}
                        className="w-4 h-auto text-gray-400 mr-3 cursor-pointer hover:text-primary-500 my-[3px] whitespace-nowrap"
                      >
                        Open in Editor
                      </a>
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
