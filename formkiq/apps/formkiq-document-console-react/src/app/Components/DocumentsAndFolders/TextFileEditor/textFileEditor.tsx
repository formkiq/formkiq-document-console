import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';
import {
  DocumentsService,
  IFileUploadData,
} from '../../../helpers/services/documentsService';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import MarkdownEditor from '../../TextEditors/MarkdownEditor';
import './markdown/markdown.css';

function TextFileEditor({
  currentDocument,
  documentContent,
  contentType,
  siteId,
  readOnly = true,
}: any) {
  const dispatch = useAppDispatch();
  const [editorValue, setEditorValue] = useState(documentContent || '');
  const [html, setHtml] = useState<string>('');
  const previewTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (documentContent) {
      setEditorValue(documentContent);
      if (contentType === 'text/markdown') {
        const parsedHtml = marked.parse(documentContent);
        const sanitizedHtml = DOMPurify.sanitize(parsedHtml as string, {
          USE_PROFILES: { html: true },
        });
        setHtml(sanitizedHtml);
      }
    }
  }, [documentContent, contentType]);

  const onTextChange = (value: string) => {
    setEditorValue(value);

    if (contentType === 'text/markdown') {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }

      previewTimeoutRef.current = setTimeout(() => {
        const parsedHtml = marked.parse(value);
        const sanitizedHtml = DOMPurify.sanitize(parsedHtml as string, {
          USE_PROFILES: { html: true },
        });
        setHtml(sanitizedHtml);
      }, 500);
    }
  };

  const onSaveChanges = () => {
    const encoder = new TextEncoder();
    const newText = encoder.encode(editorValue);
    const file = new File([newText], currentDocument.path, {
      type: currentDocument.contentType,
    });

    const uploadData: IFileUploadData[] = [
      {
        originalFile: file,
        uploadedSize: 0,
      },
    ];

    DocumentsService.uploadNewDocumentVersions(
      currentDocument.documentId,
      siteId,
      uploadData,
      () => {}
    ).then((res) => {
      if (res.length > 0) {
        dispatch(
          openDialog({
            dialogTitle: 'File saved successfully',
          })
        );
      } else {
        dispatch(
          openDialog({
            dialogTitle:
              'An error has occurred. Please try again in a few minutes.',
          })
        );
      }
    });
  };

  return (
    <div className="w-full h-full mt-3">
      {!readOnly && (
        <div className="w-full flex items-center justify-end gap-2 py-2 h-12">
          <ButtonPrimary type="button" onClick={onSaveChanges}>
            Save Changes
          </ButtonPrimary>
        </div>
      )}
      {contentType === 'text/markdown' ? (
        <div
          className="w-full max-w-full flex"
          style={{ height: 'calc(100% - 56px)', maxWidth: '100%' }}
        >
          {!readOnly && (
            <div
              className="w-1/2 h-full overflow-auto max-w-1/2 max-h-full"
              style={{ maxWidth: '50vw' }}
            >
              <MarkdownEditor
                content={editorValue}
                onChange={onTextChange}
                readOnly={false}
              />
            </div>
          )}
          <div
            className={`${
              !readOnly ? 'w-1/2' : 'w-full'
            } max-h-full overflow-auto`}
            style={{ maxWidth: !readOnly ? '50vw' : '100%' }}
          >
            <div
              className="max-w-full max-h-full use-markdown"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full" style={{ height: 'calc(100% - 56px)' }}>
          {!readOnly ? (
            <MarkdownEditor
              content={editorValue}
              onChange={onTextChange}
              readOnly={false}
            />
          ) : (
            <div className="w-full h-full overflow-auto p-4 whitespace-pre-wrap">
              {editorValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TextFileEditor;
