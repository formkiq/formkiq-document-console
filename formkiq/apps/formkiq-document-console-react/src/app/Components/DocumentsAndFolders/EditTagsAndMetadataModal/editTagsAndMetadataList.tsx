import { useEffect, useState } from 'react'
import { IDocumentTag } from '../../../helpers/types/documentTag';
import { Spinner } from '../../Icons/icons';

type TagProps = {
  isOpened: boolean,
  inputValue: string 
}

function tagListIem(tag: IDocumentTag, index: number, tags: IDocumentTag [], editingTags: TagProps [], setEditingTags: any, onEdit: any, onDelete: any) {
  const toggleEdit = () => {
    let newArr = [...editingTags]
    newArr[index].isOpened = !newArr[index]?.isOpened
    setEditingTags(newArr)
  }
  const closeEdit = () => {
    let newArr = [...editingTags]
    newArr[index].isOpened = !newArr[index]?.isOpened
    newArr[index].inputValue = tag.value ? tag.value : editingTags[index].inputValue
    setEditingTags(newArr)
  }

  const updateInputValue = (e: any) => {
    let newArr = [...editingTags]
    newArr[index].inputValue = e.target.value
    setEditingTags(newArr)
  }

  const onRemove = () => {
    onDelete(tag.key)
  }

  const onSave = () => {
    onEdit(tag.key, editingTags[index].inputValue)
  }

  const actionButtons = () => {
    if(editingTags[index]?.isOpened) {
      return (
        <div className='flex gap-4'>
          <button onClick={onSave} className="bg-coreOrange-500 hover:bg-coreOrange-600 text-white font-semibold py-2 px-4 rounded">
            Save
          </button>
          <button onClick={closeEdit} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={onRemove} className='bg-red-400 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'>
            Remove
          </button>
        </div>
      )
    }
    return (
      <div className='flex gap-4'>
        <button className="bg-coreOrange-500 hover:bg-coreOrange-600 text-white font-semibold py-2 px-4 rounded" onClick={toggleEdit}>Edit</button>
        <button onClick={onRemove} className='bg-red-400 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'>
          Remove
        </button>
      </div>
    )
  }

  const tagValue = () => {
    if(editingTags[index]?.isOpened){
      return (
        <input 
          type="text" 
          defaultValue={editingTags[index].inputValue} 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Value" 
          onChange={updateInputValue}
        />
      )
    } else {
      return (
        tag.value ? tag.value : editingTags[index].inputValue
      )
    }
  }
  
  return (
    <tr key={index}>
      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400">
          {tag.key}
      </td>
      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400">
        {tagValue()}
      </td>
      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400">
          {actionButtons()}
      </td>
    </tr>
  )
}
export default function EditTagsAndMetadataList({ tags, onEdit, onDelete }: { tags: IDocumentTag [] | null, onEdit: any, onDelete: any}) {
  
  const [tagsPrors, setEditingTags] = useState([])

  useEffect(() => {
    setEditingTags(tags?.map((el) => {
      if(el.values) {
        const res =  el.values.map( val => {
          return val 
        }).join(",")
        return {
          isOpened: false,
          inputValue: res
        }
      }
      return {
        isOpened: false,
        inputValue: el.value 
      }
    }) as any)
  }, [tags])
  if(tags){
    return tags.length > 0 ? (
        <div className="overflow-auto max-h-64 overflow-y-scroll">
        <table className="border-collapse table-fixed w-full text-sm">
          <thead>
              <tr>
              <th className="border-b nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Key</th>
              <th className="border-b nodark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Value</th>
              <th className="border-b nodark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Actions</th>
              </tr>
          </thead>
          {tagsPrors && (
            <tbody className="bg-white nodark:bg-slate-800">
                {tags.map((tag: IDocumentTag, i: number) => {
                    return tagListIem(tag, i, tags, tagsPrors, setEditingTags, onEdit, onDelete)
                })}
            </tbody>
          )}
          
        </table>
      </div>
      ) : (
          <div className="text-center mt-4">
            <div role="status">
              <div className="overflow-x-auto relative">No tags found</div>
            </div>
          </div>
        )
  } else {
    return <Spinner />
  }
}