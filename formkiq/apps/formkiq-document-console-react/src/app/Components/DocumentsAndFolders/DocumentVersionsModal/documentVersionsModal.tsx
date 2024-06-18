import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { InlineViewableContentTypes } from '../../../helpers/constants/contentTypes';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { Close, Upload } from '../../Icons/icons';
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import ButtonTertiary from "../../Generic/Buttons/ButtonTertiary";

export default function DocumentVersionsModal({
  isOpened,
  onClose,
  onUploadClick,
  isUploadModalOpened,
  siteId,
  isSiteReadOnly,
  documentsRootUri,
  value,
}: {
  isOpened: boolean;
  onClose: any;
  onUploadClick: any;
  isUploadModalOpened: boolean;
  siteId: string;
  isSiteReadOnly: boolean;
  documentsRootUri: string;
  value: ILine | null;
}) {
  const [versions, setVersions] = useState(null);
  const dispatch = useAppDispatch();
  const closeDialog = () => {
    onClose();
  };
  const navigate = useNavigate();

  const doneButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  useEffect(() => {
    updateVersions();
  }, [value]);

  useEffect(() => {
    if (isUploadModalOpened === false) {
      setTimeout(() => {
        updateVersions();
      }, 500);
    }
  }, [isUploadModalOpened]);

  const updateVersions = () => {
    if (value) {
      setVersions(null);
      DocumentsService.getDocumentById(value.documentId as string, siteId).then(
        (docResponse) => {
          DocumentsService.getDocumentVersions(
            value.documentId as string,
            siteId
          ).then((data) => {
            const vers = data?.documents.map((doc: any) => {
              doc.insertedDate = moment(doc.insertedDate).format(
                'YYYY-MM-DD HH:mm'
              );
              doc.lastModifiedDate = moment(doc.lastModifiedDate).format(
                'YYYY-MM-DD HH:mm'
              );
              return doc;
            });
            docResponse.insertedDate = moment(docResponse.insertedDate).format(
              'YYYY-MM-DD HH:mm'
            );
            docResponse.lastModifiedDate = moment(
              docResponse.lastModifiedDate
            ).format('YYYY-MM-DD HH:mm');
            vers.unshift(docResponse);
            setVersions(vers);
          });
        }
      );
    }
  };
  const viewDocumentVersion = (event: any, versionKey: string) => {
    if (value) {
      if (versionKey !== undefined) {
        /*
        window.open(
          `${window.location.origin}${documentsRootUri}/${value.documentId}/view?versionKey=${versionKey}`
        );
        */
        navigate(
          `${documentsRootUri}/${value.documentId}/view?versionKey=${versionKey}`
        );
      } else {
        /*
        window.open(
          `${window.location.origin}${documentsRootUri}/${value.documentId}/view`
        );
        */
        navigate(`${documentsRootUri}/${value.documentId}/view`);
      }
    }
  };
  const downloadDocumentVersion = (event: any, versionKey: string) => {
    if (value) {
      let downloadVersionKey = '';
      if (versionKey && versionKey.length) {
        downloadVersionKey = versionKey;
      }
      DocumentsService.getDocumentUrl(
        value.documentId,
        siteId,
        downloadVersionKey,
        false
      ).then((urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      });
    }
  };

  const openDeleteDialog = useCallback(
    (versionKey: string) => {
      const deleteVersion = () => {
        if (value) {
          DocumentsService.deleteDocumentVersion(
            value.documentId,
            versionKey
          ).catch((err) => {
            console.error('Failed to delete document version: ', err);
          });
        }
      };

      dispatch(
        openDialog({
          callback: deleteVersion,
          dialogTitle: 'Are you sure you want to delete this document version?',
        })
      );
    },
    [dispatch, value]
  );

  const revertDocumentVersion = (event: any, versionKey: string) => {
    if (value) {
      DocumentsService.putDocumentVersion(
        value.documentId,
        versionKey,
        siteId
      ).then((urlResponse: any) => {
        if (urlResponse.status === '400') {
          dispatch(
            openDialog({
              dialogTitle:
                'An error has occurred. Please try again in a few minutes.',
            })
          );
        } else {
          updateVersions();
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
                      Document Versions
                      <span className="block"></span>
                    </div>
                    <div className="w-100">
                      {!isSiteReadOnly && (
                          <ButtonTertiary
                            onClick={(event:any) =>
                            onUploadClick(event, (value as any).documentId)
                          }
                            className="flex font-semibold py-2"
                        >
                          <div className="mx-4">Upload New Version 1</div>
                          <div className="w-4 h-4 ml-2 mt-1">{Upload()}</div>
                          </ButtonTertiary>
                      )}
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                      title="Close"
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="mt-6 max-h-100 overflow-y-scroll">
                    <table className="border-collapse table-auto w-full text-sm">
                      <thead>
                        <tr>
                          <th className="w-20 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Version
                          </th>
                          <th className="w-48 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Path
                          </th>
                          <th className="w-32 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Created
                          </th>
                          <th className="w-32 border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Last modified
                          </th>
                          <th className="w-64 border-b font-medium p-2 pr-4 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Content Type
                          </th>
                          <th className="border-b font-medium p-2 pt-0 pb-3 text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {versions && (versions as []).length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-2 text-center">
                              No versions exist for this document.
                            </td>
                          </tr>
                        )}
                        {versions &&
                          (versions as []).map((version: any, i: number) => {
                            return (
                              <tr key={i}>
                                <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                  {version.version ? (
                                    <span>{version.version}</span>
                                  ) : (
                                    <span className="font-bold">(current)</span>
                                  )}
                                </td>
                                <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400 overflow-hidden">
                                  {version.path}
                                </td>
                                <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                  {version.insertedDate}
                                </td>
                                <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                  {version.lastModifiedDate}
                                </td>
                                <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400 overflow-hidden">
                                  {version.contentType}
                                </td>
                                <td className="border-b border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                  <div className="flex flex-wrap justify-left gap-4">
                                    {InlineViewableContentTypes.indexOf(
                                      version.contentType
                                    ) > -1 && (
                                      <button
                                        className="flex items-center bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-smaller font-semibold py-2 px-7 rounded-2xl flex cursor-pointer focus:outline-none"
                                        onClick={(event) =>
                                          viewDocumentVersion(
                                            event,
                                            version.versionKey
                                          )
                                        }
                                      >
                                        View
                                      </button>
                                    )}
                                    <ButtonTertiary
                                      className="flex items-center text-smaller font-semibold py-2 px-5 focus:outline-none"
                                      onClick={(event:any) =>
                                        downloadDocumentVersion(
                                          event,
                                          version.versionKey
                                        )
                                      }
                                    >
                                      Download
                                    </ButtonTertiary>
                                    {version.versionKey && (
                                      <button
                                        className="flex items-center bg-gradient-to-l py-2 px-5 hover:bg-gray-100 cursor-pointer text-red-500 text-gray-900 text-smaller font-semibold py-2 rounded-md flex focus:outline-none"
                                        onClick={() => {
                                          openDeleteDialog(version.versionKey);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    )}
                                    {version.version && !isSiteReadOnly && (
                                      <button
                                        className="flex items-center bg-gradient-to-l from-yellow-200 via-amber-200 to-yellow-300 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 text-gray-900 text-smaller font-semibold py-2 px-5 rounded-md flex cursor-pointer focus:outline-none"
                                        onClick={(event) =>
                                          revertDocumentVersion(
                                            event,
                                            version.versionKey
                                          )
                                        }
                                      >
                                        Set as Current Version
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <ButtonPrimaryGradient
                      ref={doneButtonRef}
                      className="py-2"
                      onClick={closeDialog}
                    >
                      Done
                    </ButtonPrimaryGradient>
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
