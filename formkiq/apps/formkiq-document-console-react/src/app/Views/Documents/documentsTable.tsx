import { Ref, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomDragLayer from '../../Components/DocumentsAndFolders/CustomDragLayer/customDragLayer';
import DocumentListLine from '../../Components/DocumentsAndFolders/DocumentListLine/documentListLine';
import FolderDropWrapper from '../../Components/DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import FolderListLine from '../../Components/DocumentsAndFolders/FolderListLine/FolderListLine';
import {
  Download,
  RestoreFile,
  Spinner,
  Trash,
} from '../../Components/Icons/icons';
import { ConfigState } from '../../Store/reducers/config';
import { DocumentListState } from '../../Store/reducers/documentsList';
import { IDocument, RequestStatus } from '../../helpers/types/document';
import { IFolder } from '../../helpers/types/folder';
import { ILine } from '../../helpers/types/line';
import { useQueueId } from '../../hooks/queue-id.hook';
import { useSubfolderUri } from '../../hooks/subfolder-uri.hook';
import { EmptyDocumentsTable } from './EmptyDocumentsTable';

type DocumentTableProps = {
  documentsWrapperRef: Ref<any>;
  documentsScrollpaneRef: Ref<any>;
  onRestoreDocument: (documentId: string) => void;
  currentSiteId: string;
  currentDocumentsRootUri: string;
  isSiteReadOnly: boolean;
  onDocumentDataChange: (event: any, value: ILine | null) => void;
  filterTag: string | null;
  deleteFolder: (folder: IFolder | IDocument) => () => void;
  addToPendingArchive: (file: IDocument) => void;
  deleteFromPendingArchive: (file: IDocument) => void;
  archiveStatus: string;
  trackScrolling: () => void;
  infoDocumentId: string;
  onDocumentInfoClick: () => void;
  selectedDocuments: IDocument[];
  setSelectedDocuments: (selectedDocuments: IDocument[]) => void;
  onDeleteSelectedDocuments: (softDelete: boolean) => void;
  onRestoreSelectedDocuments: () => void;
  openArchiveTab : () => void;
  archiveTabStatus: "open" | "closed"| "minimized";
  getExpandedFoldersDocuments: (folders:IFolder[])=>IDocument[];
  downloadDocument: (documentId: string) => void;
};

export const DocumentsTable = (props: DocumentTableProps) => {
  const {
    documentsWrapperRef,
    documentsScrollpaneRef,
    onRestoreDocument,
    currentSiteId,
    onDocumentDataChange,
    currentDocumentsRootUri,
    filterTag,
    isSiteReadOnly,
    addToPendingArchive,
    deleteFromPendingArchive,
    archiveStatus,
    trackScrolling,
    infoDocumentId,
    onDocumentInfoClick,
    selectedDocuments,
    setSelectedDocuments,
    onDeleteSelectedDocuments,
    onRestoreSelectedDocuments,
    openArchiveTab,
    archiveTabStatus,
    getExpandedFoldersDocuments,
    downloadDocument
  } = props;

  const { formkiqVersion, useIndividualSharing, useSoftDelete } =
    useSelector(ConfigState);
  const { documents, folders, loadingStatus, isLastSearchPageLoaded } =
    useSelector(DocumentListState);

  const subfolderUri = useSubfolderUri();
  const queueId = useQueueId();
  const navigate = useNavigate();
  const pathname = decodeURI(useLocation().pathname);
  const search = useLocation().search;
  const scrollToDocumentLine = new URLSearchParams(search).get(
    'scrollToDocumentLine'
  );

  useEffect(() => {
    // load more items if bottom of a table is visible
    if (!documents || documents.length === 0) return; // prevent execution if documents are not loaded yet
    trackScrolling();
    // when user opens document folder after viewing document, scroll to list to display document line
    if (!scrollToDocumentLine) return;
    if (loadingStatus !== RequestStatus.fulfilled) return;
    const documentIndex = documents.findIndex(
      (doc) => doc.documentId === infoDocumentId
    );
    if (documentIndex === -1 && !isLastSearchPageLoaded) {
      const scrollpane = document.getElementById('documentsScrollpane');
      if (!scrollpane) return;
      scrollpane.scrollTo({
        top: scrollpane.scrollHeight,
      });
    } else if (documentIndex !== -1) {
      const documentLine = document.getElementById(infoDocumentId);
      if (!documentLine) return;
      documentLine.scrollIntoView({ block: 'end' });
      navigate(pathname + '#id=' + infoDocumentId);
    }
  }, [documents]);

  if (
    documents.length === 0 &&
    folders.length === 0 &&
    loadingStatus !== RequestStatus.pending
  ) {
    return (
      <EmptyDocumentsTable
        formkiqVersion={formkiqVersion}
        subfolderUri={subfolderUri}
        queueId={queueId}
      />
    );
  }

  const handleScroll = (event: any) => {
    const el = event.target;
    //track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 600 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // checkboxes functions
  function countVisibleDocuments(folders: IFolder[]): number {
    return folders.reduce((count, folder) => {
      if (folder.isExpanded) {
        return (
          count +
          folder.documents.length +
          countVisibleDocuments(folder.folders)
        );
      }
      return count;
    }, 0);
  }
  function getTotalVisibleDocuments(): number {
    return documents.length + countVisibleDocuments(folders);
  }
  const totalVisibleDocuments = getTotalVisibleDocuments();

  function toggleSelectAll() {
    if (selectedDocuments.length === totalVisibleDocuments) {
      unselectAllDocuments();
    } else {
      selectAllDocuments();
    }
  }
  function selectAllDocuments() {
    const expandedFoldersDocuments = getExpandedFoldersDocuments(folders);
    setSelectedDocuments([...documents, ...expandedFoldersDocuments]);
  }

  function unselectAllDocuments() {
    setSelectedDocuments([]);
  }

  function onDownloadClick() {
    if (selectedDocuments.length === 1) {
      if (!selectedDocuments[0].deepLinkPath || !selectedDocuments[0].deepLinkPath.length) {
        downloadDocument(selectedDocuments[0].documentId);
        return;
      }
    }
    openArchiveTab();
  }

  return (
    <div
      className="relative mt-5 overflow-hidden h-full"
      ref={documentsWrapperRef}
    >
      <div
        className="overflow-y-scroll overflow-x-auto h-full"
        ref={documentsScrollpaneRef}
        id="documentsScrollpane"
        onScroll={handleScroll}
      >
        <table
          className="border-separate border-spacing-0 table-auto w-full "
          id="documentsTable"
        >
          <thead className="sticky top-0 bg-neutral-100 z-10">
            <tr>
              <th
                scope="col"
                className="px-4 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 border-t border-b border-neutral-300"
              >
                <div className="flex items-center">
                  {archiveTabStatus === "closed" && (
                    <div className="inline-flex items-end">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        checked={
                          selectedDocuments.length > 0 &&
                          selectedDocuments.length === totalVisibleDocuments
                        }
                        onChange={toggleSelectAll}
                        className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900 mr-2 cursor-pointer"
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  )}
                  {subfolderUri !== 'deleted' &&
                    (selectedDocuments.length > 0 && archiveTabStatus === "closed" ? (
                      <div className="inline-flex items-end">

                      <button
                        onClick={() => onDeleteSelectedDocuments(useSoftDelete)}
                        className="w-8 h-8 p-2 relative text-neutral-700 hover:text-neutral-900 group ml-4"
                        title="Delete Selected"
                      >
                        <div className="relative z-10">
                          <Trash />
                        </div>
                        <div className="absolute inset-0 bg-neutral-200 rounded-full transition-all ease-out scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"></div>
                      </button>

                        <button
                          onClick={onDownloadClick}
                          className="w-8 h-8 p-2 relative text-neutral-700 hover:text-neutral-900 group"
                          title="Create Archive"
                        >
                          <div className="relative z-10">
                            <Download />
                          </div>
                          <div className="absolute inset-0 bg-neutral-200 rounded-full transition-all ease-out scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"></div>
                        </button>


                      </div>
                    ) : (
                      'Name'
                    ))}

                  {subfolderUri === 'deleted' &&
                    (selectedDocuments.length > 0 && archiveTabStatus === "closed" ? (
                      <>
                        <button
                          onClick={onRestoreSelectedDocuments}
                          className="w-8 h-8 p-1 relative text-neutral-700 hover:text-neutral-900 group ml-4"
                          title="Restore Selected"
                        >
                          <div className="relative z-10">
                            <RestoreFile />
                          </div>
                          <div className="absolute inset-0 bg-neutral-200 rounded-full transition-all ease-out scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"></div>
                        </button>
                        <button
                          onClick={() => onDeleteSelectedDocuments(false)}
                          className="w-8 h-8 p-[6px] relative text-red-500 hover:text-red-700 group"
                          title="Delete Permanently"
                        >
                          <div className="relative z-10">
                            <Trash />
                          </div>
                          <div className="absolute inset-0 bg-red-200 rounded-full transition-all ease-out scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"></div>
                        </button>
                      </>
                    ) : (
                      'Name'
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="w-38 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 border-t border-b border-neutral-300"
              >
                Last modified
              </th>
              <th
                scope="col"
                className="w-24 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 border-t border-b border-neutral-300"
              >
                Filesize
              </th>
              {useIndividualSharing && (
                <th
                  scope="col"
                  className="w-24 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 border-t border-b border-neutral-300"
                >
                  {subfolderUri === 'shared' && <span>Shared by</span>}
                  {subfolderUri !== 'shared' && <span>Access</span>}
                </th>
              )}
              <th
                scope="col"
                className="w-28 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 border-t border-b border-neutral-300"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="h-2"></td>
            </tr>
            {folders && <FolderDocumentsTable {...props} />}
            {documents.length === 0 &&
            folders.length === 0 &&
            loadingStatus === RequestStatus.pending ? (
              <tr>
                <td colSpan={6}>
                  <Spinner />
                </td>
              </tr>
            ) : undefined}
            {documents.map((file: any, i: number) => (
              <DocumentListLine
                key={i}
                file={file}
                folder={subfolderUri}
                siteId={currentSiteId}
                isSiteReadOnly={isSiteReadOnly}
                documentsRootUri={currentDocumentsRootUri}
                searchDocuments={documents}
                onRestoreClick={() => onRestoreDocument(file.documentId)}
                onDocumentDataChange={onDocumentDataChange}
                filterTag={filterTag}
                archiveStatus={archiveStatus}
                addToPendingArchive={addToPendingArchive}
                deleteFromPendingArchive={deleteFromPendingArchive}
                infoDocumentId={infoDocumentId}
                onDocumentInfoClick={onDocumentInfoClick}
                selectedDocuments={selectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
                archiveTabStatus={archiveTabStatus}
                downloadDocument={downloadDocument}
              />
            ))}
          </tbody>
        </table>
        {loadingStatus === RequestStatus.pending && documents.length > 0 && (
          <div className="absolute bottom-0 w-full flex justify-center">
            <Spinner />
          </div>
        )}
        <FolderDropWrapper
          className="absolute w-full h-full"
          folder={subfolderUri}
          sourceSiteId={currentSiteId}
          targetSiteId={currentSiteId}
        ></FolderDropWrapper>
      </div>
      <CustomDragLayer />
      <div className="pt-1">
        &nbsp;
        {loadingStatus === RequestStatus.pending ? <Spinner /> : ''}
      </div>
    </div>
  );
};

const FolderDocumentsTable = (props: DocumentTableProps) => {
  const subfolderUri = useSubfolderUri();
  const { folders } = useSelector(DocumentListState);

  const {
    onRestoreDocument,
    currentSiteId,
    onDocumentDataChange,
    currentDocumentsRootUri,
    filterTag,
    isSiteReadOnly,
    deleteFolder,
    addToPendingArchive,
    deleteFromPendingArchive,
    archiveStatus,
    selectedDocuments,
    setSelectedDocuments,
    archiveTabStatus,
    downloadDocument,
  } = props;

  return (
    <tr>
      <td colSpan={6}>
        {folders.map((folder: IFolder, j: number) => {
          return (
            <FolderListLine
              subfolder={subfolderUri}
              folderInstance={folder}
              key={j}
              currentSiteId={currentSiteId}
              isSiteReadOnly={isSiteReadOnly}
              onDeleteClick={deleteFolder}
              currentDocumentsRootUri={currentDocumentsRootUri}
              onDocumentDataChange={onDocumentDataChange}
              onRestoreDocument={onRestoreDocument}
              filterTag={filterTag}
              archiveStatus={archiveStatus}
              addToPendingArchive={addToPendingArchive}
              deleteFromPendingArchive={deleteFromPendingArchive}
              selectedDocuments={selectedDocuments}
              setSelectedDocuments={setSelectedDocuments}
              archiveTabStatus={archiveTabStatus}
              downloadDocument={downloadDocument}
            />
          );
        })}
      </td>
    </tr>
  );
};
