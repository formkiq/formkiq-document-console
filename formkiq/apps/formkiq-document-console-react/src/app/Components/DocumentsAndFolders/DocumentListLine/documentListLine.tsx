import React, { useEffect, useState } from 'react'
import { Star, StarFilled, Info, Share, Trash } from '../../Icons/icons'
import { useDrag } from 'react-dnd'
import { Link, useNavigate } from 'react-router-dom'
import { formatBytes, formatDate, getFileIcon, isTagValueIncludes } from '../../../helpers/services/toolService'
import DocumentActionsPopover from '../DocumentActionsPopover/documentActionsPopover'
import DocumentTagsPopover from '../DocumentTagsPopover/documentTagsPopover'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { DocumentsService } from '../../../helpers/services/documentsService'
import { RootState } from '../../../Store/store'
import { connect, useDispatch } from 'react-redux'
import { User } from '../../../Store/reducers/auth'
import { addDocumentTag, removeDocumentTag } from '../../../Store/reducers/documentsList'
import { IDocument } from '../../../helpers/types/document'
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { openDialog as openProgressDialog, closeDialog as closeProgressDialog } from '../../../Store/reducers/globalProgressControls';

function DocumentListLine({
  file,
  folder,
  siteId,
  documentsRootUri,
  onShareClick,
  onDeleteClick,
  onRestoreClick,
  onEditTagsAndMetadataModalClick,
  onRenameModalClick,
  onMoveModalClick,
  onDocumentVersionsModalClick,
  onESignaturesModalClick,
  onTagChange,
  user,
  filterTag,
  brand,
  formkiqVersion,
  tagColors,
  useIndividualSharing,
  useCollections,
  useSoftDelete,
  leftOffset = 0,
}: {
  file: any;
  folder: any;
  siteId: string;
  documentsRootUri: string;
  onShareClick: any;
  onDeleteClick: any;
  onRestoreClick: any;
  onEditTagsAndMetadataModalClick: any;
  onRenameModalClick: any;
  onMoveModalClick: any;
  onDocumentVersionsModalClick: any;
  onESignaturesModalClick: any;
  onTagChange: any;
  user: User;
  documents: IDocument[];
  filterTag: string;
  brand: string;
  formkiqVersion: any;
  tagColors: any[];
  useIndividualSharing: boolean;
  useCollections: boolean;
  useSoftDelete: boolean;
  leftOffset: number;
}) {
  const [isFavorited, setFavorited] = useState(false);
  const [timeoutId, setTimeOutId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteDocument = () => {
    if (useSoftDelete) {
      onDeleteClick();
    } else {
      onPermanentDeleteClick(); 
    }
  };
  const restoreDocument = () => {
    onRestoreClick();
  };

  const onPermanentDeleteClick = () => {
    const deleteFunc = () => {
      DocumentsService.deleteDocument(file.documentId, siteId).then(() => {
        dispatch(openProgressDialog({ dialogTitle: 'Deleting...'}))
        setTimeout(() => {
          closeProgressDialog()
          window.location.reload()
        }, 2000)
        /*
        if (useSoftDelete) {
          navigate(
            {
              pathname: `${documentsRootUri}/folders/deleted`,
              search: '?refresh=' + Math.random(),
            },
            {
              replace: true,
            }
          );
        } else {
          // TODO: add delete processing modal with spinner ?
          setTimeout(() => {
            navigate(
              {
                pathname: `${documentsRootUri}/folders/${folder}`,
                search: '?refresh=' + Math.random(),
              },
              {
                replace: true,
              }
            );
          }, 1500)
        }
        */
      });
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle:
          'Are you sure you want to delete this document permanently?',
      })
    );
  };

  const [{ opacity, isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'file',
      item: file,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging(),
      }),
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

  let pageSubfolderLevel = 0
  if (folder.length) {
    pageSubfolderLevel = folder.split('/').length
  }
  let lineSubfolderLevel = 0
  if (file.path.indexOf('/') > -1) {
    lineSubfolderLevel = file.path.split('/').length - 1
  }
  return (
    <>
      <tr
        className={`text-sm tracking-tight`}
        ref={drag}
        style={{ opacity, visibility: isDragging ? 'hidden' : 'inherit' }}
      >
        <td className={`text-gray-800 table-cell pl-${leftOffset} relative`}>
          <div className="flex w-full justify-start">
            {
              folder !== 'deleted' &&
              folder !== 'shared' &&
              folder !== 'recent' &&
              folder !== 'favorites' ? (
                <div
                  className={lineSubfolderLevel === pageSubfolderLevel
                  ? 'w-5 '
                  : 'w-1'
                  }>
                </div>
              ) : (
                <div className="w-1"></div>
              )
            }
            <Link
              to={`${documentsRootUri}/${file.documentId}/view`}
              className="cursor-pointer w-16 flex items-center justify-start"
            >
              <img
                src={getFileIcon(file.path)}
                className="w-8 inline-block"
                alt="icon"
              />
            </Link>
            <div className="grow flex">
              <Link
                to={`${documentsRootUri}/${file.documentId}/view`}
                className="cursor-pointer pt-1.5 flex items-center"
                title={file.path.substring(file.path.lastIndexOf('/') + 1)}
              >
                {
                  folder === 'deleted' ? (
                    <span>
                      {file.path}
                    </span>
                  ) : (
                    <span>
                      {file.path.substring(file.path.lastIndexOf('/') + 1).length >
                      40 ? (
                        <span className="tracking-tightest text-clip overflow-hidden">
                          {file.path.substring(
                            file.path.lastIndexOf('/') + 1,
                            file.path.lastIndexOf('/') + 50
                          )}
                          {file.path.substring(file.path.lastIndexOf('/') + 1)
                            .length > 50 && <span>...</span>}
                        </span>
                      ) : (
                        <span>
                          {file.path.substring(file.path.lastIndexOf('/') + 1)}
                        </span>
                      )}
                    </span>
                  )
                }
              </Link>
              <div className="grow flex items-center justify-end pt-1.5 pr-4">
                <div className="flex flex-wrap justify-end w-52">
                  {Object.getOwnPropertyNames(file.tags).map(
                    (propertyName, i) => {
                      let showTag = false;
                      // TODO: determine why constants arrays are intermittently failing
                      const tagsToIgnore = [
                        'sysFavoritedBy',
                        'sysSharedWith',
                        'sysDeletedBy',
                        'untagged',
                        'path',
                      ];
                      let tagColor = 'gray'
                      if (tagColors) {
                        tagColors.forEach((color) => {
                          if (color.tagKeys.indexOf(propertyName) > -1) {
                            tagColor = color.colorUri
                            return;
                          }
                        })
                      }
                      if (tagsToIgnore.indexOf(propertyName) === -1 && !file.tags[propertyName].length) {
                        showTag = true;
                      }
                      return (
                        <div key={i}>
                          {showTag && (
                            <div className="pt-0.5 pr-1 flex">
                              <div className={`h-5.5 pl-2 rounded-l-md pr-1 bg-${tagColor}-200 whitespace-nowrap`}>
                                {propertyName}
                              </div>
                              <div className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}></div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="flex">
                  <div className="w-4 h-4 text-gray-400 ml-2 -mt-1 cursor-pointer">
                    <DocumentTagsPopover
                      value={{
                        lineType: 'document',
                        folder: folder,
                        documentId: file.documentId,
                      }}
                      onTagChange={onTagChange}
                      siteId={siteId}
                      tagColors={tagColors}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Link
              to={`#id=${file.documentId}`}
              className="w-5 pt-0.5 text-gray-400 mr-1 cursor-pointer hover:text-coreOrange-500"
            >
              <Info />
            </Link>
            {folder !== 'deleted' && (
              <div
                onClick={toggleFavorite}
                className="w-5 text-gray-400 mr-4 cursor-pointer px-2 box-content"
              >
                {isFavorited ? StarFilled() : Star()}
              </div>
            )}
          </div>
        </td>
        <td className="w-38 p-2 pt-3 text-gray-800 block tracking-tight lg:table-cell relative lg:static">
          {formatDate(file.lastModifiedDate)}
        </td>
        <td className="w-24 p-2 pt-3 text-gray-800 block tracking-tight lg:table-cell relative lg:static">
          {formatBytes(file.contentLength)}
        </td>
        { useIndividualSharing && (
          <td className="w-24 p-2 pt-3 text-gray-800 block tracking-tight lg:table-cell relative lg:static">
            Private
          </td>
        )}
        <td className="w-28 p-2 pt-3 text-gray-800 block lg:table-cell relative lg:static">
          <div className="flex">
            {folder === 'deleted' ? (
              <>
                <button
                  onClick={restoreDocument}
                  className="flex items-center mr-2 bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-6 rounded-2xl flex cursor-pointer focus:outline-none"
                >
                  Restore
                </button>
                <button
                  onClick={onPermanentDeleteClick}
                  className="flex items-center bg-gradient-to-l from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:via-rose-600 hover:to-red-700 text-white text-sm font-semibold py-2 px-4 rounded-2xl flex cursor-pointer focus:outline-none"
                >
                  Delete Permanently
                </button>
              </>
            ) : (
              <>
                { useIndividualSharing && (
                  <div
                    className="w-6 h-auto text-gray-400 mr-2 cursor-pointer"
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
                { useSoftDelete ? (
                  <div
                    className="w-3 h-auto text-gray-400 mr-3 cursor-pointer hover:text-coreOrange-500"
                    onClick={onDeleteClick}
                    >
                    <Trash />
                  </div>
                ) : (
                  <div
                    className="w-3 h-auto text-gray-400 mr-3 cursor-pointer hover:text-coreOrange-500"
                    onClick={onPermanentDeleteClick}
                    >
                    <Trash />
                  </div>
                )}
                <div className="w-5 pt-0.5 h-auto text-gray-400 cursor-pointer">
                  <DocumentActionsPopover
                    value={{
                      lineType: 'document',
                      folder: folder,
                      documentId: file.documentId,
                      documentInstance: file,
                    }}
                    siteId={siteId}
                    formkiqVersion={formkiqVersion}
                    onDeleteClick={deleteDocument}
                    onShareClick={onShareClick}
                    onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                    onRenameModalClick={onRenameModalClick}
                    onMoveModalClick={onMoveModalClick}
                    onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                    onESignaturesModalClick={onESignaturesModalClick}
                    user={user}
                    useIndividualSharing={useIndividualSharing}
                    useCollections={useCollections}
                    useSoftDelete={useSoftDelete}
                  />
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={6} className="p-0 m-0">
          <div className="w-full border-t ml-4 h-0"></div>
        </td>
      </tr>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer
  const { documents } = state.documentsReducer
  const { brand, formkiqVersion, tagColors } = state.configReducer
  return { user, documents, brand, formkiqVersion, tagColors }
}

export default connect(mapStateToProps)(DocumentListLine as any) as any;
  