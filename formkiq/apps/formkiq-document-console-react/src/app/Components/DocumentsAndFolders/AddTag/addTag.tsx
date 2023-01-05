import React, { useEffect, useRef, useState } from 'react'
import { DocumentsService } from '../../../helpers/services/documentsService'
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { TagsForFilterAndDisplay } from '../../../helpers/constants/primaryTags'
import { openDialog } from "../../../Store/reducers/globalNotificationControls"

export default function AddTag({line, onTagChange, updateTags, siteId, tagColors}: any) {

  const { register, formState: { errors }, handleSubmit, reset, getValues, setValue } = useForm();
  const dispatch = useDispatch()
  const addTagFormRef = useRef<HTMLFormElement>(null)
  const typeaheadSelectRef = useRef<HTMLSelectElement>(null)
  const [allTagKeys, setAllTagKeys] = useState(null)
  const [typeaheadVisible, setTypeaheadVisible] = useState(false)
  const [typeaheadTagKeys, setTypeaheadTagKeys] = useState([])

  const onAddTagSubmit = async (data: any) => {
    if (data.key.indexOf('/') > -1) {
      dispatch(openDialog({ dialogTitle: 'Tags cannot contain forward slashes.'}))
      return
    }
    DocumentsService.addTag(line.documentId, siteId, data).then((response) => {
      setTimeout(() => {
        updateTags()
      }, 200)
    })
    reset();
    setTimeout(() => {
      onTagChange(line);
    }, 500)
  };


  useEffect(() => {
    const systemTags = [
      'sysDeletedBy',
      'sysSharedWith',
      'sysFavoritedBy',
      'untagged',
      'path'
    ];
    setAllTagKeys(null)
    DocumentsService.getAllTagKeys(siteId).then((data) => {
      const tagKeys = data?.values.filter((value: any) => {
        if (systemTags.indexOf(value.value) === -1) {
          return true
        } else {
          return false
        }
      })
      const checkTagKeys = [...tagKeys]

      TagsForFilterAndDisplay.forEach((filterTagKey) => {
        let matchFound = false
        checkTagKeys.forEach((checkTagKey) => {
          if (checkTagKey.value === filterTagKey) {
            matchFound = true
            return
          }
        })
        if (!matchFound) {
          tagKeys.push({
            value: filterTagKey
          })
        }
      })
      setAllTagKeys(tagKeys)
    })  
  }, [])
  
  const toggleTypeahead = (show = false, hide = false) => {
    if (!typeaheadVisible) {
      getTypeaheadTags()
    }
    if (show) {
      setTypeaheadVisible(true)
    } else if (hide) {
      setTypeaheadVisible(false)
    } else {
      setTypeaheadVisible(!typeaheadVisible)
    }
  }

  const getTypeaheadTags = () => {
    if (typeaheadSelectRef.current && allTagKeys) {
      const startsWith = getValues('key')
      const tagsForTypeahead = (allTagKeys as []).filter((tagKey: any) => {
        if (!startsWith.length || (tagKey.value.indexOf(startsWith) === 0)) {
          return tagKey.value
        }
      })
      setTypeaheadTagKeys(tagsForTypeahead)
    }
  }

  const setAddTagValue = (event: any) => {
    if (typeaheadSelectRef.current) {
      setValue('key', typeaheadSelectRef.current.options[typeaheadSelectRef.current.selectedIndex].value)
      toggleTypeahead(false, true)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onAddTagSubmit)}
      className="w-full"
      ref={addTagFormRef}
      >
      <div className="flex items-start relative w-full">
        <div className="w-48 mr-2">
          <input
            aria-label="Tag Key"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-1 py-1 border border-gray-600
                              text-sm
                              placeholder-gray-500 text-gray-900 rounded-t-md
                              focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            placeholder="new tag"
            autoComplete="off"
            onFocus={event => toggleTypeahead(true)}
            onKeyUp={getTypeaheadTags}
            {...register('key', {
              required: true
            })}
          />
        </div>
        <div>
          <input type="submit" value="Add" className="bg-coreOrange-500 hover:bg-coreOrange-600 text-white text-sm font-semibold py-1 px-2 rounded" />
        </div>
      </div>
      <div className={'mx-2 mt-1 w-56 ' + (typeaheadVisible ? '' : 'hidden')}>
        <select
          size={4}
          ref={typeaheadSelectRef}
          className="w-full border rounded-md cursor-pointer"
          onChange={event => setAddTagValue(event)}
          >
          {(typeaheadTagKeys as []).map((tagKey: any, i: number) => {
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
              <option key={i} value={tagKey.value} className={`my-0.5 mx-1 p-1 bg-${tagColor}-200`}>
                {tagKey.value}
              </option>
            )
          })}
        </select>
      </div>
    </form>
  )
}