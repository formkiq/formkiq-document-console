import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { User } from '../../../Store/reducers/auth';
import {
  retrieveAndRefreshFolder,
  updateDocumentsList,
} from '../../../Store/reducers/documentsList';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { RootState, useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { IDocument } from '../../../helpers/types/document';

type folderDropProps = {
  folder: string;
  dropcallback: any;
  children: any;
  documents?: any;
  wrapper?: any;
  className?: string;
  user: User;
  sourceSiteId: string;
  targetSiteId: string;
};

function FolderDropWrapper(props: folderDropProps) {
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
  const { children, documents, wrapper = defaultElem } = props;
  const MainElem = wrapper;
  let defaultCallback = (doc: IDocument, monitor: any) => {
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
        const filename = doc.path.substring(doc.path.lastIndexOf('/') + 1);
        const newPath =
          (props.folder.length ? props.folder + '/' : '') + filename;
        if (doc.path !== newPath) {
          DocumentsService.setDocumentFolder(
            props.folder,
            doc.path,
            props.targetSiteId
          ).then((res: any) => {
            if (res.status === 200) {
              const originalFolderPath = doc.path
                .replace('/' + filename, '')
                .replace(filename, '');
              if (originalFolderPath !== currentFolder) {
                dispatch(
                  retrieveAndRefreshFolder({
                    folderPath: originalFolderPath,
                    document: doc,
                    documentAction: 'remove',
                  })
                );
              } else {
                const newArr = [...(documents as any[])];
                if (newArr) {
                  const index = documents?.indexOf(doc);
                  if (index > -1) {
                    newArr.splice(index, 1);
                    dispatch(
                      updateDocumentsList({
                        documents: newArr,
                        user: props.user,
                        isSystemDeletedByKey: false,
                      })
                    );
                  }
                }
              }
              const updatedDoc = { ...doc, path: newPath };
              if (props.folder !== currentFolder) {
                dispatch(
                  retrieveAndRefreshFolder({
                    folderPath: props.folder,
                    document: updatedDoc,
                    documentAction: 'add',
                  })
                );
              } else {
                const newArr = [...(documents as any[])];
                newArr.push(updatedDoc);
                dispatch(
                  updateDocumentsList({
                    documents: newArr.sort((a: any, b: any) =>
                      a.path > b.path ? 1 : -1
                    ),
                    user: props.user,
                    isSystemDeletedByKey: false,
                  })
                );
              }
            } else {
              dispatch(
                openDialog({
                  dialogTitle:
                    'Moving this file did not succeed. Please try again in a few minutes.',
                })
              );
            }
          });
        }
      }
    }
  };
  if (props.dropcallback) {
    defaultCallback = props.dropcallback;
  }
  const [{ isOver }, drop] = useDrop({
    accept: 'file',
    drop: defaultCallback,
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

const mapStateToProps = (state: RootState) => {
  const { documents } = state.documentsReducer;
  const { user } = state.authReducer;
  return { documents, user };
};

export default connect(mapStateToProps)(FolderDropWrapper as any) as any;
