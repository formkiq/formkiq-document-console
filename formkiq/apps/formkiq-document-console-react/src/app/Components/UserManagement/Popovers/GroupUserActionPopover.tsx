import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { ILine } from '../../../helpers/types/line';
import {
  Disable,
  Close,
  VerticalDots,
  Enable,
  ResetPassword,
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

export default function GroupUserActionsPopover({
  value,
  onDisableClick,
  onEnableClick,
  onDeleteClick,
  onResetPasswordClick,
  user,
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

  function handleDropdownClick(event: any) {
    setVisibility(!visible);
  }

  function handleDeleteClick() {
    onDeleteClick(line.username);
    setVisibility(false);
  }

  const handleDisableClick = () => {
    onDisableClick(line.username);
    setVisibility(false);
  };
  const handleEnableClick = () => {
    onEnableClick(line.username);
    setVisibility(false);
  };
  const handleResetPasswordClick = () => {
    onResetPasswordClick(line.username);
    setVisibility(false);
  };

  return (
    <div className="relative h-6" ref={wrapperRef}>
      <button
        ref={setReferenceRef as any}
        onClick={handleDropdownClick}
        className="w-6 hover:text-primary-500"
      >
        <VerticalDots />
      </button>
      {visible && (
        <div
          ref={setPopperRef as any}
          style={styles['popper']}
          {...attributes['popper']}
          className={`bg-white border-neutral-100 border shadow-xl z-10 w-64 py-4 text-sm`}
        >
          <ul className="text-neutral-900 font-medium">
            {user.enabled ? (
              <li
                className="py-3 hover:bg-neutral-100 cursor-pointer"
                onClick={handleDisableClick}
              >
                <span className="flex items-center">
                  <span className="mx-6 w-6 h-6">
                    <Disable />
                  </span>
                  <span>Disable</span>
                </span>
              </li>
            ) : (
              <li
                className="py-3 hover:bg-neutral-100 cursor-pointer"
                onClick={handleEnableClick}
              >
                <span className="flex items-center">
                  <span className="mx-6 w-6 h-6">
                    <Enable />
                  </span>
                  <span>Enable</span>
                </span>
              </li>
            )}
            <li
              className="py-3 hover:bg-neutral-100 cursor-pointer"
              onClick={handleResetPasswordClick}
            >
              <span className="flex items-center">
                <span className="mx-6 w-6 h-6">
                  <ResetPassword />
                </span>
                <span>Reset Password</span>
              </span>
            </li>
            <li
              className="py-3 hover:bg-neutral-100 cursor-pointer"
              onClick={handleDeleteClick}
            >
              <span className="flex items-center">
                <span className="mx-6 w-6 h-6">
                  <Close />
                </span>
                <span>Remove</span>
              </span>
            </li>
          </ul>
          <div style={styles['arrow']} />
        </div>
      )}
    </div>
  );
}
