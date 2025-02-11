import { Dialog, Transition } from '@headlessui/react';
import {
  BeforeUploadEventArgs,
  SelectedEventArgs,
  UploaderComponent,
  UploadingEventArgs,
} from '@syncfusion/ej2-react-inputs';
import { Fragment, useEffect, useRef, useState } from 'react';
import { setCurrentActionEvent } from '../../../Store/reducers/config';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import {
  DocumentUploadedInfo,
  DocumentsService,
  IFileUploadData,
} from '../../../helpers/services/documentsService';
import { formatDate } from '../../../helpers/services/toolService';
import { Close } from '../../Icons/icons';

const foldersWithNoUpload = ['favorites', 'shared', 'deleted'];
const fileTypesMap = {
  // add here more filetypes if syncfusion does not recognize them
  md: 'text/markdown',
};

const uploadProcessLine = (fileData: IFileUploadData, i: number) => {
  return (
    <tr key={i}>
      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400">
        {fileData.originalFile.name}
      </td>
      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-primary-600 h-2.5 rounded-full"
            style={{
              width: `${Math.round(
                (fileData.uploadedSize / fileData.originalFile.size) * 100
              )}%`,
            }}
          ></div>
        </div>
      </td>
    </tr>
  );
};
const uploadProcessTable = (filesData: IFileUploadData[]) => {
  if (filesData?.length > 0) {
    return (
      <div className="relative rounded-xl overflow-auto max-h-64 overflow-y-scroll">
        <div className="shadow-sm overflow-hidden my-8">
          <div className="font-bold text-lg inline-block pr-6 pb-6">
            Uploading files:
          </div>
          <table className="border-collapse table-fixed w-full text-sm">
            <thead>
              <tr>
                <th className="border-b nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                  Filename
                </th>
                <th className="border-b nodark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white nodark:bg-slate-800">
              {filesData.map((file, i) => {
                return uploadProcessLine(file, i);
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
export default function UploadModal({
  isOpened,
  onClose,
  siteId,
  formkiqVersion,
  folder,
  documentId,
  isFolderUpload,
  onDocumentDataChange,
  dropUploadDocuments,
  resetDropUploadDocuments,
  folderPath,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  formkiqVersion: any;
  folder: string;
  documentId: string;
  isFolderUpload: boolean;
  onDocumentDataChange: any;
  dropUploadDocuments?: any;
  resetDropUploadDocuments?: any;
  folderPath: string;
}) {
  const dispatch = useAppDispatch();
  const cancelButtonRef = useRef(null);
  const uploaderRef = useRef<UploaderComponent>(null);
  const [uploadedDocs, setUploaded] = useState([]);
  const [notUploadedDocs, setNotUploadedDocs] = useState<string[]>([]);
  const [uploadProcessDocs, setUploadProcess]: [
    uploadProcessDocs: IFileUploadData[],
    setUploadProcess: any
  ] = useState([]);
  const [isAiScanEnabled, setIsAiScanEnabled] = useState(false);
  const [uploadData, setUploadData]: [
    uploadData: { event: any; fileData: IFileUploadData | null },
    setUploadData: any
  ] = useState({
    event: null,
    fileData: null,
  });

  let allowMultipleFiles = true;
  if (documentId.length) {
    allowMultipleFiles = false;
  }

  useEffect(() => {
    if (!dropUploadDocuments) return;
    setTimeout(() => {
      const uploader = document.getElementById('uploader') as HTMLInputElement;
      if (!uploader) return;
      uploader.files = dropUploadDocuments;
      uploader.dispatchEvent(new Event('change'));
    }, 0);
  }, [dropUploadDocuments]);

  useEffect(() => {
    const siteId = DocumentsService.determineSiteId();
    DocumentsService.getConfiguration(siteId).then((response) => {
      if (response.chatGptApiKey) {
        setIsAiScanEnabled(true);
      }
    });
  }, []);

  useEffect(() => {
    if (uploadData.event) {
      let index = -1;
      for (let i = 0; i < uploadProcessDocs.length; i++) {
        if (
          uploadData.fileData?.originalFile ===
          uploadProcessDocs[i].originalFile
        ) {
          index = i;
        }
      }
      if (index >= 0) {
        const newDocs = [...uploadProcessDocs];
        newDocs[index] = {
          ...newDocs[index],
          uploadedSize: uploadData.event.loaded,
        };
        setUploadProcess(newDocs);
      }
    }
  }, [uploadData]);

  const onBeforeUpload = (args: BeforeUploadEventArgs) => {
    // console.log(args);
  };

  const onUploading = (args: UploadingEventArgs) => {
    // console.log(args);
  };

  const onFilesSelected = (args: SelectedEventArgs) => {
    // console.log(args);
  };

  const closeDialog = () => {
    if (resetDropUploadDocuments) resetDropUploadDocuments();
    setUploaded([]);
    setNotUploadedDocs([]);
    onClose();
  };

  const onprogress = function (data: IFileUploadData) {
    return function (event: any) {
      setUploadData({
        event,
        fileData: data,
      });
      // console.log(event.loaded + ' / ' + event.total);
    };
  };

  interface UploadResponse {
    status: number;
    file: { name: string };
    errors?: { error: string }[];
  }

  function handleFileUploadErrors(
    responses: UploadResponse[],
    dispatch: (action: any) => void
  ) {
    const notUploadedFilesErrors: {
      fileName: string;
      errorMessage: string;
    }[] = responses
      .filter((response) => response.status !== 200)
      .map((response) => ({
        fileName: response.file.name,
        errorMessage: response.errors
          ? response.errors.map((err) => err.error).join(', ')
          : '',
      }));

    if (notUploadedFilesErrors.length > 0) {
      const errorMessages = notUploadedFilesErrors.map(
        (error) =>
          `${error.fileName}  ${
            error.errorMessage !== '' && ': ' + error.errorMessage
          }`
      );
      dispatch(
        openDialog({
          dialogTitle: `Error uploading files: \n ${errorMessages.join('\n')}`,
        })
      );
    }
    return notUploadedFilesErrors;
  }

  const uploadFiles = () => {
    if (uploaderRef.current) {
      const filesData: IFileUploadData[] = uploaderRef.current
        .getFilesData()
        .map((e: any) => {
          let newFile = e.rawFile;
          // manually update file types that are not recognized by syncfusion uploader
          const fileExtension = e.rawFile.name.split('.').pop();
          const mimeType =
            fileTypesMap[fileExtension as keyof typeof fileTypesMap];
          if (mimeType) {
            newFile = new File([e.rawFile], e.rawFile.name, {
              type: mimeType,
            });
          }
          const obj: IFileUploadData = {
            originalFile: newFile,
            uploadedSize: 0,
          };
          return obj;
        });
      setUploadProcess(filesData);
      let uploadFolder = folder;
      if (foldersWithNoUpload.indexOf(uploadFolder) > -1) {
        uploadFolder = '';
      }
      if (documentId.length) {
        DocumentsService.uploadNewDocumentVersions(
          documentId,
          siteId,
          filesData,
          onprogress
        ).then((res) => {
          const ids = res
            .filter((item) => {
              return item.status === 200;
            })
            .map((item) => {
              return item.documentId;
            });
          const notUploadedFilesErrors: {
            fileName: string;
            errorMessage: string;
          }[] = handleFileUploadErrors(res, dispatch);
          DocumentsService.getDocumentsById(ids, siteId).then(
            (uploaded: []) => {
              setUploadProcess([]);
              // NOTE: 'fulltext' has been replaced with 'opensearch' and 'typesense', but this should not trigger for now
              if (formkiqVersion.modules?.indexOf('fulltext') > -1) {
                const actions = [{ type: 'fulltext' }];
                uploaded.forEach((doc: any) => {
                  DocumentsService.postDocumentActions(
                    doc.documentId,
                    actions,
                    siteId
                  );
                });
              }
              setUploaded([...uploadedDocs, ...uploaded]);
              setNotUploadedDocs(notUploadedFilesErrors.map((f) => f.fileName));
              onDocumentDataChange();
            }
          );
        });
      } else {
        DocumentsService.uploadDocuments(
          uploadFolder,
          siteId,
          formkiqVersion,
          filesData,
          onprogress
        ).then((res) => {
          const ids = res
            .filter((item) => {
              return item.status === 200;
            })
            .map((item) => {
              return item.documentId;
            });
          const notUploadedFilesErrors: {
            fileName: string;
            errorMessage: string;
          }[] = handleFileUploadErrors(res, dispatch);
          DocumentsService.getDocumentsById(ids, siteId).then(
            (uploaded: []) => {
              setUploadProcess([]);
              // TODO: get file data and match ?
              const uploadedDocuments = [...uploaded];
              uploadedDocuments.forEach((doc: any) => {
                const matchingFiles = filesData.filter((file: any) => {
                  let filename = doc.path;
                  if (!filename) {
                    return false;
                  }
                  if (filename.lastIndexOf('/') > -1) {
                    filename = filename.substring(
                      filename.lastIndexOf('/') + 1
                    );
                  }
                  return (
                    file.originalFile.name ===
                    filename.replace(' (' + doc.documentId + ')', '')
                  );
                });
                if (matchingFiles.length === 1) {
                  doc.contentType = matchingFiles[0].originalFile.type;
                }
              });
              const actions: any = [];
              const actionCheckboxAntivirus = document.getElementById(
                'actionCheckboxAntivirus'
              );
              const actionCheckboxOcr =
                document.getElementById('actionCheckboxOcr');
              const actionCheckboxTypesense = document.getElementById(
                'actionCheckboxTypesense'
              );
              const actionCheckboxOpensearch = document.getElementById(
                'actionCheckboxOpensearch'
              );
              const actionCheckboxDocumentTypeTag = document.getElementById(
                'actionCheckboxDocumentTypeTag'
              );
              if (
                actionCheckboxAntivirus &&
                (actionCheckboxAntivirus as HTMLInputElement).checked
              ) {
                actions.push({
                  type: 'antivirus',
                });
              }
              if (
                actionCheckboxOcr &&
                (actionCheckboxOcr as HTMLInputElement).checked
              ) {
                actions.push({
                  type: 'ocr',
                  parseTypes: 'TEXT',
                });
              }
              if (
                (actionCheckboxTypesense &&
                  (actionCheckboxTypesense as HTMLInputElement).checked) ||
                (actionCheckboxOpensearch &&
                  (actionCheckboxOpensearch as HTMLInputElement).checked)
              ) {
                actions.push({
                  type: 'fulltext',
                });
              }
              if (
                actionCheckboxDocumentTypeTag &&
                (actionCheckboxDocumentTypeTag as HTMLInputElement).checked
              ) {
                actions.push({
                  type: 'documenttagging',
                  parameters: {
                    engine: 'chatgpt',
                    tags: 'document type',
                    /*tags: 'document type,sender name,recipient name,total amount',*/
                    /*tags: 'document type,meeting date,chairperson,secretary,board members,resolutions',*/
                    /*tags: 'document type,contract purpose,party names,party addresses,clause names',*/
                  },
                });
              }

              // TODO: check file type before requesting incompatible actions
              // e.g.: OcrContentTypes.indexOf(doc.contentType) > -1

              uploaded.forEach((doc: any) => {
                DocumentsService.postDocumentActions(
                  doc.documentId,
                  actions,
                  siteId
                );
              });

              setUploaded([...uploadedDocs, ...uploaded]);
              setNotUploadedDocs(notUploadedFilesErrors.map((f) => f.fileName));
              onDocumentDataChange();
            }
          );
        });
      }
      uploaderRef.current.clearAll();
    }
  };
  const clearFileList = () => {
    if (uploaderRef.current) {
      uploaderRef.current.clearAll();
    }
  };
  const addToOcr = (event: any, document: DocumentUploadedInfo) => {
    const docs = [...uploadedDocs];
    const actions = [] as any[];
    docs.forEach((doc: any) => {
      if (doc.documentId === document.documentId) {
        doc.processingOcrWorkflow = true;
        doc.submittedOcrWorkflow = false;
        DocumentsService.getDocumentActions(document.documentId).then(
          (docActionsRes) => {
            docActionsRes.actions.forEach((action: any, i: number) => {
              if (!action.type || action.type !== 'fulltext') {
                actions.push({ type: action.type });
              }
            });
            actions.push({ type: 'ocr' });
            actions.push({ type: 'fulltext' });
            DocumentsService.putDocumentActions(
              document.documentId,
              actions,
              siteId
            ).then((res) => {
              if (res.status === 200) {
                onFulltextActionSubmitted(document);
              } else {
                dispatch(
                  openDialog({
                    dialogTitle:
                      'An error has occurred. Please try again in a few minutes.',
                  })
                );
              }
            });
          }
        );
      }
    });
    setUploaded(docs);
  };

  const onFulltextActionSubmitted = (document: DocumentUploadedInfo) => {
    const docs = [...uploadedDocs];
    docs.forEach((doc: any) => {
      if (doc.documentId === document.documentId) {
        doc.processingOcrWorkflow = false;
        doc.submittedOcrWorkflow = true;
      }
    });
    setUploaded(docs);
  };

  const uploadedFileLine = (file: DocumentUploadedInfo, i: number) => {
    return (
      <tr key={i}>
        <td
          className="border-b border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400 break-words"
          data-test-id={`uploaded-files-${i}`}
        >
          {file.path}
        </td>
        <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400">
          {file.userId}
        </td>
        <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400">
          {formatDate(file.insertedDate)}
        </td>
      </tr>
    );
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
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
              <Dialog.Panel
                data-test-id="upload-document-modal"
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-xl"
              >
                <div
                  className={
                    `px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ` +
                    (documentId.length ? 'bg-neutral-300' : 'bg-white')
                  }
                >
                  <div
                    className={
                      'flex-1 bg-white border-2 rounded-md p-5 inline-block w-full ' +
                      (documentId.length
                        ? 'border-neutral-500'
                        : 'border-neutral-300')
                    }
                  >
                    <div className="font-bold text-lg inline-block pr-6">
                      {documentId.length ? (
                        <span>Upload New Version</span>
                      ) : (
                        <>
                          {isFolderUpload ? (
                            <>
                              <span>
                                Add All Documents from Within a Folder
                              </span>
                              <span className="block text-sm pb-4">
                                NOTE: these will add the documents as files
                                within the current folder; if you want to add
                                these files into their own subfolder, please
                                create that subfolder first, and then upload
                                from inside that new folder.
                              </span>
                            </>
                          ) : (
                            <span>Add Documents</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className={'overflow-auto max-h-64 mb-4'}>
                      <UploaderComponent
                        ref={uploaderRef}
                        id="uploader"
                        showFileList={true}
                        autoUpload={true}
                        uploading={onUploading}
                        beforeUpload={onBeforeUpload}
                        selected={onFilesSelected}
                        multiple={allowMultipleFiles}
                        directoryUpload={isFolderUpload}
                        maxFileSize={5e9}
                      />
                    </div>
                    <div className="flex flex-wrap">
                      <h4 className="w-full text-lg font-bold mb-2 px-2 py-1 bg-gray-100">
                        Location: {folderPath}
                      </h4>
                      <h4 className="w-full font-semibold">
                        Run the following actions, when available:
                      </h4>
                      <div className="mt-2 mb-5 w-full flex text-sm">
                        {formkiqVersion.modules?.indexOf('antivirus') > -1 && (
                          <div className="px-4">
                            <input
                              id="actionCheckboxAntivirus"
                              type="checkbox"
                            />
                            <label
                              htmlFor="actionCheckboxAntivirus"
                              className="pl-2 font-semibold cursor-pointer"
                            >
                              Scan Document for Viruses and Other Malware
                            </label>
                          </div>
                        )}
                        <div className="px-4">
                          <input id="actionCheckboxOcr" type="checkbox" />
                          <label
                            htmlFor="actionCheckboxOcr"
                            className="pl-2 font-semibold cursor-pointer"
                          >
                            Retrieve and Store Content Using OCR
                          </label>
                        </div>
                        {formkiqVersion.modules?.indexOf('typesense') > -1 &&
                          formkiqVersion.modules?.indexOf('opensearch') ===
                            -1 && (
                            <div className="px-4">
                              <input
                                id="actionCheckboxTypesense"
                                type="checkbox"
                              />
                              <label
                                htmlFor="actionCheckboxTypesense"
                                className="pl-2 font-semibold cursor-pointer"
                              >
                                Add Content to Fulltext Search
                              </label>
                            </div>
                          )}
                        {formkiqVersion.modules?.indexOf('opensearch') > -1 && (
                          <div className="px-4">
                            <input
                              id="actionCheckboxOpensearch"
                              type="checkbox"
                            />
                            <label
                              htmlFor="actionCheckboxOpensearch"
                              className="pl-2 font-semibold cursor-pointer"
                            >
                              Add Content to Fulltext Search
                            </label>
                          </div>
                        )}
                        {isAiScanEnabled && (
                          <div className="px-4">
                            <input
                              id="actionCheckboxDocumentTypeTag"
                              type="checkbox"
                            />
                            <label
                              htmlFor="actionCheckboxDocumentTypeTag"
                              className="pl-2 font-semibold cursor-pointer"
                            >
                              Use Content to Determine Document Type
                              <span className="text-xs block">
                                (requires OpenAI API Key)
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        data-test-id="upload"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-primary-500 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={uploadFiles}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        data-test-id="clear-file-list"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={clearFileList}
                      >
                        Clear
                      </button>
                      {isFolderUpload ? (
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={(event) => {
                            closeDialog();
                            dispatch(setCurrentActionEvent('upload'));
                          }}
                          ref={cancelButtonRef}
                        >
                          Upload Files Instead...
                        </button>
                      ) : (
                        <>
                          {!documentId.length && (
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => {
                                closeDialog();
                                dispatch(setCurrentActionEvent('folderUpload'));
                              }}
                              ref={cancelButtonRef}
                            >
                              Upload the Contents of an Entire Folder Instead...
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex justify-between mr-8"></div>
                    <div>{uploadProcessTable(uploadProcessDocs)}</div>
                    {uploadedDocs.length > 0 && (
                      <div className="relative rounded-xl">
                        <div className="shadow-sm overflow-hidden my-8">
                          <div className="font-bold text-lg inline-block pr-6 pb-6">
                            Uploaded files:
                          </div>
                          <div className=" max-h-56 overflow-y-auto">
                            <table className="border-separate border-spacing-0 table-fixed w-full text-sm border-none">
                              <thead className="sticky top-0 bg-white">
                                <tr>
                                  <th
                                    className="border-b border-t border-white nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left"
                                    data-test-id="uploaded-filename"
                                  >
                                    Filename
                                  </th>
                                  <th className="border-b border-t border-white nodark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                                    Uploaded by
                                  </th>
                                  <th className="border-b border-t border-white nodark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                                    Date added
                                  </th>
                                  <th className="hidden border-b nodark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">
                                    Workflow(s)
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white nodark:bg-slate-800">
                                {uploadedDocs.map((file, i) => {
                                  return uploadedFileLine(file, i);
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                    {notUploadedDocs.length > 0 && (
                      <div className="relative rounded-xl">
                        <div className="shadow-sm overflow-hidden my-8">
                          <div className="font-bold text-lg inline-block pr-6 pb-6">
                            Files not uploaded:
                          </div>
                          <div className=" max-h-56 overflow-y-auto">
                            <table className="border-separate border-spacing-0 table-fixed w-full text-sm border-none">
                              <thead className="sticky top-0 bg-white">
                                <tr>
                                  <th
                                    className="border-b border-t border-white nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left"
                                    data-test-id="uploaded-filename"
                                  >
                                    Filename
                                  </th>
                                  <th className="border-b border-t border-white nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left"></th>
                                </tr>
                              </thead>
                              <tbody className="bg-white nodark:bg-slate-800">
                                {notUploadedDocs.map((fileName, i) => {
                                  return (
                                    <tr key={i + fileName}>
                                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500">
                                        {fileName}
                                      </td>
                                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-red-500 flex gap-2">
                                        <div className="w-5 h-5 mr-2 ">
                                          <Close />
                                        </div>
                                        Error: File upload failed.
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex pt-4 justify-between mr-8">
                    <div></div>
                    <button
                      type="button"
                      data-test-id="upload-modal-close"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeDialog}
                      ref={cancelButtonRef}
                    >
                      Close
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
