import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import MarkdownEditor from '../../TextEditors/MarkdownEditor';
import {DocumentsService, IFileUploadData} from '../../../helpers/services/documentsService';
import {marked} from 'marked';
import {useEffect, useState} from "react";
import "./markdown.css"
import {useAppDispatch} from "../../../Store/store";
import {openDialog} from "../../../Store/reducers/globalNotificationControls";
import * as DOMPurify from 'dompurify';

function TextFileEditor({
                          currentDocument,
                          documentContent,
                          extension,
                          siteId
                        }: any) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>('');
  const [html, setHtml] = useState<any>(null);
  let timeoutId: any;
  const onTextChange = (value: string) => {
    setText(value);
    const reloadPreview = (value: string) => {
      if (extension === 'md') {
        const parsedHtml = marked.parse(value);
        const sanitizedHtml = DOMPurify.sanitize(parsedHtml as string, {USE_PROFILES: {html: true}});
        setHtml(sanitizedHtml);
      }
    }
    // wait 0.5 second after user finishes typing before refreshing the preview to avoid preview flickering
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      reloadPreview(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };


  useEffect(() => {
    onTextChange(documentContent);
  }, []);

  const onSaveChanges = () => {
    // convert text to file
    const encoder = new TextEncoder();
    const newText = encoder.encode(text);
    const file = new File([newText], currentDocument.path, {});
    // upload new document version
    const uploadData: IFileUploadData[] = [
      {
        originalFile: file,
        uploadedSize: 0,
      },
    ]
    DocumentsService.uploadNewDocumentVersions(currentDocument.documentId, siteId, uploadData, () => {
    }).then((res) => {
      if (res.length > 0) {
        dispatch(openDialog({
          dialogTitle: 'File saved successfully',
        }))
      } else {
        dispatch(openDialog({
          dialogTitle: 'An error has occurred. Please try again in a few minutes.',
        }))
      }
    })
  }
  return (
    <div className="w-full h-full mt-3">
      <div className="w-full flex items-center justify-end gap-2 py-2 h-12">
        <ButtonPrimary
          type="button"
          onClick={onSaveChanges}
        >Save Changes</ButtonPrimary>
      </div>
      {extension === 'md' && <div className="w-full max-w-full flex"
                                  style={{height: 'calc(100% - 56px)', maxWidth: '100%'}}
      >
        <div className="w-1/2 h-full overflow-auto max-w-1/2 max-h-full" style={{maxWidth: '50vw'}}
        >
          <MarkdownEditor
            content={documentContent}
            onChange={onTextChange}
            readOnly={false}
          />
        </div>
        <div className="w-1/2 max-h-full overflow-auto " style={{maxWidth: '50vw'}}>
          <div className="max-w-full max-h-full use-markdown"
               dangerouslySetInnerHTML={{__html: html}}>
          </div>
        </div>
      </div>}

    </div>
  );
}

export default TextFileEditor;
