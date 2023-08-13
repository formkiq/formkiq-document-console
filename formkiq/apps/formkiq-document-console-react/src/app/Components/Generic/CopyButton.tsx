import { Tooltip } from 'react-tooltip';
import { CopyIcon } from '../Icons/icons';
import { useState } from 'react';

export type CopyButtonProps = {
  value: string;
  id?: string;
};

export const CopyButton = (props: CopyButtonProps) => {
  const [text, setText] = useState('Copy');

  const { value, id } = props;
  return (
    <>
      <Tooltip id={id ?? 'copy-tooltip'} />
      <button
        data-tooltip-id={id ?? 'copy-tooltip'}
        data-tooltip-content={text}
        onClick={() => {
          window.navigator.clipboard.writeText(value);
          setText('Copied!');

          setTimeout(() => {
            setText('Copy');
          }, 2000);
        }}
      >
        <CopyIcon />
      </button>
    </>
  );
};
