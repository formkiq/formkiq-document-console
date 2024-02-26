import * as CodeMirror from 'codemirror';
import 'codemirror-rego/mode';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import { useEffect, useRef } from 'react';

function RegoEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (text: string) => void;
}) {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let editor: CodeMirror.EditorFromTextArea | null = null;
    // let editor:any = null;
    if (editorRef.current) {
      // Initialize CodeMirror

      editor = CodeMirror.fromTextArea(editorRef.current, {
        mode: 'rego',
        theme: 'base16-light',
        lineNumbers: true,
      });

      editor.setSize('100%', '150%');
      // Set initial Rego code
      editor.setValue(content);

      // Add event listener for changes
      editor.on('change', (instance) => {
        // Handle Rego code changes
        const updatedRegoCode = instance.getValue();
        console.log(updatedRegoCode);
        onChange(updatedRegoCode);
      });
    }

    // Cleanup CodeMirror instance when component is unmounted
    return () => {
      if (editor && editor.toTextArea) {
        editor.toTextArea(); // Convert back to a textarea to remove CodeMirror instance
      }
    };
  }, [content]); // Add content as a dependency

  return (
    <div>
      <textarea id="CMEditor" ref={editorRef} className="" />
    </div>
  );
}

export default RegoEditor;
