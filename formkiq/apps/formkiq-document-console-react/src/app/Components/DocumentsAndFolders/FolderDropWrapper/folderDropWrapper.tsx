import React, { useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import {
  DocumentListState,
  retrieveAndRefreshFolder,
  updateDocumentsList,
} from '../../../Store/reducers/documentsList';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { IDocument } from '../../../helpers/types/document';

type folderDropProps = {
  folder: string;
  dropcallback?: any;
  children?: any;
  wrapper?: any;
  className?: string;
  sourceSiteId: string;
  targetSiteId: string;
};

function FolderDropWrapper(props: folderDropProps) {
  const { documents } = useSelector(DocumentListState);
  const { user } = useAuthenticatedState();

  const path = matchPath(
    { path: '/documents/folders/:folderName' },
    window.location.pathname
  ) as any;
  let folderName = '';
  if (path) {
    folderName = path.params?.folderName;
  }
  const [currentFolder, setCurrentFolder] = useState<string>('');
  useEffect(() => {
    setCurrentFolder(folderName);
  }, [folderName]);
  const dispatch = useAppDispatch();
  const defaultElem = React.forwardRef((props: any, ref) => (
    <div {...props} ref={ref}>
      {props.childs}
    </div>
  ));
  const { children, wrapper = defaultElem } = props;
  const MainElem = wrapper;
  const defaultCallback = useCallback(
    (docs: IDocument | IDocument[], monitor: any) => {
      if (props.sourceSiteId !== props.targetSiteId) {
        dispatch(
          openDialog({
            dialogTitle:
              'Files cannot be moved between top-level folders at this time.',
          })
        );
        return;
      }
      if (documents && props.targetSiteId) {
        if (props.folder.indexOf('FK-collections') > -1) {
          // TODO: add collection drag and drop functionality
        } else {
          const docsToMove = Array.isArray(docs) ? docs : [docs];
          const validDocsToMove = docsToMove.filter(
            (document): document is IDocument =>
              document !== undefined && document.path !== undefined
          );

          if (!validDocsToMove.length) {
            return;
          }

          Promise.all(
            validDocsToMove.map((document: IDocument) => {
              const filename = document.path.substring(
                document.path.lastIndexOf('/') + 1
              );
              const newPath =
                (props.folder.length ? props.folder + '/' : '') + filename;

              if (document.path !== newPath) {
                return DocumentsService.setDocumentFolder(
                  props.folder,
                  document.path,
                  props.targetSiteId
                ).then((res: any) => ({ res, document, newPath }));
              }
              return Promise.resolve({
                res: { status: 304 },
                document,
                newPath,
              });
            })
          ).then((results) => {
            const successfulMoves = results.filter(
              ({ res }) => res.status === 200
            );

            if (successfulMoves.length) {
              // Update documents list once for all moved documents
              const newDocs = [...(documents as any[])].filter(
                (doc) =>
                  !successfulMoves.some(
                    (move) => move.document.documentId === doc.documentId
                  )
              );

              dispatch(
                updateDocumentsList({
                  documents: newDocs,
                })
              );

              // Handle folder updates for each moved document
              successfulMoves.forEach(({ document, newPath }) => {
                const filename = document.path.substring(
                  document.path.lastIndexOf('/') + 1
                );
                const originalFolderPath = document.path
                  .replace('/' + filename, '')
                  .replace(filename, '');

                if (originalFolderPath !== currentFolder) {
                  dispatch(
                    retrieveAndRefreshFolder({
                      folderPath: originalFolderPath,
                      document: document,
                      documentAction: 'remove',
                    })
                  );
                }

                const updatedDoc = { ...document, path: newPath };
                if (props.folder !== currentFolder) {
                  dispatch(
                    retrieveAndRefreshFolder({
                      folderPath: props.folder,
                      document: updatedDoc,
                      documentAction: 'add',
                    })
                  );
                }
              });
            }

            if (
              results.some(
                ({ res }) => res.status !== 200 && res.status !== 304
              )
            ) {
              dispatch(
                openDialog({
                  dialogTitle:
                    'Moving one or more files did not succeed. Please try again in a few minutes.',
                })
              );
            }
          });
        }
      }
    },
    [documents]
  );

  const finalCallback = props.dropcallback || defaultCallback;
  const [{ isOver }, drop] = useDrop({
    accept: 'file',
    drop: finalCallback,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <MainElem
      childs={children}
      ref={drop}
      className={props.className + ` ${isOver ? 'bg-sky-200' : ''}`}
    ></MainElem>
  );
}

export default FolderDropWrapper;
