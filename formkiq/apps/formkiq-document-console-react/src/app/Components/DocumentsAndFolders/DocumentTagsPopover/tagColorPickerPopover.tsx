import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';
import { ColorPicker } from '../../Icons/icons';

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

export default function TagColorPickerPopover({
  onChange,
  onKeyDown,
  onColorChange,
  tagKey,
  tagColors,
}: any) {
  const dispatch = useDispatch();
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
  function handleColorChange(color: string) {
    onColorChange(tagKey, color);
    setVisibility(!visible);
  }
  return (
    <div className="relative" ref={wrapperRef}>
      <button
        className="pl-1 pt-0.5 font-semibold"
        ref={setReferenceRef as any}
        onClick={handleDropdownClick}
      >
        <div className="w-4 text-gray-600">
          <ColorPicker />
        </div>
      </button>
      {visible && (
        <div
          ref={setPopperRef as any}
          style={styles['popper']}
          {...attributes['popper']}
          className={`bg-white border-gray-100 border shadow-xl z-10 rounded-xl w-48 text-sm p-2`}
        >
          {tagColors.map((tagColor: any, i: number) => {
            const pickerClasses =
              'mx-0.5 w-5 h-5 inline-flex rounded-full cursor-pointer border-2 border-gray-600 focus:outline-none focus:shadow-outline';
            // NOTE: in order to be included in the compressed Tailwind CSS, we need to reference the full color as a class for bg and border-l
            switch (tagColor.colorUri) {
              case 'flamingo':
                return (
                  <div
                    key={i}
                    className={`bg-flamingo-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-flamingo-200"></span>
                  </div>
                );
              case 'turbo':
                return (
                  <div
                    key={i}
                    className={`bg-turbo-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-turbo-200"></span>
                  </div>
                );
              case 'citrus':
                return (
                  <div
                    key={i}
                    className={`bg-citrus-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-citrus-200"></span>
                  </div>
                );
              case 'buttercup':
                return (
                  <div
                    key={i}
                    className={`bg-buttercup-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-buttercup-200"></span>
                  </div>
                );
              case 'mountain-meadow':
                return (
                  <div
                    key={i}
                    className={`bg-mountain-meadow-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-mountain-meadow-200"></span>
                  </div>
                );
              case 'dodger-blue':
                return (
                  <div
                    key={i}
                    className={`bg-dodger-blue-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-dodger-blue-200"></span>
                  </div>
                );
              case 'cornflower-blue':
                return (
                  <div
                    key={i}
                    className={`bg-cornflower-blue-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-cornflower-blue-200"></span>
                  </div>
                );
              case 'orchid':
                return (
                  <div
                    key={i}
                    className={`bg-orchid-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-orchid-200"></span>
                  </div>
                );
              case 'french-rose':
                return (
                  <div
                    key={i}
                    className={`bg-french-rose-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-french-rose-200"></span>
                  </div>
                );
              case 'ochre':
                return (
                  <div
                    key={i}
                    className={`bg-ochre-200 ${pickerClasses}`}
                    onClick={(event) => handleColorChange(tagColor.colorUri)}
                  >
                    <span className="border-l-ochre-200"></span>
                  </div>
                );
              default:
                console.log(tagColor.colorUri);
                return <div key={i}></div>;
            }
            return <></>;
          })}
        </div>
      )}
    </div>
  );
}
