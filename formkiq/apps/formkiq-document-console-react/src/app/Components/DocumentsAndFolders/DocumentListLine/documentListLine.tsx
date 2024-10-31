import { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import { ConfigState } from '../../../Store/reducers/config';
import {
  addDocumentTag,
  removeDocumentTag,
} from '../../../Store/reducers/documentsList';
import { useAppDispatch } from '../../../Store/store';
import {
  InlineEditableContentTypes,
  TextFileEditorEditableContentTypes,
} from '../../../helpers/constants/contentTypes';
import { DocumentsService } from '../../../helpers/services/documentsService';
import {
  formatBytes,
  formatDate,
  getFileIcon,
  isTagValueIncludes,
} from '../../../helpers/services/toolService';
import { IDocument } from '../../../helpers/types/document';
import ButtonSecondary from '../../Generic/Buttons/ButtonSecondary';
import {
  Checkmark,
  Info,
  Minus,
  Pencil,
  Plus,
  Share,
  Star,
  StarFilled,
  Trash,
} from '../../Icons/icons';
import { useDocumentActions } from '../DocumentActionsPopover/DocumentActionsContext';
import DocumentActionsPopover from '../DocumentActionsPopover/documentActionsPopover';
import DocumentTagsPopover from '../DocumentTagsPopover/documentTagsPopover';

function DocumentListLine({
  file,
  folder,
  siteId,
  isSiteReadOnly,
  documentsRootUri,
  onRestoreClick,
  onDocumentDataChange,
  leftOffset = 0,
  addToPendingArchive,
  deleteFromPendingArchive,
  archiveStatus,
  infoDocumentId,
  onDocumentInfoClick,
  selectedDocuments,
  setSelectedDocuments,
  archiveTabStatus,
}: {
  file: any;
  folder: any;
  siteId: string;
  isSiteReadOnly: boolean;
  documentsRootUri: string;
  searchDocuments: any;
  onRestoreClick: any;
  onDocumentDataChange: any;
  filterTag: string | null;
  leftOffset?: number;
  addToPendingArchive?: (file: IDocument) => void;
  deleteFromPendingArchive?: (file: IDocument) => void;
  archiveStatus?: string;
  infoDocumentId?: string;
  onDocumentInfoClick?: () => void;
  selectedDocuments: IDocument[];
  setSelectedDocuments: (documents: IDocument[]) => void;
  archiveTabStatus?: 'open' | 'closed' | 'minimized';
}) {
  const [isFavorited, setFavorited] = useState(false);
  const [timeoutId, setTimeOutId] = useState(null);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { user } = useAuthenticatedState();
  const [keyOnlyAttributesKeys, setKeyOnlyAttributesKeys] = useState<string[]>(
    []
  );

  const {
    formkiqVersion,
    tagColors,
    useCollections,
    useSoftDelete,
    useIndividualSharing,
    pendingArchive,
  } = useSelector(ConfigState);

  const {
    onShareClick,
    onDeleteClick,
    onSubmitForReviewModalClick,
    onDocumentReviewModalClick,
  } = useDocumentActions();

  const restoreDocument = () => {
    onRestoreClick();
  };

  const [{ opacity, isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'file',
      item: file,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging(),
      }),
      canDrag: !isSiteReadOnly,
    }),
    [file]
  );
  useEffect(() => {
    preview(getEmptyImage());
  }, []);

  useEffect(() => {
    if (file.tags) {
      if (isTagValueIncludes(file?.tags?.sysFavoritedBy, user.email)) {
        setFavorited(true);
      } else {
        setFavorited(false);
      }
    }
  }, [file]);

  const toggleFavorite = () => {
    let fav = isFavorited;
    if (timeoutId) {
      // wait before make request, take latest value
      clearInterval(timeoutId);
    }
    fav = !fav;
    setFavorited(fav);
    setTimeOutId(
      setTimeout(() => {
        if (fav) {
          if (!isTagValueIncludes(file?.tags?.sysFavoritedBy, user.email)) {
            // if user not added to favoritedBy
            dispatch(
              addDocumentTag({
                doc: file,
                tagKey: 'sysFavoritedBy',
                valueToAdd: user.email,
              })
            );
            DocumentsService.addValueOrCreateTag(
              file.documentId,
              siteId,
              'sysFavoritedBy',
              file?.tags?.sysFavoritedBy,
              user.email
            ).then(() => {});
          }
        } else {
          if (isTagValueIncludes(file?.tags?.sysFavoritedBy, user.email)) {
            // if user added to favoritedBy
            dispatch(
              removeDocumentTag({
                doc: file,
                tagKey: 'sysFavoritedBy',
                valueToRemove: user.email,
              })
            );
            DocumentsService.deleteTagOrValueFromTag(
              file.documentId,
              siteId,
              'sysFavoritedBy',
              file?.tags?.sysFavoritedBy,
              user.email
            ).then(() => {});
          }
        }
      }, 1000) as any
    );
  };

  let pageSubfolderLevel = 0;
  if (folder.length) {
    pageSubfolderLevel = folder.split('/').length;
  }
  let lineSubfolderLevel = 0;
  if (file.path.indexOf('/') > -1) {
    lineSubfolderLevel = file.path.replace(/^\//, '').split('/').length - 1;
  }

  function onInfoClick() {
    if (!onDocumentInfoClick) return;
    if (infoDocumentId === file.documentId) {
      onDocumentInfoClick();
    }
  }

  useEffect(() => {
    if (!file.attributes) {
      setKeyOnlyAttributesKeys([]);
      return;
    }
    const attributesKeys = Object.keys(file.attributes);
    if (attributesKeys.length === 0) {
      setKeyOnlyAttributesKeys([]);
      return;
    }
    const keyOnlyAttributes = attributesKeys.filter(
      (key) => file.attributes[key].valueType === 'KEY_ONLY'
    );
    setKeyOnlyAttributesKeys(keyOnlyAttributes);
  }, [file]);

  // checkboxes functions
  function addToSelectedDocuments(document: IDocument) {
    setSelectedDocuments([...selectedDocuments, document]);
  }

  function removeFromSelectedDocuments(documentId: string) {
    setSelectedDocuments(
      selectedDocuments.filter((document) => document.documentId !== documentId)
    );
  }

  return (
    <>
      <tr
        className={`text-sm tracking-normal  file-drop-wrapper ${
          infoDocumentId === file.documentId && 'bg-neutral-100'
        }`}
        id={file.documentId}
        data-test-id={`${file.path}`}
        ref={drag}
        style={{
          opacity,
          visibility: isDragging ? 'hidden' : 'inherit',
          scrollMarginBottom: '160px',
        }}
      >
        <td className={`text-neutral-900 table-cell pl-${leftOffset} relative`}>
          <div className="flex w-full justify-start">
            {archiveTabStatus === 'closed' && (
              <div className="flex items-center justify-center">
                {folder !== 'deleted' &&
                folder !== 'shared' &&
                folder !== 'recent' &&
                folder !== 'favorites' ? (
                  <div
                    className={
                      lineSubfolderLevel === pageSubfolderLevel ? 'w-5 ' : 'w-1'
                    }
                  ></div>
                ) : (
                  <div className="w-5"></div>
                )}
                <input
                  id="checkbox-all"
                  type="checkbox"
                  checked={
                    selectedDocuments.findIndex(
                      (document) => document.documentId === file.documentId
                    ) > -1
                  }
                  onChange={() =>
                    selectedDocuments.findIndex(
                      (document) => document.documentId === file.documentId
                    ) > -1
                      ? removeFromSelectedDocuments(file.documentId)
                      : addToSelectedDocuments(file)
                  }
                  className="rounded-none w-4 h-4 bg-transparent  border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900 cursor-pointer"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  Select Document
                </label>
              </div>
            )}
            {archiveTabStatus !== 'closed' &&
              (archiveStatus === 'INITIAL' || archiveStatus === 'COMPLETE') &&
              (!(file as IDocument).deepLinkPath ||
                ((file as IDocument).deepLinkPath?.length ?? 0) === 0) &&
              (pendingArchive.findIndex(
                (document) => document.documentId === file.documentId
              ) === -1 ? (
                <div
                  className={
                    `py-2 ml-2 px-1 cursor-pointer text-neutral-900 hover:text-primary-500 ` +
                    (lineSubfolderLevel === pageSubfolderLevel
                      ? '-mr-1'
                      : 'mr-2')
                  }
                  onClick={
                    addToPendingArchive
                      ? () => addToPendingArchive(file)
                      : undefined
                  }
                >
                  <div className="w-4 h-auto ">
                    <Plus />
                  </div>
                </div>
              ) : (
                <div
                  className={
                    `py-2 ml-2 px-1 cursor-pointer text-neutral-900 hover:text-primary-500 ` +
                    (lineSubfolderLevel === pageSubfolderLevel
                      ? '-mr-1'
                      : 'mr-2')
                  }
                  onClick={
                    deleteFromPendingArchive
                      ? () => deleteFromPendingArchive(file)
                      : undefined
                  }
                >
                  <div className="w-4 h-auto" data-test-id="delete-action">
                    <Minus />
                  </div>
                </div>
              ))}
            {folder !== 'deleted' &&
            folder !== 'shared' &&
            folder !== 'recent' &&
            folder !== 'favorites' ? (
              <div
                className={
                  lineSubfolderLevel === pageSubfolderLevel ? 'w-5 ' : 'w-1'
                }
              ></div>
            ) : (
              <div className="w-5"></div>
            )}
            {folder === 'deleted' ? (
              <span className="w-16 flex items-center justify-start">
                <img
                  src={getFileIcon(file.path, file.deepLinkPath)}
                  className="w-8 inline-block"
                  alt="icon"
                />
              </span>
            ) : (
              <Link
                to={`${documentsRootUri}/${file.documentId}/view`}
                className="cursor-pointer w-16 flex items-center justify-start"
              >
                <img
                  src={getFileIcon(file.path, file.deepLinkPath)}
                  className="w-8 inline-block"
                  alt="icon"
                />
              </Link>
            )}
            <div className="grow flex">
              {folder === 'deleted' ? (
                <span
                  className="pt-1.5 flex items-center"
                  style={{
                    fontWeight:
                      selectedDocuments &&
                      selectedDocuments.findIndex(
                        (document) => document.documentId === file.documentId
                      ) > -1
                        ? '700'
                        : '400',
                  }}
                >
                  {file.path.length > 120 ? (
                    <span className="tracking-tighter text-clip overflow-hidden">
                      {file.path.substring(0, 120)}
                      {file.path.length > 120 && <span>...</span>}
                    </span>
                  ) : (
                    <span>{file.path}</span>
                  )}
                </span>
              ) : (
                <Link
                  to={`${documentsRootUri}/${file.documentId}/view`}
                  className="cursor-pointer pt-1.5 flex items-center"
                  title={file.path.substring(file.path.lastIndexOf('/') + 1)}
                  style={{
                    fontWeight:
                      selectedDocuments &&
                      selectedDocuments.findIndex(
                        (document) => document.documentId === file.documentId
                      ) > -1
                        ? '700'
                        : '400',
                  }}
                >
                  <span>
                    {file.path.substring(file.path.lastIndexOf('/') + 1)
                      .length > 80 ? (
                      <span className="tracking-tighter text-clip overflow-hidden">
                        {file.path.substring(
                          file.path.lastIndexOf('/') + 1,
                          file.path.lastIndexOf('/') + 80
                        )}
                        {file.path.substring(file.path.lastIndexOf('/') + 1)
                          .length > 80 && <span>...</span>}
                      </span>
                    ) : (
                      <span>
                        {file.path.substring(file.path.lastIndexOf('/') + 1)}
                      </span>
                    )}
                  </span>
                </Link>
              )}
              {folder !== 'deleted' && (
                <div className="grow flex items-center justify-end pt-1.5 pr-4">
                  <div className="flex flex-wrap justify-end w-52">
                    {keyOnlyAttributesKeys &&
                      keyOnlyAttributesKeys.map((attributeKey, i) => {
                        let tagColor = 'gray';
                        if (tagColors) {
                          tagColors.forEach((color) => {
                            if (color.tagKeys.indexOf(attributeKey) > -1) {
                              tagColor = color.colorUri;
                              return;
                            }
                          });
                        }
                        return (
                          <div
                            className="pt-0.5 pr-1 flex"
                            key={'attribute_' + i}
                          >
                            <div
                              className={`h-5.5 pl-2 rounded-l-md pr-1 bg-${tagColor}-200 whitespace-nowrap`}
                            >
                              {attributeKey}
                            </div>
                            <div
                              className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}
                            ></div>
                          </div>
                        );
                      })}
                    {(TextFileEditorEditableContentTypes.indexOf(
                      file.contentType
                    ) > -1 ||
                      InlineEditableContentTypes.indexOf(file.contentType) >
                        -1) &&
                      !isSiteReadOnly && (
                        <Link
                          title="Edit Document"
                          to={`${documentsRootUri}/${file.documentId}/edit`}
                          className="w-6 pt-0.5 text-neutral-900 mr-1 cursor-pointer hover:text-primary-500"
                        >
                          <Pencil />
                        </Link>
                      )}

                    {file.tags &&
                      Object.getOwnPropertyNames(file.tags)
                        .sort() // This will sort the property names alphabetically
                        .map((propertyName, i) => {
                          let showTag = false;
                          const tagsToIgnore = [
                            'sysFavoritedBy',
                            'sysSharedWith',
                            'sysDeletedBy',
                            'untagged',
                            'path',
                          ];
                          let tagColor = 'gray';
                          if (tagColors) {
                            tagColors.forEach((color) => {
                              if (color.tagKeys.indexOf(propertyName) > -1) {
                                tagColor = color.colorUri;
                                return;
                              }
                            });
                          }
                          if (
                            tagsToIgnore.indexOf(propertyName) === -1 &&
                            !file.tags[propertyName].length
                          ) {
                            showTag = true;
                          }
                          return (
                            <div key={i}>
                              {showTag && (
                                <div className="pt-0.5 pr-1 flex">
                                  <div
                                    className={`h-5.5 pl-2 rounded-l-md pr-1 bg-${tagColor}-200 whitespace-nowrap`}
                                  >
                                    {propertyName}
                                  </div>
                                  <div
                                    className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}
                                  ></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                  </div>
                  <div className="flex">
                    <div className="w-4 h-4 text-neutral-900 ml-2 -mt-1 cursor-pointer hover:text-primary-500">
                      <DocumentTagsPopover
                        value={{
                          lineType: 'document',
                          folder: folder,
                          documentId: file.documentId,
                        }}
                        onDocumentDataChange={onDocumentDataChange}
                        siteId={siteId}
                        isSiteReadOnly={isSiteReadOnly}
                        tagColors={tagColors}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {folder !== 'deleted' &&
              (location.pathname.indexOf('/queues') === -1 ? (
                <button
                  title="Submit for review"
                  className="w-5 pt-0.5 text-neutral-900 mr-3 cursor-pointer hover:text-primary-500"
                  onClick={(event) =>
                    onSubmitForReviewModalClick(event, {
                      lineType: 'document',
                      documentId: file.documentId,
                      folder: folder,
                      documentInstance: file,
                    })
                  }
                >
                  <Checkmark />
                </button>
              ) : (
                <button
                  title="Review"
                  className="w-5 pt-0.5 text-neutral-900 mr-3 cursor-pointer hover:text-primary-500"
                  onClick={(event) =>
                    onDocumentReviewModalClick(event, {
                      lineType: 'document',
                      documentId: file.documentId,
                      folder: folder,
                      documentInstance: file,
                    })
                  }
                >
                  <Checkmark />
                </button>
              ))}
            {folder !== 'deleted' && (
              <Link
                to={`${location.pathname}?${searchParams.toString()}#id=${
                  file.documentId
                }`}
                className="w-5 pt-0.5 text-neutral-900 mr-1 cursor-pointer hover:text-primary-500"
                onClick={onInfoClick}
              >
                <Info />
              </Link>
            )}
            {folder !== 'deleted' && !isSiteReadOnly && (
              <div
                onClick={toggleFavorite}
                className="w-5 text-neutral-900  mr-4 cursor-pointer px-2 box-content hover:text-primary-500"
              >
                {isFavorited ? StarFilled() : Star()}
              </div>
            )}
          </div>
        </td>
        <td className="w-38 p-2 pt-3 text-neutral-900 block tracking-normal lg:table-cell relative lg:static">
          {formatDate(file.lastModifiedDate)}
        </td>
        <td className="w-24 p-2 pt-3 text-neutral-900 block tracking-normal lg:table-cell relative lg:static">
          {formatBytes(file.contentLength)}
        </td>
        {useIndividualSharing && (
          <td className="w-24 p-2 pt-3 text-neutral-900 block tracking-normal lg:table-cell relative lg:static">
            Private
          </td>
        )}
        <td className="w-28 p-2 pt-3 text-neutral-900 block lg:table-cell relative lg:static">
          <div className="flex">
            {folder === 'deleted' ? (
              <>
                <ButtonSecondary
                  type="button"
                  onClick={restoreDocument}
                  className=" mr-2"
                  style={{ height: '32px' }}
                >
                  Restore
                </ButtonSecondary>
                <ButtonSecondary
                  type="button"
                  onClick={() =>
                    onDeleteClick(
                      file.documentId,
                      false,
                      siteId,
                      setSelectedDocuments
                    )
                  }
                  className="mr-2 hover:bg-red-50"
                  style={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    height: '32px',
                  }}
                >
                  Delete Permanently
                </ButtonSecondary>
              </>
            ) : (
              <>
                {useIndividualSharing && (
                  <div
                    className="w-6 h-auto text-neutral-900 mr-2 cursor-pointer"
                    onClick={(event) =>
                      onShareClick(event, {
                        lineType: 'document',
                        documentId: file.documentId,
                      })
                    }
                  >
                    <Share />
                  </div>
                )}
                {!isSiteReadOnly && (
                  <>
                    <div
                      className="w-3 h-auto text-neutral-900 mr-3 cursor-pointer hover:text-primary-500"
                      data-test-id="delete-action"
                      onClick={() =>
                        onDeleteClick(
                          file.documentId,
                          useSoftDelete,
                          siteId,
                          setSelectedDocuments
                        )
                      }
                    >
                      <Trash />
                    </div>
                  </>
                )}
                <div className="w-5 pt-0.5 h-auto text-neutral-900 cursor-pointer">
                  <DocumentActionsPopover
                    value={{
                      lineType: 'document',
                      folder: folder,
                      documentId: file.documentId,
                      documentInstance: file,
                    }}
                    siteId={siteId}
                    isSiteReadOnly={isSiteReadOnly}
                    formkiqVersion={formkiqVersion}
                    useIndividualSharing={useIndividualSharing}
                    useCollections={useCollections}
                    useSoftDelete={useSoftDelete}
                    isDeeplinkPath={
                      file?.deepLinkPath && file.deepLinkPath.length > 0
                    }
                    setSelectedDocuments={setSelectedDocuments}
                  />
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={6} className="p-0 m-0 overflow-hidden">
          <div className="w-full border-t border-neutral-300 ml-4 h-0"></div>
        </td>
      </tr>
    </>
  );
}

export default DocumentListLine;
