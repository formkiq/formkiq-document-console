import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import WorkflowsActionsPopover from './workflowActionsPopover';

import { CopyButton } from '../../../Components/Generic/Buttons/CopyButton';
import { Edit, Plus, View } from '../../Icons/icons';
type Props = {
  siteId: string;
  isSiteReadOnly: boolean;
  onNewClick: any;
  workflows: null | [];
  onDelete: (workflowId: string, siteId: string) => void;
  handleDuplicateClick: (workflowId: string, siteId: string) => void;
  handleCopyToClipBoard: (workflowId: string, siteId: string) => void;
  showTooltipId: string;
  handleDownloadClick: (workflowId: string, siteId: string) => void;
  // importWorkflow: any
};

export function WorkflowList({
  siteId,
  isSiteReadOnly,
  onNewClick,
  workflows,
  onDelete,
  handleDuplicateClick,
  handleCopyToClipBoard,
  showTooltipId,
  handleDownloadClick,
}: // importWorkflow,
Props) {
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

  const isValidString = (text: string) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const importWorkflow = (event: any) => {
    console.log('importing');
    const reader = new FileReader();
    reader.readAsText(event.target.files[0], 'UTF-8');
    reader.onload = (e) => {
      if (!isValidString(e.target?.result as string)) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Invalid JSON',
          })
        );
        event.target.value = '';
        return;
      }
      const workflow = JSON.parse(e.target?.result as string);
      DocumentsService.addWorkflow(workflow, siteId).then((response) => {
        if (!response.workflowId) {
          dispatch(
            openNotificationDialog({
              dialogTitle: response.errors[0].error,
            })
          );
          event.target.value = '';
          return;
        }

        window.location.href =
          siteId === 'default'
            ? `/workflows/designer?workflowId=${response.workflowId}`
            : `/workspaces/${siteId}/workflows/designer?workflowId=${response.workflowId}`;
        event.target.value = '';
      });
    };
  };

  return (
    <>
      {!isSiteReadOnly && (
        <div className="mt-4 flex px-4 gap-2">
          <ButtonPrimaryGradient
            data-test-id="create-workflow"
            onClick={createNewWorkflow}
            className="flex items-center"
            style={{ height: '36px' }}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </ButtonPrimaryGradient>
          <input
            type="file"
            id={'import-workflow' + siteId}
            accept=".json"
            className="hidden"
            onChange={importWorkflow}
          />
          <label
            htmlFor={'import-workflow' + siteId}
            className="h-9 bg-white text-neutral-900 border border-primary-500 px-4 font-bold whitespace-nowrap hover:text-primary-500 transition duration-100 rounded-md flex items-center justify-center"
          >
            <span>Import (JSON)</span>
          </label>
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
                          <div className="h-5 hover:text-primary-500 transition duration-100 pr-2">
                            <a
                              href={
                                siteId === 'default'
                                  ? `/workflows/designer?workflowId=${workflow.workflowId}`
                                  : `/workspaces/${siteId}/workflows/designer?workflowId=${workflow.workflowId}`
                              }
                              data-test-id="delete-workflow"
                            >
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
                            </a>
                          </div>
                          <WorkflowsActionsPopover
                            workflow={workflow}
                            siteId={siteId}
                            handleDuplicateClick={handleDuplicateClick}
                            handleCopyToClipBoard={handleCopyToClipBoard}
                            handleDownloadClick={handleDownloadClick}
                            onDeleteClick={onDeleteClick}
                            showTooltipId={showTooltipId}
                          />
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
