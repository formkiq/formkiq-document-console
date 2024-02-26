import { useEffect, useRef } from 'react';
import { JSONEditor, JSONEditorPropsOptional } from 'vanilla-jsoneditor';

export const JSONEditorReact: React.FC<JSONEditorPropsOptional> = (props) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {},
    });

    if (refContainer.current) {
      // change editor menu color
      refContainer.current.style.setProperty('--jse-theme-color', '#383e42');
      refContainer.current.style.setProperty(
        '--jse-theme-color-highlight',
        '#687177'
      );
    }

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // update props
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);
  return <div ref={refContainer} className="whitespace-nowrap" />;
};
