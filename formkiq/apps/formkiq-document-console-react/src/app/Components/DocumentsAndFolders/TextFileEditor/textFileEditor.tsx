import React from 'react';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import MarkdownEditor from '../../TextEditors/MarkdownEditor';
import {DocumentsService} from '../../../helpers/services/documentsService';

function TextFileEditor({
                          document,
                          documentContent,
                          extension
                        }: any) {
  const [text, setText] = React.useState<string>('');
  const onTextChange = (value: string) => {
    setText(value);
  };

  const onSaveChanges = () => {
    // TODO: convert new text to MD file
    console.log('text', text);
    const encoder = new TextEncoder();
    const newText = encoder.encode(text);
    const file = new File([newText], document.path, {});
    // TODO: uploadNewDocumentVersion
    DocumentsService.uploadNewDocumentVersion(document.documentId, document.siteId, file)
      .then((response) => {
        console.log('response1', response);
        DocumentsService.getDocumentById(document.documentId, document.siteId).then((response) => {
           console.log('response2', response);
        })
      });
  }
    return (
      <div className="w-full h-full -mt-4">
        {extension === 'md' &&
          <MarkdownEditor
            content={documentContent}
            onChange={onTextChange}
            readOnly={false}
          />}
        <div className="absolute top-16 right-4">
          <ButtonPrimary
            type="button"
            onClick={onSaveChanges}
          >Save Changes</ButtonPrimary>
        </div>
      </div>
    );
  }

  export default TextFileEditor;
