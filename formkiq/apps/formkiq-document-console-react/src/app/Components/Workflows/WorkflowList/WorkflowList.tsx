import { CopyButton } from '../../../Components/Generic/Buttons/CopyButton';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import { Edit, Plus, Trash, View } from '../../Icons/icons';
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
  const dispatch = useAppDispatch();
  const onDeleteClick = (workflowId: string, siteId: string) => () => {
    onDelete(workflowId, siteId);
  };

  const createNewWorkflow = () => {
    const workflow = {
      name: 'New Workflow',
      description: 'New Workflow Description',
      status: 'ACTIVE',
      steps: [],
    };

    DocumentsService.addWorkflow(workflow, siteId).then((response) => {
      if (!response.workflowId) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Something went wrong. Please try again later',
          })
        );
      }

      window.location.href =
        siteId === 'default'
          ? `/workflows/designer?workflowId=${response.workflowId}`
          : `/workspaces/${siteId}/workflows/designer?workflowId=${response.workflowId}`;
    });
  };

  return (
    <>
      {!isSiteReadOnly && (
        <div className="mt-4 flex px-4">
          <ButtonPrimaryGradient
            data-test-id="create-workflow"
            onClick={createNewWorkflow}
            className="flex items-center"
            style={{ height: '36px' }}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </ButtonPrimaryGradient>
          <button
            className="flex hidden bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold rounded-2xl flex cursor-pointer focus:outline-none py-2 px-4"
            data-test-id="create-workflow"
            onClick={(event) => onNewClick(event, siteId)}
          >
            <span>Create new (OLD)</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </button>
        </div>
      )}
      <div className="mt-4 mb-8">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-100 border-neutral-300 font-bold  text-transparent text-left ">
            <tr>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                ID
              </th>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Name
              </th>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Description
              </th>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                In Use?
              </th>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
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
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
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
                            <CopyButton value={workflow.workflowId} />
                          </span>
                        </span>
                      </td>
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                        {workflow.description}
                      </td>
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                        {workflow.inUse ? <span>Yes</span> : <span>No</span>}
                      </td>
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4 pr-8 text-neutral-900 nodark:text-slate-400">
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
                                  <View />
                                  <span className="sr-only">View</span>
                                </>
                              ) : (
                                <>
                                  <Edit />
                                  <span className="sr-only">Edit</span>
                                </>
                              )}
                            </div>
                          </a>
                          {!workflow.inUse && (
                            <button
                              onClick={onDeleteClick(
                                workflow.workflowId,
                                siteId
                              )}
                              data-test-id="delete-workflow"
                              className="ml-2"
                            >
                              <div className="h-5 hover:text-primary-500 transition duration-100">
                                <Trash />
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
