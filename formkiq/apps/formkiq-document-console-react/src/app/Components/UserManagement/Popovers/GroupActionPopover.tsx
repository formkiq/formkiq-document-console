import {useEffect, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import {ILine} from '../../../helpers/types/line';
import {
  FilePlus,
  Trash,
  VerticalDots,
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

export default function GroupActionsPopover({
                                             value,
                                             onManageMembersClick,
                                             onDuplicateClick,
                                             onDeleteClick,
                                           }: any) {
  const line: ILine = value;
  const [visible, setVisibility] = useState(false);
  const [referenceRef, setReferenceRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setVisibility);
  const {styles, attributes} = usePopper(referenceRef, popperRef, {
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

  function handleDuplicateClick() {
    onDuplicateClick(line.groupName);
    setVisibility(false);
  }

  function handleDeleteClick() {
    onDeleteClick(line.groupName);
    setVisibility(false);
  }

  const handleManageMembersClick = () => {
    onManageMembersClick(line.groupName)
    setVisibility(false);
  }

  return (
    <div className="relative h-6" ref={wrapperRef}>
      <button
        ref={setReferenceRef as any}
        onClick={handleDropdownClick}
        className="w-6 hover:text-primary-500"
      >
        <VerticalDots/>
      </button>
      {visible && (
        <div
          ref={setPopperRef as any}
          style={styles['popper']}
          {...attributes['popper']}
          className={`bg-white border-neutral-100 border shadow-xl z-10 w-64 py-4 text-sm`}
        >
          <ul className="text-neutral-900 font-medium">

            {/*Sharing a group not implemented yet*/}
            {/*<li*/}
            {/*  className="py-3 hover:bg-neutral-100 cursor-pointer"*/}
            {/*  onClick={(event) =>*/}
            {/*    onShareClick(event, {*/}
            {/*      lineType: line.lineType,*/}
            {/*      documentId: line.groupName,*/}
            {/*    })*/}
            {/*  }*/}
            {/*>*/}
            {/*    <span className='flex items-center'>*/}
            {/*      <span className="mx-6 w-6 h-6">*/}
            {/*        <Export/>*/}
            {/*      </span>*/}
            {/*      <span>Share</span>*/}
            {/*    </span>*/}
            {/*</li>*/}
            <li className="py-3 hover:bg-neutral-100 cursor-pointer" onClick={handleManageMembersClick}>
              <span className='flex items-center'>
                <span className="mx-6 w-6 h-6">
                  <FilePlus/>
                </span>
                <span>Manage Members</span>
              </span>
            </li>

            <li
              className="py-3 hover:bg-neutral-100 cursor-pointer"
              onClick={handleDeleteClick}
            >
                <span className='flex items-center'>
                  <span className="mx-6 w-6 h-6">
                    <Trash/>
                  </span>
                  <span>Delete</span>
                </span>
            </li>
          </ul>
          <div style={styles['arrow']}/>
        </div>
      )}
    </div>
  );
}
