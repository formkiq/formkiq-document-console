import {CopyButton} from '../../../Components/Generic/Buttons/CopyButton';
import {Edit, Trash, View} from '../../Icons/icons';

type Props = {
  siteId: string;
  workflows: null | [];
  onDelete: (workflowId: string, siteId: string) => void;
  handleScroll: (event: any) => void;
};

export function WorkflowList({
                               siteId,
                               workflows,
                               onDelete,
                               handleScroll
                             }: Props) {

  return (
    <>
      <div
        className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full w-full"
        onScroll={handleScroll}>
        <table
          className="w-full border-collapse text-sm table-auto "
          id="workflowsScrollPane"
        >
          <thead className="sticky top-0 bg-neutral-100 z-10 text-left text-transparent">
          <tr>
            <th
              className="w-1/3 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Name, ID
            </th>
            <th
              className="w-1/3 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Description
            </th>
            <th
              className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              In Use?
            </th>
            <th
              className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
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
                    <td
                      className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                      <a
                        href={
                          siteId === 'default'
                            ? `/workflows/designer?workflowId=${workflow.workflowId}`
                            : `/workspaces/${siteId}/workflows/designer?workflowId=${workflow.workflowId}`
                        }
                        className="w-full h-full px-4 py-1 block"
                      >
                        {workflow.name}
                      </a>
                      <span className="block pl-4 text-xs">
                          {workflow.workflowId}
                        <span className="pl-2">
                            <CopyButton value={workflow.workflowId}/>
                          </span>
                        </span>
                    </td>
                    <td
                      className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                      {workflow.description}
                    </td>
                    <td
                      className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                      {workflow.inUse ? <span>Yes</span> : <span>No</span>}
                    </td>
                    <td
                      className="border-b border-neutral-300 nodark:border-slate-700 p-4 pr-8 text-neutral-900 nodark:text-slate-400">
                      <div className="flex items-center">
                        <a
                          href={
                            siteId === 'default'
                              ? `/workflows/designer?workflowId=${workflow.workflowId}`
                              : `/workspaces/${siteId}/workflows/designer?workflowId=${workflow.workflowId}`
                          }
                          data-test-id="delete-workflow"
                          className="ml-2"
                        >
                          <div className="h-5 hover:text-primary-500 transition duration-100">
                            {workflow.inUse ? (
                              <>
                                <View/>
                                <span className="sr-only">View</span>
                              </>
                            ) : (
                              <>
                                <Edit/>
                                <span className="sr-only">Edit</span>
                              </>
                            )}
                          </div>
                        </a>
                        {!workflow.inUse && (
                          <button
                            onClick={() => onDelete(
                              workflow.workflowId,
                              siteId
                            )}
                            data-test-id="delete-workflow"
                            className="ml-2"
                          >
                            <div className="h-5 hover:text-primary-500 transition duration-100">
                              <Trash/>
                              <span className="sr-only">Delete</span>
                            </div>
                          </button>
                        )}
                      </div>
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
