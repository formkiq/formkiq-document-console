import React, { Fragment, useEffect, useRef, useState } from 'react'
import { DocumentsService } from '../../../helpers/services/documentsService'
import { ILine } from "../../../helpers/types/line"
import { Close, ColorPicker, Tag, Spinner } from '../../Icons/icons'
import { usePopper } from 'react-popper'
import { useDispatch } from 'react-redux';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import AddTag from '../AddTag/addTag';
import TagColorPickerPopover from './tagColorPickerPopover'
import { setTagColors } from '../../../Store/reducers/config'

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

export default function DocumentTagsPopover({onChange, onKeyDown, siteId, value, tagColors, onTagChange}: any) {

  const line: ILine = value
  const [visible, setVisibility] = useState(false);
  const [allTags, setAllTags] = useState(null)
  const [referenceRef, setReferenceRef] = useState(null)
  const [popperRef, setPopperRef] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTagColorEditMode, setIsTagColorEditMode] = useState(false)
  const systemTags = [
    'sysDeletedBy',
    'sysSharedWith',
    'sysFavoritedBy',
    'untagged',
    'path'
  ]

  useEffect(() => {
    // updateTags()
  }, [line])

  const updateTags = () => {
    if (line) {
      setAllTags(null)
      setIsLoading(true)
      DocumentsService.getDocumentTags(line.documentId as string, siteId).then((data) => {
        setAllTags(data?.tags.filter((tag: any) => {
          if (systemTags.indexOf(tag.key) === -1) {
            return true
          } else {
            return false
          }
        }))
        setIsLoading(false)
      })
    }
  }
  const onTagDelete = (tagKey: string) => {
    const deleteFunc = () => {
      setAllTags(null)
      DocumentsService.deleteDocumentTag(value?.documentId as string, siteId, tagKey).then(() => {
        setTimeout(() => {
          onTagChange(value);
        }, 500)
      })
    }
    dispatch(openDialog({ callback: deleteFunc, dialogTitle: 'Are you sure you want to delete this tag?'}))
  }
  const toggleTagColorEdit = () => {
    setIsTagColorEditMode(!isTagColorEditMode)
  }

  const dispatch = useDispatch()

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setVisibility)
  const { styles, attributes } = usePopper(referenceRef, popperRef, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [-100, 0]
        }
      }
    ]
  })
  const onTagColorChange = (tagKey: string, colorUri: string) => {
    const replacementTagColors = [...tagColors]
    let previousColorUri = ''
    let previousColorIndex = -1
    let previousTagKeyIndex = -1
    let newColorIndex = -1
    replacementTagColors.forEach((tagColor: any, i: number) => {
      if (tagColor.colorUri === colorUri) {
        newColorIndex = i
      }
      if (tagColor.tagKeys.indexOf(tagKey) > -1) {
        previousColorIndex = i
        previousTagKeyIndex = tagColor.tagKeys.indexOf(tagKey)
        if (tagColor.colorUri !== colorUri) {
          previousColorUri = colorUri
        }
      }
    })
    if (previousColorIndex > -1) {
      if (previousColorUri.length) {
        const previousColorTagKeys = [...replacementTagColors[previousColorIndex].tagKeys]
        previousColorTagKeys.splice(previousTagKeyIndex, 1)
        const newColorTagKeys = [...replacementTagColors[newColorIndex].tagKeys]
        newColorTagKeys.push(tagKey)
        replacementTagColors[previousColorIndex] = {
          colorUri: replacementTagColors[previousColorIndex].colorUri,
          tagKeys: previousColorTagKeys
        }
        replacementTagColors[newColorIndex] = {
          colorUri: replacementTagColors[newColorIndex].colorUri,
          tagKeys: newColorTagKeys
        }        
      }
    } else {
      const newColorTagKeys = [...replacementTagColors[newColorIndex].tagKeys]
      newColorTagKeys.push(tagKey)
      replacementTagColors[newColorIndex] = {
        colorUri: replacementTagColors[newColorIndex].colorUri,
        tagKeys: newColorTagKeys
      }
    }
    dispatch(setTagColors(replacementTagColors))
  }
  function handleDropdownClick(event: any) {
    updateTags();
    if (visible) {
      setIsTagColorEditMode(false)
    }
    setVisibility(!visible); 
  }
  return (
    <div className="relative" ref={wrapperRef}>
      <button ref={setReferenceRef as any} onClick={handleDropdownClick} className="w-5">
        <Tag />
      </button>
      { visible && (
        <div ref={setPopperRef as any} style={styles['popper']} {...attributes['popper']}
          className={`bg-white text-gray-900 border-gray-100 border shadow-xl z-10 rounded-xl w-72 text-sm p-2`}
          >
          <div className="mb-2 flex items-center">
            <h2 className="grow text-base font-semibold">Tags</h2>
            <button
              className="bg-white border text-xs p-1 px-2 mx-1 mt-1 cursor-pointer hover:bg-gray-100"
              onClick={toggleTagColorEdit}
              >
              { isTagColorEditMode ? (
                <>
                  End Tag Color Edit
                </>
              ) : (
                <>
                  Edit Tag Colors
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap">
            { isLoading && (
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            )}
            { allTags && (allTags as []).map((tag: any, i: number) => {
              let isKeyOnlyTag = false
              if ((tag.value !== undefined && tag.value.length === 0) || (tag.values !== undefined && tag.values.length === 0)) {
                isKeyOnlyTag = true
              }
              let tagColor = 'gray'
              if (tagColors) {
                tagColors.forEach((color: any) => {
                  if (color.tagKeys.indexOf(tag.key) > -1) {
                    tagColor = color.colorUri
                    return;
                  }
                })
              }
              return (
                <div key={i} className="inline">
                  { isKeyOnlyTag && (
                    <div className="pt-0.5 pr-1 flex items-center">
                      <div className={`h-5.5 rounded-l-md pr-1 bg-${tagColor}-200 flex items-center`}>
                        { isTagColorEditMode && (
                          <TagColorPickerPopover onColorChange={onTagColorChange} tagKey={tag.key} tagColors={tagColors} />
                        )}
                        <span className="p-2">
                          {tag.key}
                        </span>
                        <button
                          className="pl-1 font-semibold hover:text-red-600"
                          onClick={event => onTagDelete(tag.key)}
                          >
                          <div className="w-3.5 text-gray-600">
                            <Close />
                          </div>
                        </button>
                      </div>
                      <div className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}></div>
                    </div> 
                  )}
                </div>
              )
            })
            }
          </div>
          { !isLoading && (
            <div className="mt-4 flex justify-center items-center w-full">
              <AddTag line={line} onTagChange={onTagChange} updateTags={updateTags} siteId={siteId} tagColors={tagColors}/>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}