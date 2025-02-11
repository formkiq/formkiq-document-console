import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Close } from '../../Icons/icons';
import AddWorkflowStep from '../AddWorkflowStep/addWorkflowStep';

export default function NewWorkflowModal({
  isOpened,
  onClose,
  updateWorkflowExpansion,
  siteId,
}: {
  isOpened: boolean;
  onClose: any;
  updateWorkflowExpansion: any;
  siteId: string;
}) {
  const {
    register,
    formState: { errors },
    reset,
  } = useForm();
  const newFormRef = useRef<HTMLFormElement>(null);

  const dispatch = useAppDispatch();
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
    }
  }, [isOpened]);

  const closeDialog = () => {
    setFormActive(false);
    reset();
    onClose();
  };

  const onNewFormSubmit = (event: any) => {
    if (formActive && newFormRef.current) {
      const formData = new FormData(newFormRef.current);
      const nameValue: string | File | null = formData.get('name');
      if (!nameValue || typeof nameValue === 'object' || !nameValue.length) {
        dispatch(
          openDialog({
            dialogTitle: 'You must provide a name for the workflow',
          })
        );
        event.preventDefault();
        return;
      }
      closeDialog();
      DocumentsService.addWorkflow(nameValue, siteId).then((data) => {
        // TODO: error handling
        updateWorkflowExpansion(siteId);
      });
    }
    event.preventDefault();
  };

  const onStepAdd = () => {
    //
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => {}}
        data-test-id="workflow-creation-modal"
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-3/4 h-2/3">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block pr-6">
                      Create New Workflow - {siteId}
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      data-test-id="close-workflow-creation"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex flext-wrap mt-4">
                    <form
                      className="w-full"
                      ref={newFormRef}
                      onSubmit={(event) => onNewFormSubmit(event)}
                    >
                      <div className="flex items-start mx-4 mb-4 relative w-full">
                        <div className="w-full md:w-1/2 mr-12">
                          <input
                            aria-label="Name"
                            data-test-id="workflow-name-input"
                            type="text"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="Name"
                            {...register('name', {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <textarea
                            rows={4}
                            aria-label="Description"
                            data-test-id="workflow-name-input"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="Description"
                            {...register('description', {
                              required: true,
                            })}
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex font-semibold items-start mx-4 mb-2 relative w-full">
                        Notification Type
                      </div>
                      <div className="flex items-start mx-4 mb-4 relative w-full">
                        <div className="w-full md:w-1/2">
                          <select
                            aria-label="Notification Type"
                            name="notificationType"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                              text-sm
                              placeholder-gray-500 text-gray-900 rounded-t-md
                              focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                          >
                            <option value="None">None</option>
                            <option value="Email">Email</option>
                            <option value="SMS">SMS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex font-semibold items-start mx-4 mb-2 relative w-full">
                        Workflow Steps
                      </div>
                      <div className="flex font-semibold items-start mx-4 mb-2 relative w-full">
                        <input
                          type="button"
                          value="Open Workflow Designer..."
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-2xl"
                        />
                      </div>

                      <div className="flex w-full mt-4">
                        <AddWorkflowStep onAdd={onStepAdd} />
                      </div>
                      <div className="mx-4">
                        <input
                          type="submit"
                          value="Create"
                          data-test-id="confirm-workflow-creation"
                          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-2xl mr-2"
                        />
                        <button
                          onClick={closeDialog}
                          data-test-id="cancel-workflow-creation"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-2xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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
