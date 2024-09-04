import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import { CopyButton } from '../../Generic/Buttons/CopyButton';
import { Checkmark, Close } from '../../Icons/icons';

interface Workflow {
  workflowId: string;
  name: string;
  status: string;
  currentStepId: string;
}

export default function DocumentReviewModal({
  isOpened,
  onClose,
  siteId,
  value,
  onDocumentDataChange,
}: {
  isOpened: boolean;
  onClose: () => void;
  siteId: string;
  value: ILine | null;
  onDocumentDataChange: any;
}) {
  const [comments, setComments] = useState<string>('');
  const [documentWorkflows, setDocumentWorkflows] = useState<Workflow[] | null>(
    null
  );
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );
  const dispatch = useAppDispatch();

  const closeDialog = () => {
    onClose();
  };

  const approveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    updateDocumentWorkflows();
  }, [value]);

  useEffect(() => {
    // Auto-select the workflow if there's only one
    if (
      documentWorkflows &&
      documentWorkflows.length === 1 &&
      !selectedWorkflowId
    ) {
      setSelectedWorkflowId(documentWorkflows[0].workflowId);
    }
  }, [documentWorkflows, selectedWorkflowId]);

  const updateDocumentWorkflows = () => {
    if (value) {
      DocumentsService.getWorkflowsInDocument(siteId, value.documentId).then(
        (workflowsResponse) => {
          setDocumentWorkflows(workflowsResponse.workflows);
        }
      );
    }
  };

  const onCommentsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(event.target.value);
  };

  const selectWorkflow = (event: React.MouseEvent, workflowId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedWorkflowId(
      workflowId === selectedWorkflowId ? null : workflowId
    );
  };

  const reviewDocument = (decision: 'APPROVE' | 'REJECT') => {
    if (!value || !documentWorkflows) {
      dispatch(
        openDialog({
          dialogTitle: 'Document is not in a workflow.',
        })
      );
      return;
    }
    if (selectedWorkflowId === null) {
      dispatch(
        openDialog({
          dialogTitle: 'Please select a workflow to review the document.',
        })
      );
      return;
    }

    const currentWorkflow = documentWorkflows.find(
      (workflow) => workflow.workflowId === selectedWorkflowId
    );
    if (!currentWorkflow) {
      dispatch(
        openDialog({
          dialogTitle: 'Selected workflow not found.',
        })
      );
      return;
    }

    const decisionParameters = {
      stepId: currentWorkflow.currentStepId,
      comments,
      decision,
    };

    DocumentsService.addDecisionToDocumentWorkflow(
      siteId,
      value.documentId,
      selectedWorkflowId,
      decisionParameters
    ).then((res: any) => {
      if (res.status !== 200) {
        dispatch(
          openDialog({
            dialogTitle: 'An error has occurred.',
          })
        );
      } else {
        onDocumentDataChange();
        closeDialog();
      }
    });
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={approveButtonRef}
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
                      Review Document
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
                  {documentWorkflows && documentWorkflows.length > 1 && (
                    <h3 className="mt-6 text-lg font-semibold text-gray-900">
                      Select workflow:
                    </h3>
                  )}
                  <div className="mt-2 max-h-100 overflow-y-scroll">
                    {documentWorkflows && documentWorkflows.length > 0 ? (
                      <table className="border-collapse table-auto w-full text-sm">
                        <thead>
                          <tr>
                            <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                              Workflow Name
                            </th>
                            <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentWorkflows.map((workflow, i) => (
                            <tr
                              key={i}
                              className={`hover:bg-gray-100 cursor-pointer ${
                                workflow.workflowId === selectedWorkflowId
                                  ? 'bg-gray-300'
                                  : ''
                              }`}
                              onClick={(e) =>
                                selectWorkflow(e, workflow.workflowId)
                              }
                            >
                              <td className="border-b border-neutral-100 nodark:border-neutral-700 p-2 pr-2 text-neutral-900 nodark:text-slate-400">
                                <span>{workflow.name}</span>
                                <span className="block">
                                  <span className="text-smaller pr-2">
                                    ID: {workflow.workflowId}
                                  </span>
                                  <CopyButton value={workflow.workflowId} />
                                </span>
                              </td>
                              <td className="border-b border-neutral-100 nodark:border-neutral-700 p-2 pr-2 text-neutral-900 nodark:text-slate-400">
                                <span>{workflow.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center">
                        No workflows have been assigned to this document.
                      </p>
                    )}
                    <label
                      htmlFor="comment"
                      className="block text-md font-medium text-neutral-900 mt-6 mb-2"
                    >
                      Comments (optional):
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      value={comments}
                      onChange={onCommentsChange}
                    />
                  </div>
                  <div className="w-full flex justify-center mt-4 h-8 gap-2">
                    <ButtonPrimary
                      ref={approveButtonRef}
                      className="flex justify-center items-center gap-2"
                      onClick={() => reviewDocument('APPROVE')}
                      style={{ background: '#22c55e' }}
                    >
                      <div className="w-5 h-5">
                        <Checkmark />
                      </div>
                      APPROVE
                    </ButtonPrimary>
                    <ButtonPrimary
                      className="flex justify-center items-center gap-2"
                      onClick={() => reviewDocument('REJECT')}
                      style={{ background: '#ef4444' }}
                    >
                      <div className="w-5 h-5">
                        <Close />
                      </div>
                      REJECT
                    </ButtonPrimary>
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
