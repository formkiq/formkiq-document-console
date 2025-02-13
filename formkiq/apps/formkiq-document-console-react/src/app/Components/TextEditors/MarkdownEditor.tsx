import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import { useEffect, useRef } from 'react';

function MarkdownEditor({
  content,
  onChange,
  readOnly = false,
}: {
  content: string;
  onChange: (text: string) => void;
  readOnly?: boolean | 'nocursor';
}) {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const cmInstanceRef = useRef<CodeMirror.EditorFromTextArea | null>(null);
  const initialContentRef = useRef(content);

  useEffect(() => {
    if (!editorRef.current || cmInstanceRef.current) return;

    const cm = CodeMirror.fromTextArea(editorRef.current, {
      mode: 'markdown',
      theme: 'base16-light',
      lineNumbers: true,
      readOnly: readOnly,
      lineWrapping: true,
      value: initialContentRef.current,
    });

    cm.setSize('100%', '150%');

    // Only set up the change handler once
    cm.on('change', (instance) => {
      const value = instance.getValue();
      onChange(value);
    });

    cmInstanceRef.current = cm;

    return () => {
      if (cmInstanceRef.current) {
        cmInstanceRef.current.toTextArea();
        cmInstanceRef.current = null;
      }
    };
  }, [readOnly]); // Only recreate if readOnly changes

  return <textarea ref={editorRef} defaultValue={initialContentRef.current} />;
}

export default MarkdownEditor;
