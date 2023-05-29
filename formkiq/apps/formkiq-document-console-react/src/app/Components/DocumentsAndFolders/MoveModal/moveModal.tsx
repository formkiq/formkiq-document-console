import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import {
  ArrowBottom,
  ArrowRight,
  Close,
  FolderSolid,
  Spinner,
} from '../../Icons/icons';

export default function MoveModal({
  isOpened,
  onClose,
  siteId,
  value,
  allTags,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  value: ILine | null;
  allTags: any;
}) {
  const dispatch = useAppDispatch();
  const initialFolders = {
    root: [] as any[],
  };
  const [folders, setFolders] = useState(initialFolders);
  const [expandedFolders, setExpandedFolders] = useState([] as any[]);
  const [selectedFolderIndexKey, setSelectedFolderIndexKey] = useState('');

  useEffect(() => {
    if (isOpened) {
      if (value) {
        // NOTE: there is an arbitrary limit of 50 folders per level, assuming folders are being returned before files
        setFolders(initialFolders);
        // TODO: expand to current path of selected document/folder?
        setExpandedFolders([] as any[]);
        setSelectedFolderIndexKey('');
        getSubfolders();
      }
    }
  }, [isOpened]);

  const closeDialog = () => {
    onClose();
  };
  const getSubfolders = async (folderUri = '', indexKey = '') => {
    await DocumentsService.getDocumentsInFolder(
      folderUri,
      siteId,
      null,
      null,
      null,
      50,
      allTags
    ).then((response: any) => {
      const allFolders = [...[folders]];
      if (response) {
        const retrievedFolders: any[] = response.documents.filter(
          (doc: any) => {
            return !!doc.folder;
          }
        );
        if (indexKey.length) {
          (allFolders[0] as any)['f-' + indexKey] = retrievedFolders;
        } else {
          allFolders[0].root = retrievedFolders;
        }
        setFolders(allFolders[0]);
      }
    });
  };
  const toggleFolderExpand = (
    event: any,
    folderUri: string,
    indexKey: string
  ) => {
    const exf = [...expandedFolders];
    if (exf.indexOf(indexKey) === -1) {
      exf.push(indexKey);
      getSubfolders(folderUri, indexKey).then(() => {
        setExpandedFolders(exf);
      });
    } else {
      exf.splice(exf.indexOf(indexKey), 1);
    }
  };
  const folderLine = (folder: any, index: number, folderUri = '') => {
    if (folderUri === '') {
      folderUri = folder.path;
    } else {
      folderUri += '/' + folder.path;
    }
    return (
      <div
        key={index}
        className={
          'w-full flex flex-wrap items-center ml-' +
          folderUri.split('/').length * 2
        }
      >
        <div className="w-full flex items-center mb-1">
          <div
            className="p-1 cursor-pointer hover:text-gray-400"
            onClick={(event) =>
              toggleFolderExpand(event, folderUri, folder.indexKey)
            }
          >
            {expandedFolders.indexOf(folder.path) === -1 ? (
              <ArrowRight />
            ) : (
              <ArrowBottom />
            )}
          </div>
          <div
            className={
              'flex py-1 px-2 cursor-pointer active:bg-gray-600 active:text-white ' +
              (selectedFolderIndexKey === folderUri
                ? 'bg-gray-600 text-white hover:bg-gray-600 hover:text-white'
                : 'text-inherit hover:bg-gray-200 hover:text-inherit')
            }
            onClick={(event) => toggleSelectedFolder(event, folderUri)}
          >
            <div className="mr-2 w-4">
              <FolderSolid />
            </div>
            <div>{folder.path}</div>
          </div>
        </div>
        {expandedFolders.indexOf(folder.indexKey) > -1 &&
          (folders as any)['f-' + folder.indexKey] && (
            <div className="w-full mb-2">
              {(folders as any)['f-' + folder.indexKey].length ? (
                <>
                  {(folders as any)['f-' + folder.indexKey].map(
                    (subfolder: any, j: number) => {
                      return folderLine(subfolder, j, folderUri);
                    }
                  )}
                </>
              ) : (
                <span className="text-xs pl-8 -mt-2">(no subfolders)</span>
              )}
            </div>
          )}
      </div>
    );
  };
  const toggleSelectedFolder = (event: any, folderUri: string) => {
    if (selectedFolderIndexKey === folderUri) {
      setSelectedFolderIndexKey('');
    } else {
      setSelectedFolderIndexKey(folderUri);
    }
  };
  const executeMove = (event: any) => {
    if (value && selectedFolderIndexKey.length) {
      let newFolderIndexKey = selectedFolderIndexKey;
      if (selectedFolderIndexKey === '/root/') {
        newFolderIndexKey = '';
      }
      let path;
      let pathOnly = '';
      if (value.lineType === 'folder') {
        path = value.folder;
      } else {
        path = (value.documentInstance as any).path;
      }
      if (path.indexOf('/') > -1) {
        pathOnly = path.substring(0, path.lastIndexOf('/'));
      }
      if (pathOnly === newFolderIndexKey) {
        dispatch(
          openDialog({
            dialogTitle:
              'You must select a new folder, not the current one that contains this item.',
          })
        );
      } else {
        DocumentsService.setDocumentFolder(
          newFolderIndexKey,
          path,
          siteId
        ).then((res: any) => {
          if (res.status === 400) {
            dispatch(
              openDialog({
                dialogTitle:
                  'An error has occurred. Please try again in a few minutes.',
              })
            );
          }
          // TODO: add flash message ?
          closeDialog();
        });
      }
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
                    <div className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 pr-6">
                      Move
                      {value && value.lineType === 'folder' ? (
                        <>
                          <span> Folder: </span>
                          {value && value.folder && <span>{value.folder}</span>}
                        </>
                      ) : (
                        <>
                          <span> Document: </span>
                          {value && value.documentInstance && (
                            <span>{value.documentInstance.path}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div
                      className={
                        'flex py-1 px-2 cursor-pointer active:bg-gray-600 active:text-white ' +
                        (selectedFolderIndexKey === '/root/'
                          ? 'bg-gray-600 text-white hover:bg-gray-600 hover:text-white'
                          : 'text-inherit hover:bg-gray-200 hover:text-inherit')
                      }
                      onClick={(event) => toggleSelectedFolder(event, '/root/')}
                    >
                      <div className="mr-2 w-4">
                        <FolderSolid />
                      </div>
                      <div>(Root)</div>
                    </div>
                    {folders['root'].length > 0 ? (
                      <>
                        {folders['root'].map((folder: any, i: number) => {
                          return folderLine(folder, i);
                        })}
                        <div className="w-full flex justify-center mt-4">
                          <button
                            className={
                              'font-semibold py-2 px-4 mr-2 rounded-2xl ' +
                              (selectedFolderIndexKey.length
                                ? 'cursor-pointer bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white'
                                : 'cursor-default bg-gray-200 text-gray-400')
                            }
                            onClick={(event) => executeMove(event)}
                          >
                            Move
                            {value && value.lineType === 'folder' ? (
                              <span> Folder</span>
                            ) : (
                              <span> Document</span>
                            )}
                          </button>
                          <button
                            onClick={closeDialog}
                            className="bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex justify-center">
                        <Spinner />
                      </div>
                    )}
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
