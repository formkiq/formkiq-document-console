import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigState } from '../../../Store/reducers/config';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { IDocument } from '../../../helpers/types/document';
import { ILine } from '../../../helpers/types/line';
import { Close, Spinner } from '../../Icons/icons';
import {
  fetchWorkflows,
  WorkflowsState,
} from '../../../Store/reducers/workflows';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import {
  RequestStatus,
  WorkflowSummary,
} from '../../../helpers/types/workflows';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { Queue } from '../../../helpers/types/queues';

interface SubmitForReviewModalProps {
  isOpened: boolean;
  onClose: () => void;
  siteId: string;
  value: ILine | null;
  onDocumentDataChange: any;
  currentDocumentsRootUri: string;
}

export default function SubmitForReviewModal({
  isOpened,
  onClose,
  siteId,
  value,
  onDocumentDataChange,
  currentDocumentsRootUri,
}: SubmitForReviewModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [formActive, setFormActive] = useState<boolean>(true);
  const [isSpinnerDisplayed, setIsSpinnerDisplayed] = useState(false);
  const [workflowsValues, setWorkflowsValues] = useState<
    { key: string; title: string }[]
  >([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [isWorkflowHasQueue, setIsWorkflowHasQueue] = useState<boolean>(false);
  const [queues, setQueues] = useState<Queue[]>([]);

  const { formkiqVersion } = useSelector(ConfigState);
  const { workflows, workflowsLoadingStatus } = useSelector(WorkflowsState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
    }
  }, [isOpened]);

  const updateWorkflows = () => {
    dispatch(fetchWorkflows({ siteId, limit: 100 }));
  };
  useEffect(() => {
    if (isOpened) {
      updateWorkflows();
    }
  }, [isOpened]);

  useEffect(() => {
    if (!workflows) return;
    setWorkflowsValues(
      workflows.map((workflow: WorkflowSummary) => ({
        key: workflow?.workflowId ?? '',
        title: workflow?.name ?? '',
      }))
    );
  }, [workflows]);

  function resetValues() {
    setSelectedWorkflowId('');
    setIsWorkflowHasQueue(false);
  }

  const closeDialog = useCallback((): void => {
    setFormActive(false);
    setIsSpinnerDisplayed(false);
    resetValues();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeout(() => {
      onDocumentDataChange();
    }, 1500);
    onClose();
  }, [onDocumentDataChange, onClose]);

  useEffect(() => {
    // Clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const searchDocument = useCallback(
    (documentId: string) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(searchAndProcess, 500);
      let attempts = 0;
      const maxAttempts = 30;

      const searchAttributes = [
        {
          key: 'Relationships',
          eq: 'PRIMARY#' + documentId,
        },
      ];

      function searchAndProcess() {
        DocumentsService.searchDocuments(
          siteId,
          formkiqVersion,
          null,
          '',
          0,
          undefined,
          undefined,
          searchAttributes
        )
          .then((response) => {
            if (response.documents?.length > 0) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setIsSpinnerDisplayed(false);

              const newName: string =
                (value?.documentInstance as IDocument).path + '.pdf';
              DocumentsService.renameDocument(
                response.documents[0].documentId,
                response.documents[0].documentId,
                newName
              );

              DocumentsService.addWorkflowToDocument(
                siteId,
                response.documents[0].documentId,
                selectedWorkflowId
              );

              closeDialog();
            } else {
              attempts++;
              if (attempts >= maxAttempts) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                console.log('Document search timed out');
                setIsSpinnerDisplayed(false);
                // Handle timeout (e.g., show an error message to the user)
                dispatch(
                  openNotificationDialog({
                    dialogTitle: 'Something went wrong. Please try again later',
                  })
                );
              }
            }
          })
          .catch((error) => {
            console.error('Error searching documents:', error);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsSpinnerDisplayed(false);
            // Handle error (e.g., show an error message to the user)
            dispatch(
              openNotificationDialog({
                dialogTitle: 'Error searching documents:' + error.message,
              })
            );
          });
      }

      // Clear interval after component unmounts or dialog closes
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    },
    [siteId, formkiqVersion, value, closeDialog]
  );

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!isWorkflowHasQueue) return;
    if (formActive && value) {
      if ((value?.documentInstance as IDocument).deepLinkPath?.length > 0) {
        setIsSpinnerDisplayed(true);
        const actions = [
          {
            type: 'PDFEXPORT',
          },
        ];
        DocumentsService.postDocumentActions(
          value.documentId,
          actions,
          siteId
        ).then((response) => {
          if (response.status === 200) {
            searchDocument(value.documentId);
          } else {
            setIsSpinnerDisplayed(false);
            // Handle error (e.g., show an error message to the user)
            dispatch(
              openNotificationDialog({
                dialogTitle: 'Something went wrong. Please try again later',
              })
            );
          }
        });
      } else {
        DocumentsService.addWorkflowToDocument(
          siteId,
          value.documentId,
          selectedWorkflowId
        ).then((response) => {
          if (response.status === 201) {
            closeDialog();
          }
        });
      }
    }
  };

  function onSelectWorkflowId(workflowId: string) {
    setSelectedWorkflowId(workflowId);
    DocumentsService.getWorkflow(workflowId, siteId).then((workflow) => {
      const queueStep: any = workflow.steps?.find(
        (step: any) => step.queue?.queueId
      );
      if (queueStep) {
        setIsWorkflowHasQueue(true);
      } else {
        setIsWorkflowHasQueue(false);
      }
    });
  }

  useEffect(() => {
    if (!value) return;

    const fetchDocumentQueues = async (next = null) => {
      try {
        const res = await DocumentsService.getDocumentActions(
          value?.documentId,
          siteId,
          20,
          next
        );

        if (res.status === 200) {
          const queuePromises = res.actions
            .filter(
              (action: any) => action.queueId && action.status === 'IN_QUEUE'
            )
            .filter(
              (action: any) =>
                !queues.some(
                  (existingQueue) => existingQueue.queueId === action.queueId
                )
            )
            .map((action: any) =>
              DocumentsService.getQueue(siteId, action.queueId).then(
                (queueResponse) => ({
                  ...queueResponse,
                  queueId: action.queueId,
                })
              )
            );

          const newQueues = await Promise.all(queuePromises);

          if (newQueues.length > 0) {
            setQueues((prevQueues) => [...prevQueues, ...newQueues]);
          }

          if (res.next) {
            await fetchDocumentQueues(res.next);
          }
        }
      } catch (error: any) {
        dispatch(
          openNotificationDialog({
            dialogTitle: error.errors
              ? 'Error fetching document queues:' + error.errors[0].error
              : 'Error fetching document queues.',
          })
        );
      }
    };

    fetchDocumentQueues();
  }, [value, siteId]);

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeDialog}>
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
              <Dialog.Panel className="relative transform text-left transition-all w-full lg:w-1/2 h-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
                      Submit
                      {value && value.lineType === 'folder' ? (
                        <span> Folder </span>
                      ) : (
                        <span> Document </span>
                      )}
                      For Review
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  {/*List of document Queues*/}
                  {queues.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold mt-2">
                        Document Already in Review.
                      </h4>
                      <p className="text-sm text-neutral-500">
                        This document is already in a review queue. You can
                        check its status in the following queues:
                      </p>
                      <div className="ml-4 mr-8">
                        <table className="w-full mt-2">
                          <thead>
                            <tr className="bg-neutral-100 border border-neutral-300">
                              <th className="text-left text-sm font-semibold pl-2">
                                Queue Name
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {queues.map((queue: any) => (
                              <tr
                                className="border border-neutral-300"
                                key={queue.queueId}
                              >
                                <td>
                                  <a
                                    className="text-sm ml-2 text-neutral-900 hover:text-primary-500 cursor-pointer hover:underline"
                                    href={`${currentDocumentsRootUri}/queues/${queue.queueId}`}
                                  >
                                    {queue.name}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  <h3 className="text-lg font-semibold mt-4">Workflows</h3>
                  <form onSubmit={onSubmit} className="w-full mt-2">
                    <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                      <div className="w-full mr-12 relative">
                        <RadioCombobox
                          values={workflowsValues}
                          selectedValue={selectedWorkflowId}
                          setSelectedValue={onSelectWorkflowId}
                          placeholderText="Select a workflow"
                        />
                        {!isWorkflowHasQueue &&
                          selectedWorkflowId.length > 0 && (
                            <span className="text-red-500 text-sm">
                              This workflow has no approval queue step. Please
                              select another workflow or add a queue step for
                              this workflow.
                            </span>
                          )}
                        {/*{selectedReviewers.length === 0 && (*/}
                        {/*  <span className="text-red-500 text-sm">*/}
                        {/*    You must choose one or more reviewers.*/}
                        {/*  </span>*/}
                        {/*)}*/}
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      <button
                        type="submit"
                        className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none mr-2"
                      >
                        Send for Review
                      </button>
                      <button
                        type="button"
                        onClick={closeDialog}
                        className="bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                    {isSpinnerDisplayed ||
                      (workflowsLoadingStatus === RequestStatus.pending && (
                        <div
                          className="absolute"
                          style={{ right: 'calc(50% - 110px)', top: '5px' }}
                        >
                          <Spinner />
                        </div>
                      ))}
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
