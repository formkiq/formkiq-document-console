import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { CopyButton } from '../../Generic/Buttons/CopyButton';
import { Close } from '../../Icons/icons';

export default function DocumentWorkflowsModal({
  isOpened,
  onClose,
  siteId,
  isSiteReadOnly,
  documentsRootUri,
  value,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  isSiteReadOnly: boolean;
  documentsRootUri: string;
  value: ILine | null;
}) {
  const [workflows, setWorkflows] = useState(null);
  const [documentWorkflows, setDocumentWorkflows] = useState(null);
  const dispatch = useAppDispatch();
  const closeDialog = () => {
    onClose();
  };

  const doneButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  useEffect(() => {
    updateDocumentWorkflows();
    updateWorkflows();
  }, [value]);

  const updateWorkflows = () => {
    if (value) {
      DocumentsService.getWorkflows(siteId).then((workflowsResponse) => {
        setWorkflows(workflowsResponse.workflows);
      });
    }
  };

  const updateDocumentWorkflows = () => {
    if (value) {
      DocumentsService.getWorkflowsInDocument(siteId, value.documentId).then(
        (workflowsResponse) => {
          setDocumentWorkflows(workflowsResponse.workflows);
        }
      );
    }
  };

  const triggerWorkflow = (event: any) => {
    if (value) {
      const workflowToTriggerSelect: HTMLSelectElement =
        document.getElementById('workflowToTriggerSelect') as HTMLSelectElement;
      if (workflowToTriggerSelect.selectedIndex === -1) {
        return;
      }
      const workflowId =
        workflowToTriggerSelect.options[workflowToTriggerSelect.selectedIndex]
          .value;
      DocumentsService.addWorkflowToDocument(
        siteId,
        value.documentId,
        workflowId
      ).then((addResponse: any) => {
        if (addResponse.status === '400' || addResponse.status === '500') {
          dispatch(
            openDialog({
              dialogTitle:
                'An error has occurred. Please try again in a few minutes.',
            })
          );
        } else {
          updateDocumentWorkflows();
        }
      });
    }
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={doneButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-4/5">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 inline-block pr-6">
                      Document Workflows
                      <span className="block"></span>
                    </div>
                    <div className="w-100"></div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="mt-6 max-h-100 overflow-y-scroll">
                    <table className="border-collapse table-auto w-full text-sm">
                      <thead>
                        <tr>
                          <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            ID
                          </th>
                          <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Name
                          </th>
                          <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Status
                          </th>
                          <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Current Step
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentWorkflows &&
                          (documentWorkflows as []).length === 0 && (
                            <tr>
                              <td colSpan={3} className="p-2 text-center">
                                No workflows have been assigned to this
                                document.
                              </td>
                            </tr>
                          )}
                        {documentWorkflows &&
                          (documentWorkflows as []).map(
                            (workflow: any, i: number) => {
                              return (
                                <tr key={i}>
                                  <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                    <span className="pr-2">
                                      {workflow.workflowId}
                                    </span>
                                    <CopyButton value={workflow.workflowId} />
                                  </td>
                                  <td className="border-b border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                    <span>{workflow.name}</span>
                                  </td>
                                  <td className="border-b border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                    <span>{workflow.status}</span>
                                  </td>
                                  <td className="border-b border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                    <span>{workflow.currentStepId}</span>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                      </tbody>
                    </table>
                    <div className="my-4 border-t border-b pt-4 flex justify-center">
                      {workflows && (workflows as []).length === 0 && (
                        <div>No workflows are available to this document.</div>
                      )}
                      {workflows && (
                        <>
                          <div className="font-bold pt-1 pr-2">
                            Trigger Workflow:
                          </div>
                          <div>
                            <select id="workflowToTriggerSelect">
                              {workflows &&
                                (workflows as []).map(
                                  (workflow: any, i: number) => {
                                    return (
                                      <option
                                        key={i}
                                        value={workflow.workflowId}
                                      >
                                        {workflow.name} (#{workflow.workflowId})
                                      </option>
                                    );
                                  }
                                )}
                            </select>
                          </div>
                          <div className="pl-2">
                            <button
                              className="flex items-center bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                              onClick={triggerWorkflow}
                            >
                              Go
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <button
                      ref={doneButtonRef}
                      className="flex items-center bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                      onClick={closeDialog}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
