import React, { Fragment, useEffect, useRef, useState } from 'react'
import { DocumentsService } from '../../../helpers/services/documentsService'
import { ILine } from "../../../helpers/types/line"
import { Close } from '../../Icons/icons'
import { usePopper } from 'react-popper'
import { useDispatch } from 'react-redux';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { TagsForFilterAndDisplay } from '../../../helpers/constants/primaryTags'

function useOutsideAlerter(ref: any, setExpanded: any) {
  useEffect(() => {
      function handleClickOutside(event: any) {
          if (ref.current && !ref.current.contains(event.target)) {
              setExpanded(false)
          }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside)
      }
  }, [ref])
}

export default function AllTagsPopover({onChange, onKeyDown, siteId, tagColors, onFilterTag, filterTag}: any) {

  const [visible, setVisibility] = useState(false);
  const [allTagKeys, setAllTagKeys] = useState(null)
  const [referenceRef, setReferenceRef] = useState(null)
  const [popperRef, setPopperRef] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setVisibility)
  const { styles, attributes } = usePopper(referenceRef, popperRef, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 1]
        }
      }
    ]
  })
  function handleDropdownClick(event: any) {
    updateTags();
    setVisibility(!visible); 
  }
  const systemTags = [
    'sysDeletedBy',
    'sysSharedWith',
    'sysFavoritedBy',
    'untagged',
    'path'
  ]
  const updateTags = () => {
    setAllTagKeys(null)
    DocumentsService.getAllTagKeys(siteId).then((data) => {
      setAllTagKeys(data?.values.filter((value: any) => {
        if (TagsForFilterAndDisplay.indexOf(value.value) === -1 && systemTags.indexOf(value.value) === -1) {
          return true
        } else {
          return false
        }
      }))
    })
  }
  return (
    <div className="relative" ref={wrapperRef}>
      <div ref={setReferenceRef as any} onClick={handleDropdownClick} className="bg-white border text-xs p-1 px-2 mx-1 mt-1 cursor-pointer hover:bg-gray-100">
        <span className="font-semibold">
          View All
        </span>
      </div>
      { visible && (
        <div ref={setPopperRef as any} style={styles['popper']} {...attributes['popper']}
          className={`bg-white text-gray-900 z-30 border w-132 text-sm pb-2`}
          >
          <div className="flex">
            { allTagKeys && (allTagKeys as []).length ? (
              <ul className="flex flex-wrap grow mt-1 justify-end">
                { allTagKeys && (allTagKeys as any).map((tagKey: any, i: number) => {
                  let tagColor = 'gray'
                  if (tagColors) {
                    tagColors.forEach((color: any) => {
                      if (color.tagKeys.indexOf(tagKey.value) > -1) {
                        tagColor = color.colorUri
                        return;
                      }
                    })
                  }
                  return (
                    <li
                      key={i}
                      className={(filterTag === tagKey.value ? "bg-coreOrange-500 text-white" : `bg-${tagColor}-200 text-black`) + " text-xs p-1 px-2 mx-1 mb-0.5 cursor-pointer"}
                      onClick={event => onFilterTag(event, tagKey.value)}
                      >
                      {tagKey.value}
                    </li>
                  )
                  })
                }
              </ul>
            ) : (
              <div className="flex flex-wrap grow mt-1 pt-1 justify-center text-xs font-semibold">
                no tags found
              </div>
            )}
            <div className="w-5 pt-2 ml-2">
              <div
                className="w-4 h-4 mr-2 cursor-pointer text-gray-400"
                onClick={event => handleDropdownClick(event)}
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