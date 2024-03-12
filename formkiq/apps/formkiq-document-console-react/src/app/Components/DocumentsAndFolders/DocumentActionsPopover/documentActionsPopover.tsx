import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { ESignatureContentTypes } from '../../../helpers/constants/contentTypes';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import {
  ArrowRight,
  Copy,
  Download,
  History,
  MoreActions,
  Move,
  Rename,
  Share,
  Signature,
  Star,
  Tag,
  Trash,
  Workflow,
} from '../../Icons/icons';

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
  onChange,
  onKeyDown,
  value,
  siteId,
  isSiteReadOnly,
  formkiqVersion,
  onShareClick,
  onDeleteClick,
  onEditTagsAndMetadataModalClick,
  onRenameModalClick,
  onMoveModalClick,
  onDocumentVersionsModalClick,
  onDocumentWorkflowsModalClick,
  onESignaturesModalClick,
  onInfoPage,
  user,
  useIndividualSharing,
  useCollections,
  useSoftDelete,
}: any) {
  const line: ILine = value;
  const [visible, setVisibility] = useState(false);
  const [referenceRef, setReferenceRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);
  const wrapperRef = useRef(null);
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
    onDeleteClick();
  };
  function handleDropdownClick(event: any) {
    setVisibility(!visible);
  }
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
        <button
          ref={setReferenceRef as any}
          onClick={handleDropdownClick}
          className="w-20 flex bg-primary-500 justify-center px-4 py-1 text-base text-white rounded-md"
        >
          <span className="w-5 pt-1">{MoreActions()}</span>
        </button>
      ) : (
        <button
          ref={setReferenceRef as any}
          onClick={handleDropdownClick}
          className="w-5 hover:text-primary-500"
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
            {useIndividualSharing && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onShareClick(event, {
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
                    {Share()}
                  </span>
                  <span>Share</span>
                </span>
              </li>
            )}
            {line.lineType === 'document' && !isSiteReadOnly && (
              <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
                <span className={'flex items-baseline'}>
                  <span className="mr-2 w-4 text-neutral-900">{Star()}</span>
                  <span>Mark as favorite</span>
                </span>
              </li>
            )}
            {line.lineType === 'document' && !onInfoPage && (
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
            {line.lineType === 'document' && !isSiteReadOnly && (
              <li
                className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onMoveModalClick(event, {
                    lineType: line.lineType,
                    documentId: line.documentId,
                    documentInstance: line.documentInstance,
                    folder: line.folder,
                  })
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
            {line.lineType === 'document' && !isSiteReadOnly && (
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
                  <span className="mr-2 w-3.5 text-neutral-900">{History()}</span>
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
            {line.lineType === 'document' && (
              <li
                className="hidden py-1 px-2 hover:bg-gray-100 cursor-pointer"
                onClick={(event) =>
                  onDocumentWorkflowsModalClick(event, {
                    lineType: line.lineType,
                    documentId: line.documentId,
                    folder: line.folder,
                  })
                }
              >
                <span className={'flex items-baseline'}>
                  <span className="mr-2 w-3.5 text-neutral-900">{Workflow()}</span>
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
            {line.lineType === 'document' && !isSiteReadOnly && (
              <div className="w-4/5 my-2 mx-6 border-b"></div>
            )}
            {line.lineType === 'document' &&
              !isSiteReadOnly &&
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
            {line.lineType === 'document' && !isSiteReadOnly && (
              <>
                {useCollections && (
                  <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
                    <span className={'flex items-baseline'}>
                      <span
                        className="mr-2"
                        style={{ width: '15px', height: '13px' }}
                      >
                        {Copy()}
                      </span>
                      <span>Add to collection</span>
                      <span
                        className="ml-auto"
                        style={{ width: '15px', height: '13px' }}
                      >
                        {ArrowRight()}
                      </span>
                    </span>
                  </li>
                )}
                <li
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) =>
                    onEditTagsAndMetadataModalClick(event, {
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
                    <span>Add/edit metadata</span>
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
            {!onInfoPage && !isSiteReadOnly && (
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
          </ul>
          <div style={styles['arrow']} />
        </div>
      )}
    </div>
  );
}
