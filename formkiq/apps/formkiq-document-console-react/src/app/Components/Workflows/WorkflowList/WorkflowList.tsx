import { Plus } from '../../Icons/icons';

type Props = {
  siteId: string;
  isSiteReadOnly: boolean;
  onNewClick: any;
  workflows: null | [];
  onDelete: (workflowId: string, siteId: string) => void;
};

export function WorkflowList({
  siteId,
  isSiteReadOnly,
  onNewClick,
  workflows,
  onDelete,
}: Props) {
  const onDeleteClick = (workflowId: string, siteId: string) => () => {
    onDelete(workflowId, siteId);
  };

  return (
    <>
      {!isSiteReadOnly && (
        <div className="mt-4 flex px-4">
          <button
            className="flex bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold rounded-2xl flex cursor-pointer focus:outline-none py-2 px-4"
            data-test-id="create-workflow"
            onClick={(event) => onNewClick(event, siteId)}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </button>
        </div>
      )}
      <div className="mt-4 mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/8 border-b nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                Name
              </th>
              <th className="w-1/8 border-b nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                Description
              </th>
              <th className="w-1/8 border-b nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white nodark:bg-slate-800">
            {workflows && (workflows as any).length ? (
              <>
                {(workflows as any).map((workflow: any, i: number) => {
                  return (
                    <tr key={i} data-test-id={`workflow-${workflow.name}`}>
                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400">
                        {workflow.name}
                      </td>
                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400">
                        {workflow.description}
                      </td>
                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400 flex">
                        <button className="mx-1 bg-gradient-to-l from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:via-rose-600 hover:to-red-700 text-white text-sm font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none">
                          View
                        </button>
                        <button
                          onClick={onDeleteClick(workflow.id, siteId)}
                          data-test-id="delete-workflow"
                          className="mx-1 bg-gradient-to-l from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:via-rose-600 hover:to-red-700 text-white text-sm font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-2">
                  No workflows have been found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default WorkflowList;
