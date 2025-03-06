import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { ESignatureContentTypes } from '../../../helpers/constants/contentTypes';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { usePermissions } from '../../../hooks/usePermissions';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import {
  ArrowRight,
  Checkmark,
  Download,
  History,
  Info,
  MoreActions,
  Move,
  Relationship,
  Rename,
  Schema,
  Settings,
  Signature,
  Tag,
  Trash,
  Workflow,
} from '../../Icons/icons';
import { useDocumentActions } from './DocumentActionsContext';

function useOutsideAlerter(ref: any, setExpanded: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

export default function DocumentActionsPopover({
  user,
  value,
  siteId,
  formkiqVersion,
  onInfoPage,
  onViewPage,
  useCollections,
  useSoftDelete,
  isDeeplinkPath,
  setSelectedDocuments,
  infoDocumentId,
  onInfoClick,
}: any) {
  const {
    onShareClick,
    onDocumentVersionsModalClick,
    onDocumentWorkflowsModalClick,
    onESignaturesModalClick,
    onSubmitForReviewModalClick,
    onDocumentReviewModalClick,
    onDeleteClick,
    onPurgeClick,
    onEditAttributesModalClick,
    onRenameModalClick,
    onMoveModalClick,
    onDocumentRelationshipsModalClick,
    onActionModalClick,
    onDocumentClassificationsModalClick,
  } = useDocumentActions();
  const line: ILine = value;
  const searchParams = new URLSearchParams(location.search);
  const [visible, setVisibility] = useState(false);
  const [referenceRef, setReferenceRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);
  const wrapperRef = useRef(null);
  const { pathname } = useLocation();
  useOutsideAlerter(wrapperRef, setVisibility);
  const { styles, attributes } = usePopper(referenceRef, popperRef, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [50, 0],
        },
      },
    ],
  });

  const clickDelete = () => {
    setVisibility(false);
    onDeleteClick(line.documentId, useSoftDelete, siteId, setSelectedDocuments);
  };

  const clickPurge = () => {
    setVisibility(false);
    onPurgeClick(line.documentId, siteId, setSelectedDocuments);
  };

  function handleDropdownClick(event: any) {
    setVisibility(!visible);
  }

  function handleInfoClick(event: any) {
    if (onInfoClick) {
      onInfoClick(event);
      setVisibility(!visible);
    }
  }

  const { canRead, canWrite, canDelete, canGovern } = usePermissions({
    user,
    siteId,
  });

  const DownloadDocument = () => {
    DocumentsService.getDocumentUrl(line.documentId, siteId, '', false).then(
      (urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      }
    );
  };
  return (
    <div className="relative" ref={wrapperRef}>
      {onInfoPage ? (
        <ButtonGhost
          onClick={handleDropdownClick}
          style={{
            height: '36px',
            width: '88%',
            margin: '8px 16px',
          }}
        >
          <div className="w-full flex justify-center px-4 py-1">
            <span className="">More... </span>
            <span className="w-7 pl-1">{MoreActions()}</span>
          </div>
        </ButtonGhost>
      ) : (
        <button
          ref={setReferenceRef as any}
          onClick={handleDropdownClick}
          className="w-5 hover:text-primary-500 rotate-90 text-inherit "
        >
          <MoreActions />
        </button>
      )}
      {visible && (
        <div
          ref={setPopperRef as any}
          style={styles['popper']}
          {...attributes['popper']}
          className={`bg-white border-gray-100 border shadow-xl z-10 rounded-xl w-64 text-sm p-2`}
        >
          <ul className="text-neutral-900">
            {line.lineType === 'document' && !onInfoPage && !onViewPage && (
              <>
                {line.documentId === infoDocumentId && (
                  <Tooltip id={line.documentId} />
                )}
                <Link
                  to={`${location.pathname}?${searchParams.toString()}#id=${
                    line.documentId
                  }`}
                  onClick={handleInfoClick}
                >
                  <li
                    data-tooltip-id={line.documentId}
                    data-tooltip-content="Document details are already open"
                    className={`py-1 px-2 ${
                      line.documentId !== infoDocumentId
                        ? 'hover:bg-gray-100 cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    } text-neutral-900`}
                  >
                    <span className="flex items-center">
                      <span
                        className="mr-2 "
                        style={{ width: '15px', height: '15px' }}
                      >
                        <Info />
                      </span>
                      <span>View Details</span>
                    </span>
                  </li>
                </Link>
              </>
            )}
            {line.lineType === 'document' && !onInfoPage && !isDeeplinkPath && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={DownloadDocument}
              >
                <span className={'flex items-baseline'}>
                  <span
                    className="mr-2"
                    style={{ width: '15px', height: '13px' }}
                  >
                    {Download()}
                  </span>
                  <span>Download</span>
                </span>
              </li>
            )}
            {line.lineType === 'document' && canWrite && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onMoveModalClick(event, [
                    {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      documentInstance: line.documentInstance,
                      folder: line.folder,
                    },
                  ])
                }
              >
                <span className={'flex items-baseline'}>
                  <span
                    className="mr-2"
                    style={{ width: '15px', height: '13px' }}
                  >
                    {Move()}
                  </span>
                  <span>Move</span>
                  <span
                    className="ml-auto"
                    style={{ width: '15px', height: '13px' }}
                  >
                    {ArrowRight()}
                  </span>
                </span>
              </li>
            )}
            {line.lineType === 'document' && canWrite && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onRenameModalClick(event, {
                    lineType: line.lineType,
                    documentId: line.documentId,
                    documentInstance: line.documentInstance,
                    folder: line.folder,
                  })
                }
              >
                <span className={'flex items-baseline'}>
                  <span className="mr-2 w-4 text-neutral-900">{Rename()}</span>
                  <span>Rename</span>
                </span>
              </li>
            )}
            {line.lineType === 'document' && (
              <div className="w-4/5 my-2 mx-6 border-b"></div>
            )}
            {line.lineType === 'document' && (
              <>
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onEditAttributesModalClick(event, {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      folder: line.folder,
                    })
                  }
                >
                  <span className={'flex items-baseline'}>
                    <span
                      className="mr-2 text-neutral-900"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {Tag()}
                    </span>
                    <span>Metadata...</span>
                    <span
                      className="ml-auto"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {ArrowRight()}
                    </span>
                  </span>
                </li>
              </>
            )}
            {formkiqVersion.type !== 'core' &&
              line.lineType === 'document' &&
              !isDeeplinkPath && (
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onDocumentVersionsModalClick(event, {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      folder: line.folder,
                    })
                  }
                >
                  <span className={'flex items-baseline'}>
                    <span className="mr-2 w-3.5 text-neutral-900">
                      {History()}
                    </span>
                    <span>Versions</span>
                    <span
                      className="ml-auto"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {ArrowRight()}
                    </span>
                  </span>
                </li>
              )}
            {formkiqVersion.type !== 'core' &&
              line.lineType === 'document' &&
              !isDeeplinkPath && (
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onDocumentWorkflowsModalClick(event, {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      folder: line.folder,
                    })
                  }
                >
                  <span className={'flex items-baseline'}>
                    <span className="mr-2 w-3.5 text-neutral-900">
                      {Workflow()}
                    </span>
                    <span>Workflows</span>
                    <span
                      className="ml-auto"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {ArrowRight()}
                    </span>
                  </span>
                </li>
              )}

            {formkiqVersion.type !== 'core' &&
              line.lineType === 'document' &&
              !isDeeplinkPath &&
              canWrite && (
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onActionModalClick(event, {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      folder: line.folder,
                    })
                  }
                >
                  <span className={'flex items-baseline'}>
                    <span className="mr-2 w-3.5 text-neutral-900">
                      {Settings()}
                    </span>
                    <span>Actions</span>
                    <span
                      className="ml-auto"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {ArrowRight()}
                    </span>
                  </span>
                </li>
              )}

            {line.lineType === 'document' &&
              pathname.indexOf('/queues') === -1 &&
              canWrite && (
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onSubmitForReviewModalClick(event, {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      folder: line.folder,
                      documentInstance: line.documentInstance,
                    })
                  }
                >
                  <span className={'flex items-baseline'}>
                    <span className="mr-2 w-3.5 text-neutral-900">
                      <Checkmark />
                    </span>
                    <span>Submit for review</span>
                    <span
                      className="ml-auto"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {ArrowRight()}
                    </span>
                  </span>
                </li>
              )}

            {line.lineType === 'document' &&
              pathname.indexOf('/queues') > -1 &&
              canWrite && (
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onDocumentReviewModalClick(event, {
                      lineType: line.lineType,
                      documentId: line.documentId,
                      folder: line.folder,
                    })
                  }
                >
                  <span className={'flex items-baseline'}>
                    <span className="mr-2 w-3.5 text-neutral-900">
                      <Checkmark />
                    </span>
                    <span>Review</span>
                    <span
                      className="ml-auto"
                      style={{ width: '15px', height: '13px' }}
                    >
                      {ArrowRight()}
                    </span>
                  </span>
                </li>
              )}

            {line.lineType === 'document' &&
              canWrite &&
              line.documentInstance &&
              formkiqVersion.modules?.indexOf('esignature') > -1 &&
              ESignatureContentTypes.indexOf(
                line.documentInstance.contentType
              ) > -1 && (
                <>
                  <li
                    className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(event) =>
                      onESignaturesModalClick(event, {
                        lineType: line.lineType,
                        documentId: line.documentId,
                        folder: line.folder,
                      })
                    }
                  >
                    <span className={'flex items-baseline'}>
                      <span
                        className="mr-2"
                        style={{ width: '15px', height: '13px' }}
                      >
                        {Signature()}
                      </span>
                      <span>Send for eSignature</span>
                      <span
                        className="ml-auto"
                        style={{ width: '15px', height: '13px' }}
                      >
                        {ArrowRight()}
                      </span>
                    </span>
                  </li>
                </>
              )}
            {line.lineType === 'document' && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onDocumentRelationshipsModalClick(event, {
                    lineType: line.lineType,
                    documentId: line.documentId,
                    folder: line.folder,
                  })
                }
              >
                <span className={'flex items-baseline'}>
                  <span className="mr-2 w-3.5 text-neutral-900">
                    <Relationship />
                  </span>
                  <span>Document Relationships</span>
                  <span
                    className="ml-auto"
                    style={{ width: '15px', height: '13px' }}
                  >
                    {ArrowRight()}
                  </span>
                </span>
              </li>
            )}
            {line.lineType === 'document' && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onDocumentClassificationsModalClick(event, {
                    lineType: line.lineType,
                    documentId: line.documentId,
                    folder: line.folder,
                  })
                }
              >
                <span className={'flex items-baseline'}>
                  <span
                    className="mr-2"
                    style={{ width: '15px', height: '13px' }}
                  >
                    <Schema />
                  </span>
                  <span>Classifications</span>
                  <span
                    className="ml-auto"
                    style={{ width: '15px', height: '13px' }}
                  >
                    {ArrowRight()}
                  </span>
                </span>
              </li>
            )}
            {!onInfoPage && canDelete && (
              <>
                {line.lineType === 'document' && (
                  <div className="w-4/5 my-2 mx-6 border-b"></div>
                )}
                {useSoftDelete || line.lineType === 'folder' ? (
                  <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer text-red-500">
                    <span
                      onClick={clickDelete}
                      className={'flex items-baseline'}
                    >
                      <span className="mr-2 w-3 h-3">{Trash()}</span>
                      <span>Delete</span>
                    </span>
                  </li>
                ) : (
                  <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer text-red-500">
                    <span
                      onClick={clickDelete}
                      className={'flex items-baseline'}
                    >
                      <span className="mr-2 w-3 h-3">{Trash()}</span>
                      <span>Delete (No Undo)</span>
                    </span>
                  </li>
                )}
              </>
            )}
            {(user?.isAdmin || canGovern) && (
              <>
                <div className="w-4/5 my-2 mx-6 border-b"></div>
                <li className="font-bold py-1 px-2 hover:bg-gray-100 cursor-pointer text-red-500">
                  <span onClick={clickPurge} className={'flex items-baseline'}>
                    <span className="mr-2 w-3 h-3">{Trash()}</span>
                    <span>PURGE DOCUMENT</span>
                  </span>
                </li>
              </>
            )}
          </ul>
          <div style={styles['arrow']} />
        </div>
      )}
    </div>
  );
}
