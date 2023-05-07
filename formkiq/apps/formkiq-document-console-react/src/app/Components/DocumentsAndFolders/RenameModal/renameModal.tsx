import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { Close } from '../../Icons/icons';

export default function RenameModal({
  isOpened,
  onClose,
  siteId,
  value,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  value: ILine | null;
}) {
  const {
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const renameFormRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
      if (value) {
        let currentName = '';
        if (value.lineType === 'folder') {
          currentName = value.folder.substring(
            value.folder.lastIndexOf('/') + 1
          );
        } else if (value.documentInstance) {
          currentName = value.documentInstance.path;
          if (currentName.lastIndexOf('/') > -1) {
            currentName = currentName.substring(
              currentName.lastIndexOf('/') + 1
            );
          }
        }
        setValue('name', currentName);
        if (value.lineType !== 'folder') {
          setTimeout(() => {
            const nameInput: HTMLInputElement = document.getElementById(
              'nameInput'
            ) as HTMLInputElement;
            if (nameInput) {
              if (nameInput.value.length > 0) {
                const nameWithoutExtension = nameInput.value.substring(
                  0,
                  nameInput.value.lastIndexOf('.')
                );
                nameInput.focus();
                nameInput.setSelectionRange(
                  0,
                  nameWithoutExtension.length,
                  'forward'
                );
              }
            }
          }, 300);
        }
      }
    }
  }, [isOpened, value]);

  const closeDialog = () => {
    setFormActive(false);
    reset();
    onClose();
  };

  const onRenameFormSubmit = (event: any, value: ILine | null) => {
    if (formActive && value && renameFormRef.current) {
      const formData = new FormData(renameFormRef.current);
      const nameValue: string | File | null = formData.get('name');
      if (!nameValue || typeof nameValue === 'object' || !nameValue.length) {
        dispatch(
          openDialog({
            dialogTitle: 'You must provide a new name for the item',
          })
        );
        event.preventDefault();
        return;
      }
      // TODO: add file regex check
      // TODO: check if name exists in folder
      if (value.lineType === 'folder') {
        dispatch(
          openDialog({
            dialogTitle: 'Folder rename has not been implemented yet.',
          })
        );
        /*
          // TODO: add site id
          DocumentsService.setDocumentFolder(value.folder.substring(0, value.folder.lastIndexOf('/') + 1) + nameValue, value.folder + '/').then((data) => {
            closeDialog();
          })
          */
      } else {
        if (value && value.documentInstance) {
          DocumentsService.renameDocument(
            value.documentId,
            value.documentInstance.path,
            nameValue,
            siteId
          ).then((data) => {
            // TODO: add flash message ?
            closeDialog();
          });
        }
      }
    }
    event.preventDefault();
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
                    <div className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 pr-6">
                      Rename
                      {value && value.lineType === 'folder' ? (
                        <span> Folder</span>
                      ) : (
                        <span> Document</span>
                      )}
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex flext-wrap mt-4">
                    <form
                      className="w-full"
                      ref={renameFormRef}
                      onSubmit={(event) => onRenameFormSubmit(event, value)}
                    >
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        {value && (
                          <div className="w-full mr-12 text-sm font-semibold pb-2">
                            Documents/
                            {value.lineType === 'folder' ? (
                              <span>
                                {value.folder &&
                                  value.folder.length &&
                                  value.folder.substring(
                                    0,
                                    value.folder.lastIndexOf('/') + 1
                                  )}
                              </span>
                            ) : (
                              <span>
                                {value.folder && value.folder.length && (
                                  <span>{value.folder}/</span>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="w-full mr-12">
                          <input
                            id="nameInput"
                            aria-label="Name"
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
                      <div className="w-full flex justify-center">
                        <input
                          type="submit"
                          value="Rename"
                          className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none mr-2"
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
