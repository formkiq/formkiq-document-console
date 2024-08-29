import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setCurrentActionEvent } from '../../../Store/reducers/config';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import {
  DocumentsService,
  IFileUploadData,
} from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import {
  Close,
  External,
  FolderSolid,
  LinkIcon,
  Upload,
  Webhook,
  Workflow,
} from '../../Icons/icons';

export default function NewModal({
  isOpened,
  onClose,
  siteId,
  formkiqVersion,
  value,
  onDocumentDataChange,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  formkiqVersion: any;
  value: ILine | null;
  onDocumentDataChange: any;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
  } = useForm();
  const newFormRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = decodeURI(useLocation().pathname);
  const [formActive, setFormActive] = useState(true);
  const [itemToCreate, setItemToCreate] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsRequiringNameField = [
    'folder',
    'docx',
    'xlsx',
    'pptx',
    'md',
    'deeplink',
  ];
  const itemsRequiringDeeplinkPathField = ['deeplink'];

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
    }
  }, [isOpened]);

  const removeActionEventParam = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('actionEvent');
    setSearchParams(params);
  };

  const closeDialog = () => {
    setItemToCreate('');
    setFormActive(false);
    reset();
    onDocumentDataChange();
    onClose();
    removeActionEventParam();
  };

  const onNewFolderClick = (event: any, value: ILine | null) => {
    if (value) {
      if (value.folder.split('/').length >= 10) {
        dispatch(
          openDialog({
            dialogTitle: 'You have reached the maximum folder depth available.',
          })
        );
      } else {
        setItemToCreate('folder');
        setTimeout(() => {
          setFocus('name');
        }, 50);
      }
    }
  };

  const onNewDeeplinkDocumentClick = (event: any, value: ILine | null) => {
    if (value) {
      setItemToCreate('deeplink');
      setTimeout(() => {
        setFocus('name');
      }, 50);
    }
  };

  const onNewDocumentClick = (event: any, extension: string) => {
    setItemToCreate(extension);
    setTimeout(() => {
      setFocus('name');
    }, 50);
  };
  const onNewFormSubmit = (event: any, value: ILine | null) => {
    if (formActive && value && newFormRef.current) {
      if (itemToCreate.length) {
        const formData = new FormData(newFormRef.current);
        let nameValue: string | File | null = formData.get('name');
        const deeplinkPath: string | File | null = formData.get('deeplinkPath');
        if (!nameValue || typeof nameValue === 'object' || !nameValue.length) {
          dispatch(
            openDialog({ dialogTitle: 'You must provide a name for the item' })
          );
          event.preventDefault();
          return;
        }
        // TODO: add file regex check
        if (nameValue.indexOf('#') !== -1) {
          nameValue = nameValue.replace(/#/g, '');
        }

        // check if adding deeplink document
        if (itemToCreate === 'deeplink') {
          if (
            !deeplinkPath ||
            typeof deeplinkPath === 'object' ||
            !deeplinkPath.length
          ) {
            dispatch(
              openDialog({
                dialogTitle: 'You must provide a deeplink path for the item',
              })
            );
            event.preventDefault();
            return;
          }
        }
        // TODO: check if name exists in folder
        if (itemToCreate === 'folder') {
          DocumentsService.createFolder(value.folder, nameValue, siteId).then(
            (data) => {
              closeDialog();
            }
          );
        } else if (itemToCreate === 'deeplink') {
          const documentParamaters = {
            path: value.folder
              ? `${value.folder}/${nameValue}`
              : `${nameValue}`,
            contentType: 'text/html',
            deepLinkPath: deeplinkPath,
          };
          DocumentsService.addDocument(siteId, documentParamaters).then(
            (res) => {
              if (res.status === 201) {
                closeDialog();
              } else {
                dispatch(
                  openDialog({
                    dialogTitle: 'An error has occurred.',
                  })
                );
              }
            }
          );
        } else {
          if (nameValue.indexOf('.' + itemToCreate) === -1) {
            nameValue += '.' + itemToCreate;
          }
          if (itemToCreate === 'md') {
            const documentParamaters = {
              path: value.folder
                ? `${value.folder}/${nameValue}`
                : `${nameValue}`,
              contentType: 'text/markdown',
              content: ' ',
            };
            DocumentsService.addDocument(siteId, documentParamaters).then(
              (res) => {
                if (res.status === 201) {
                  navigate(pathname + '/' + res.documentId + '/edit');
                } else {
                  dispatch(
                    openDialog({
                      dialogTitle: 'An error has occurred.',
                    })
                  );
                }
              }
            );
          } else {
            navigate(
              '/documents/new/' +
                itemToCreate +
                '?path=' +
                value.folder +
                '/' +
                nameValue
            );
          }
          closeDialog();
        }
      } else {
        dispatch(
          openDialog({
            dialogTitle: 'You must select the type of item to create',
          })
        );
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
              <Dialog.Panel
                className="relative transform overflow-hidden text-left transition-all w-full lg:w-1/2 h-1/2"
                data-test-id="new-document-modal"
              >
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block pr-6">
                      Create New
                    </div>
                    <div
                      data-test-id="new-document-modal-close"
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div
                      data-test-id="new-document-folder"
                      className={`${
                        itemToCreate === 'folder'
                          ? 'bg-gray-100 font-semibold border-gray-600'
                          : 'cursor-pointer hover:bg-gray-100'
                      } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                      onClick={(event) => onNewFolderClick(event, value)}
                    >
                      <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                        <FolderSolid />
                      </div>
                      <div className="w-full text-sm text-center mb-2">
                        Create a New Document Folder
                      </div>
                    </div>
                    <div
                      className={`${
                        itemToCreate === 'upload-file'
                          ? 'bg-gray-100 font-semibold border-gray-600'
                          : 'cursor-pointer hover:bg-gray-100'
                      } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                      onClick={(event) => {
                        closeDialog();
                        dispatch(setCurrentActionEvent('upload'));
                      }}
                    >
                      <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                        <Upload />
                      </div>
                      <div className="w-full tracking-normal text-sm text-center mb-2">
                        Upload a New File
                      </div>
                    </div>
                    <div
                      className={`${
                        itemToCreate === 'upload-folder'
                          ? 'bg-gray-100 font-semibold border-gray-600'
                          : 'cursor-pointer hover:bg-gray-100'
                      } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                      onClick={(event) => {
                        closeDialog();
                        dispatch(setCurrentActionEvent('folderUpload'));
                      }}
                    >
                      <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                        <Upload />
                      </div>
                      <div className="w-full tracking-normal text-sm text-center mb-2">
                        Upload a New Folder
                      </div>
                    </div>
                    <div
                      className={`${
                        itemToCreate === 'deeplink-document'
                          ? 'bg-gray-100 font-semibold border-gray-600'
                          : 'cursor-pointer hover:bg-gray-100'
                      } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                      onClick={(event) =>
                        onNewDeeplinkDocumentClick(event, value)
                      }
                    >
                      <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                        <LinkIcon />
                      </div>
                      <div className="w-full tracking-normal text-sm text-center mb-2">
                        Add a Deeplink Document
                      </div>
                    </div>
                    {formkiqVersion.modules?.indexOf('onlyoffice') > -1 && (
                      <>
                        <div
                          className={`${
                            itemToCreate === 'docx'
                              ? 'bg-gray-100 font-semibold border-gray-600'
                              : 'cursor-pointer hover:bg-gray-100'
                          } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                          onClick={(event) => onNewDocumentClick(event, 'docx')}
                        >
                          <div className="w-full h-16 my-3 flex justify-center">
                            <img
                              src="/assets/img/svg/icon-docx.svg"
                              className="w-16"
                              alt="docx icon"
                            />
                          </div>
                          <div className="w-full text-sm text-center mb-2">
                            MS Word Document
                          </div>
                        </div>
                        <div
                          className={`${
                            itemToCreate === 'xlsx'
                              ? 'bg-gray-100 font-semibold border-gray-600'
                              : 'cursor-pointer hover:bg-gray-100'
                          } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                          onClick={(event) => onNewDocumentClick(event, 'xlsx')}
                        >
                          <div className="w-full h-16 my-3 flex justify-center">
                            <img
                              src="/assets/img/svg/icon-xlsx.svg"
                              className="w-16"
                              alt="xlsx icon"
                            />
                          </div>
                          <div className="w-full text-sm text-center mb-2">
                            MS Excel Document
                          </div>
                        </div>
                        <div
                          className={`${
                            itemToCreate === 'pptx'
                              ? 'bg-gray-100 font-semibold border-gray-600'
                              : 'cursor-pointer hover:bg-gray-100'
                          } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                          onClick={(event) => onNewDocumentClick(event, 'pptx')}
                        >
                          <div className="w-full h-16 my-3 flex justify-center">
                            <img
                              src="/assets/img/svg/icon-pptx.svg"
                              className="w-16"
                              alt="pptx icon"
                            />
                          </div>
                          <div className="w-full tracking-normal text-sm text-center mb-2">
                            MS PowerPoint Document
                          </div>
                        </div>
                        <div
                          className={`${
                            itemToCreate === 'md'
                              ? 'bg-gray-100 font-semibold border-gray-600'
                              : 'cursor-pointer hover:bg-gray-100'
                          } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                          onClick={(event) => onNewDocumentClick(event, 'md')}
                        >
                          <div className="w-full h-16 my-3 flex justify-center">
                            <img
                              src="/assets/img/svg/icon-md.svg"
                              className="w-16"
                              alt="md icon"
                            />
                          </div>
                          <div className="w-full text-sm text-center mb-2">
                            Markdown Document
                          </div>
                        </div>
                      </>
                    )}
                    {formkiqVersion.type !== 'core' && (
                      <div
                        className={`${
                          itemToCreate === 'workflow'
                            ? 'bg-gray-100 font-semibold border-gray-600'
                            : 'cursor-pointer hover:bg-gray-100'
                        } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                        onClick={(event) =>
                          (window.location.href = '/integrations/workflows')
                        }
                      >
                        <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                          <Workflow />
                        </div>
                        <div className="w-full tracking-normal text-sm text-center mb-2">
                          Workflow
                        </div>
                      </div>
                    )}
                    <div
                      className={`${
                        itemToCreate === 'inbound-webhook'
                          ? 'bg-gray-100 font-semibold border-gray-600'
                          : 'cursor-pointer hover:bg-gray-100'
                      } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2`}
                      onClick={(event) =>
                        (window.location.href = '/integrations/webhooks')
                      }
                    >
                      <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                        <Webhook />
                      </div>
                      <div className="w-full tracking-normal text-sm text-center mb-2">
                        Inbound Webhook (Receive Documents)
                      </div>
                    </div>
                    <div
                      className={`${
                        itemToCreate === 'outbound-webhook'
                          ? 'bg-gray-100 font-semibold border-gray-600'
                          : 'cursor-pointer hover:bg-gray-100'
                      } mx-1 w-48 border-2 rounded-md flex flex-wrap justify-center p-2 hidden`}
                      onClick={(event) => (window.location.href = '/workflows')}
                    >
                      <div className="w-full h-12 text-gray-600 my-5 flex justify-center">
                        <External />
                      </div>
                      <div className="w-full tracking-normal text-sm text-center mb-2">
                        Outbound Webhook (Workflow Action)
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <form
                      className="w-full"
                      ref={newFormRef}
                      onSubmit={(event) => onNewFormSubmit(event, value)}
                    >
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        {value && (
                          <div className="w-full mr-12 text-sm font-semibold pb-2">
                            Location: /
                            {value.folder && value.folder.length && (
                              <span>{value.folder}/</span>
                            )}
                          </div>
                        )}
                        <div
                          className={
                            (itemsRequiringNameField.indexOf(itemToCreate) > -1
                              ? ''
                              : 'hidden ') + ' w-full mr-12'
                          }
                        >
                          <input
                            aria-label="Name"
                            type="text"
                            data-test-id="new-document-location-input"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm invalid:bg-red-200
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="Name"
                            pattern="[^#]*"
                            {...register('name', {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div
                          className={
                            (itemsRequiringDeeplinkPathField.indexOf(
                              itemToCreate
                            ) > -1
                              ? ''
                              : 'hidden ') + ' w-full mr-12'
                          }
                        >
                          <input
                            aria-label="DeepLink Path"
                            type="url"
                            data-test-id="new-deeplink-path-input"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm invalid:bg-red-200
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="DeepLink Path"
                            pattern="https://.*"
                            {...register('deeplinkPath', {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="mx-4">
                        <input
                          data-test-id="new-document-modal-create"
                          type="submit"
                          value="Create"
                          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        />
                        <button
                          onClick={closeDialog}
                          data-test-id="new-document-modal-cancel"
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
