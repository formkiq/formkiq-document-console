import {useEffect, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import {TagsForFilterAndDisplay} from '../../../helpers/constants/primaryTags';
import {DocumentsService} from '../../../helpers/services/documentsService';
import {Attribute} from '../../../helpers/types/attributes';
import {Close} from '../../Icons/icons';

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

export default function AllTagsPopover({
                                         allAttributes,
                                         siteId,
                                         tagColors,
                                         onFilterTag,
                                         onFilterAttribute,
                                         filterTag,
                                         filterAttribute,
                                       }: any) {
  const [visible, setVisibility] = useState(false);
  const [allTagKeys, setAllTagKeys] = useState(null);
  const [allAttributesKeys, setAllAttributesKeys] = useState(null);
  const [referenceRef, setReferenceRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setVisibility);
  const {styles, attributes} = usePopper(referenceRef, popperRef, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 1],
        },
      },
    ],
  });

  function handleDropdownClick(event: any) {
    updateTags();
    updateAttributes();
    setVisibility(!visible);
  }

  const systemTags = [
    'sysDeletedBy',
    'sysSharedWith',
    'sysFavoritedBy',
    'untagged',
    'path',
  ];
  const updateTags = () => {
    setAllTagKeys(null);
    DocumentsService.getAllTagKeys(siteId).then((data) => {
      const tagKeys = (
        data?.values.filter((value: any) => {
          return (
            TagsForFilterAndDisplay.indexOf(value.value) === -1 &&
            systemTags.indexOf(value.value) === -1
          );
        })
      );
      setAllTagKeys(tagKeys);
    });
  };

  const updateAttributes = () => {
    const keyOnlyAttributes = allAttributes.filter((attribute: Attribute) => attribute.dataType === 'KEY_ONLY');
    const keyOnlyTagKeys = keyOnlyAttributes.map((attribute: Attribute) => ({value: attribute.key}));
    setAllAttributesKeys(keyOnlyTagKeys);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        ref={setReferenceRef as any}
        onClick={handleDropdownClick}
        className="mt-0.5 ml-1 bg-gradient-to-l from-gray-50 via-stone-100 to-gray-100 hover:from-gray-200 hover:via-stone-200 hover:to-gray-300 text-gray-900 border border-gray-200 text-xs font-semibold py-1 px-2 rounded-2xl flex cursor-pointer focus:outline-none"
      >
        <span className="font-semibold">View All Attributes</span>
      </button>
      {visible && (
        <div
          ref={setPopperRef as any}
          style={styles['popper']}
          {...attributes['popper']}
          className={`bg-white text-gray-900 z-30 border w-96 text-sm p-2`}
        >
          <div className="flex">
            <ul className="flex flex-wrap grow mt-1 justify-center">

              {allAttributesKeys && (allAttributesKeys as []).length && (
                <>
                  {allAttributesKeys &&
                    (allAttributesKeys as any).map((attribute: any, i: number) => {
                      let tagColor = 'gray';
                      if (tagColors) {
                        tagColors.forEach((color: any) => {
                          if (color.tagKeys.indexOf(attribute.value) > -1) {
                            tagColor = color.colorUri;
                            return;
                          }
                        });
                      }
                      return (
                        <li
                          key={i}
                          className={
                            (filterAttribute === attribute.value
                              ? 'bg-primary-500 text-white'
                              : `bg-${tagColor}-200 text-black`) +
                            ' text-xs p-1 px-2 mx-1 mb-0.5 cursor-pointer'
                          }
                          onClick={(event) => {
                            onFilterAttribute(event, attribute.value);
                            handleDropdownClick(event);
                          }}
                        >
                          {attribute.value}
                        </li>
                      );
                    })}
                </>
              )}
              {allTagKeys && (allTagKeys as []).length && (
                <>
                  {allTagKeys &&
                    (allTagKeys as any).map((tagKey: any, i: number) => {
                      let tagColor = 'gray';
                      if (tagColors) {
                        tagColors.forEach((color: any) => {
                          if (color.tagKeys.indexOf(tagKey.value) > -1) {
                            tagColor = color.colorUri;
                            return;
                          }
                        });
                      }
                      return (
                        <li
                          key={i}
                          className={
                            (filterTag === tagKey.value
                              ? 'bg-primary-500 text-white'
                              : `bg-${tagColor}-200 text-black`) +
                            ' text-xs p-1 px-2 mx-1 mb-0.5 cursor-pointer'
                          }
                          onClick={(event) => {
                            onFilterTag(event, tagKey.value);
                            handleDropdownClick(event);
                          }}
                        >
                          {tagKey.value}
                        </li>
                      );
                    })}
                </>
              )}
            </ul>

            {((!allTagKeys || (allTagKeys as []).length === 0) && (!allAttributesKeys || (allAttributesKeys as []).length === 0)) && (
              <div className="flex flex-wrap grow mt-1 pt-1 justify-center text-xs font-semibold">
                no attributes found
              </div>
            )}
            <div className="w-5 pt-2 ml-2">
              <div
                className="w-4 h-4 mr-2 cursor-pointer text-gray-400"
                onClick={(event) => handleDropdownClick(event)}
              >
                <Close />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
