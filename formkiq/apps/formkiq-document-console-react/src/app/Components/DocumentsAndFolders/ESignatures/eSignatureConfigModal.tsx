import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Close } from '../../Icons/icons';

export default function ESignatureConfigModal({
  isOpened,
  onClose,
  siteId,
  closeOpener,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  closeOpener: any;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  const configFormRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
    }
  }, [isOpened, siteId]);

  const closeDialog = () => {
    setFormActive(false);
    reset();
    closeOpener();
    onClose();
  };

  const onSubmit = (data: any) => {
    if (formActive) {
      DocumentsService.setESignatureConfig(
        siteId,
        data.clientId,
        data.userId,
        data.privateKey
      ).then((response) => {
        if (response.status === 200) {
          dispatch(
            openDialog({
              dialogTitle:
                'eSignature Configuration has succeeded. You can now send documents for signature.',
            })
          );
          closeDialog();
        } else {
          dispatch(
            openDialog({
              dialogTitle:
                'eSignature Configuration has not succeeded. Please contact your document management system administrator for more info.',
            })
          );
        }
      });
    }
  };
  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => {}}>
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
                    <div className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
                      Configure eSignature Provider (DocuSign)
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="grow text-base inline-block pr-6">
                      In order to use the eSignature module, you need to provide
                      your DocuSign User ID, Integration ID, and Private Key.
                      This information is generated from creating an application
                      within the Apps and Keys settings of your DocuSign
                      account.
                    </div>
                  </div>
                  <div className="flex flext-wrap mt-4">
                    <form
                      className="w-full"
                      ref={configFormRef}
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <input
                            aria-label="Client ID"
                            type="text"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="Client ID"
                            {...register('clientId', {
                              required: true,
                              minLength: {
                                value: 32,
                                message: 'This is not a valid Client ID',
                              },
                            })}
                          />
                          {errors['clientId'] && errors['clientId'].message && (
                            <p className="pt-1 text-red-600">
                              {errors['clientId'].message as string}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <input
                            aria-label="User ID"
                            type="text"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="User ID"
                            {...register('userId', {
                              required: true,
                              minLength: {
                                value: 32,
                                message: 'This is not a valid User ID',
                              },
                            })}
                          />
                          {errors['userId'] && errors['userId'].message && (
                            <p className="pt-1 text-red-600">
                              {errors['userId'].message as string}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <textarea
                            aria-label="Private Key"
                            rows={6}
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="Private Key"
                            {...register('privateKey', {
                              required: true,
                              minLength: {
                                value: 128,
                                message: 'This is not a valid Private Key',
                              },
                            })}
                          ></textarea>
                          {errors['privateKey'] &&
                            errors['privateKey'].message && (
                              <p className="pt-1 text-red-600">
                                {errors['privateKey'].message as string}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="w-full flex justify-center">
                        <input
                          type="submit"
                          value="Configure"
                          className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none mr-2"
                        />
                        <button
                          onClick={closeDialog}
                          className="bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
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
