import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Close } from '../../Icons/icons';

export default function NewApiKeyModal({
  isOpened,
  onClose,
  updateApiKeyExpansion,
  siteId,
}: {
  isOpened: boolean;
  onClose: any;
  updateApiKeyExpansion: any;
  siteId: string;
}) {
  const {
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
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
          openDialog({ dialogTitle: 'You must provide a name for the API Key' })
        );
        event.preventDefault();
        return;
      }
      let permissionValue: any = permissions;
      if (typeof permissions === 'string') {
        permissionValue = [permissions];
      } else {
        permissionValue = permissions;
      }
      if (!permissionValue) {
        dispatch(
          openDialog({
            dialogTitle: 'You must specify permissions for this API Key',
          })
        );
        event.preventDefault();
        return;
      }
      DocumentsService.addApiKey(nameValue, permissionValue, siteId).then(
        (data) => {
          // TODO: error handling
          closeDialog();
          dispatch(
            openDialog({
              dialogTitle:
                'Please save this API Key in a safe place; you will not be able to retrieve it again:\n\n' +
                data.apiKey +
                '  ',
            })
          );
          updateApiKeyExpansion(siteId);
        }
      );
    }
    event.preventDefault();
  };

  const permissions = watch('permissions', []);

  const handleCheckboxChange = (permission: any) => {
    if (permissions.includes(permission)) {
      setValue(
        'permissions',
        permissions.filter((p: any) => p !== permission)
      );
    } else {
      setValue('permissions', [...permissions, permission]);
    }
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => {}}
        data-test-id="api-key-creation-modal"
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-1/2 h-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block pr-6">
                      Create New API Key - {siteId}
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      data-test-id="close-api-key-creation"
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
                        <div className="w-full mr-12">
                          <input
                            aria-label="Name"
                            data-test-id="api-key-name-input"
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
                      <div className="flex font-semibold items-start mx-4 mb-2 relative w-full">
                        Permissions
                      </div>
                      <div className="flex items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <input
                            id="permissions-checkbox-read"
                            aria-label="Permissions"
                            type="checkbox"
                            value="READ"
                            className="relative inline-block px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            {...register('permissions', {})}
                          />
                          <label
                            htmlFor="permissions-checkbox-read"
                            className="pl-2 pr-4 cursor-pointer"
                          >
                            READ
                          </label>
                          <input
                            aria-label="Permissions"
                            id="permissions-checkbox-write"
                            type="checkbox"
                            value="WRITE"
                            className="relative inline-block px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            {...register('permissions', {})}
                          />
                          <label
                            htmlFor="permissions-checkbox-write"
                            className="pl-2 pr-4 cursor-pointer"
                          >
                            WRITE
                          </label>
                          <input
                            aria-label="Permissions"
                            id="permissions-checkbox-delete"
                            type="checkbox"
                            value="DELETE"
                            className="relative inline-block px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            {...register('permissions', {})}
                          />
                          <label
                            htmlFor="permissions-checkbox-delete"
                            className="pl-2 pr-4 cursor-pointer"
                          >
                            DELETE
                          </label>
                          <input
                            aria-label="Permissions"
                            id="permissions-checkbox-govern"
                            type="checkbox"
                            value="GOVERN"
                            className="relative inline-block px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            {...register('permissions', {})}
                          />
                          <label
                            htmlFor="permissions-checkbox-govern"
                            className="pl-2 pr-4 cursor-pointer"
                          >
                            GOVERN
                          </label>
                        </div>
                      </div>
                      <div className="mx-4">
                        <input
                          type="submit"
                          value="Create"
                          data-test-id="confirm-api-key-creation"
                          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        />
                        <button
                          onClick={closeDialog}
                          data-test-id="cancel-api-key-creation"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded"
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
