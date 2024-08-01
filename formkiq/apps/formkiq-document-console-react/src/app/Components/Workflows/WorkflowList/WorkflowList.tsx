import { CopyButton } from '../../../Components/Generic/Buttons/CopyButton';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Edit, View } from '../../Icons/icons';
import WorkflowsActionsPopover from './workflowActionsPopover';

type Props = {
  siteId: string;
  workflows: null | [];
  onDelete: (workflowId: string, siteId: string) => void;
  handleScroll: (event: any) => void;
  handleDuplicateClick: (workflowId: string, siteId: string) => void;
  handleCopyToClipBoard: (workflowId: string, siteId: string) => void;
  showTooltipId: string;
  handleDownloadClick: (workflowId: string, siteId: string) => void;
  isSiteReadOnly: boolean;
};

export function WorkflowList({
  siteId,
  isSiteReadOnly,
  workflows,
  onDelete,
  handleScroll,
  handleDuplicateClick,
  handleCopyToClipBoard,
  showTooltipId,
  handleDownloadClick,
}: Props) {
  const dispatch = useAppDispatch();

  const onDeleteClick = (workflowId: string, siteId: string) => () => {
    onDelete(workflowId, siteId);
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
      <div
        className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full w-full"
        onScroll={handleScroll}
      >
        <table
          className="w-full border-collapse text-sm table-auto "
          id="workflowsScrollPane"
        >
          <thead className="sticky top-0 bg-neutral-100 z-10 text-left text-transparent">
            <tr>
              <th className="w-1/3 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Name, ID
              </th>
              <th className="w-1/3 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
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
