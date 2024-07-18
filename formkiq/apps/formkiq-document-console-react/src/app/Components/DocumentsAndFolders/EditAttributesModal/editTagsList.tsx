import {useEffect, useState} from 'react';
import {IDocumentTag} from '../../../helpers/types/documentTag';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import {Close, Pencil, Plus, Spinner, Trash} from '../../Icons/icons';

type TagProps = {
  isOpened: boolean;
  inputValue: string;
  values: string[];
};

function tagListIem(
  tag: IDocumentTag,
  index: number,
  tags: IDocumentTag[],
  editingTags: TagProps[],
  setEditingTags: any,
  onEdit: any,
  onDelete: any
) {
  const toggleEdit = () => {
    const newArr = [...editingTags];
    newArr[index].isOpened = !newArr[index]?.isOpened;
    setEditingTags(newArr);
  };
  const closeEdit = () => {
    const newArr = [...editingTags];
    newArr[index].isOpened = !newArr[index]?.isOpened;
    newArr[index].inputValue = tag.value
      ? tag.value
      : editingTags[index].inputValue;
    setEditingTags(newArr);
  };

  const updateInputValue = (e: any) => {
    const newArr = [...editingTags];
    newArr[index].inputValue = e.target.value;
    setEditingTags(newArr);
  };
  const handleAddValue = () => {
    const newValue = editingTags[index].inputValue;
    const newArr = [...editingTags];
    if (newValue === '') return;
    if (editingTags[index].values.includes(newValue)) return;
    newArr[index].values.push(newValue);
    newArr[index].inputValue = ""
    setEditingTags(newArr);
  };

  const deleteValue = (e: any, value: string) => {
    e.stopPropagation();
    const newArr = [...editingTags];
    newArr[index].values = newArr[index].values.filter((item: string) => item !== value);
    setEditingTags(newArr);
  };
  const onRemove = () => {
    onDelete(tag.key);
  };

  const onSave = () => {
    if (editingTags[index].values.length === 1) {
      onEdit(tag.key, editingTags[index].values[0]);
    } else if (editingTags[index].values.length > 1) {
      onEdit(tag.key, editingTags[index].values);
    } else {
      onEdit(tag.key, editingTags[index].inputValue);
    }
  };

  const actionButtons = () => {
    if (editingTags[index]?.isOpened) {
      return (
        <div className="flex gap-4 h-6 items-center justify-end">
          <ButtonPrimaryGradient onClick={onSave}>Save</ButtonPrimaryGradient>
          <ButtonGhost onClick={closeEdit}>Cancel</ButtonGhost>
          <button onClick={onRemove} title="Remove" className="h-4">
            <Trash/>
          </button>
        </div>
      );
    }
    return (
      <div className="flex gap-4 items-center justify-end">
        <button className="h-4" title="Edit" onClick={toggleEdit}>
          <Pencil/>
        </button>
        <button onClick={onRemove} title="Remove" className="h-4">
          <Trash/>
        </button>
      </div>
    );
  };

  const tagValue = () => {
    if (editingTags[index]?.isOpened) {
      return (<div className="flex flex-row justify-start flex-wrap gap-2 items-end max-w-2/3">
          {editingTags[index].values.map((value: string, index: number) => (
            <div key={"value_" + index}
                 className="max-w-[300px] cursor-pointer py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
              <span className="truncate">{value}</span>
              <button title="Remove Value" type="button" className="w-4 h-4 min-w-4 text-neutral-900"
                      onClick={(e) => deleteValue(e, value)}>
                <Close/>
              </button>
            </div>))}

          <div className="flex flex-row items-center justify-start flex-wrap gap-2 items-end">
            <input type="text" className='h-7 px-4 border border-neutral-300 text-sm rounded-md'
                   required placeholder="Value" onChange={updateInputValue}
                   value={editingTags[index].inputValue}/>
            <button title="Add Value" type="button"
                    className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                    onClick={handleAddValue}>
              <Plus/>
            </button>
          </div>


        </div>
      );
    } else {
      return tag.value
        ? tag.value
        : (tag.values
          ? tag.values.join(', ')
          : (editingTags[index]?.inputValue
            ? editingTags[index].inputValue
            : ''));
    }
  };

  return (
    <tr key={index} className="border-t border-neutral-300">
      <td className="p-4">{tag.key}</td>
      <td className="p-4">{tagValue()}</td>
      <td className="p-4">{actionButtons()}</td>
    </tr>
  );
}

export default function EditTagsList({
                                       tags,
                                       onEdit,
                                       onDelete,
                                     }: {
  tags: IDocumentTag[] | null;
  onEdit: any;
  onDelete: any;
}) {
  const [tagsPrors, setEditingTags] = useState([]);

  useEffect(() => {
    setEditingTags(
      tags?.map((el) => {
        if (el.values) {
          return {
            isOpened: false,
            inputValue: "",
            values: el.values,
          };
        }
        return {
          isOpened: false,
          inputValue: el.value,
          values: [],
        };
      }) as any
    );
  }, [tags]);
  if (tags) {
    return tags.length > 0 ? (
      <div className="overflow-auto max-h-64 overflow-y-auto">
        <table className="border border-neutral-300 border-collapse table-auto w-full text-sm">
          <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100">
          <tr>
            <th
              className="w-40 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Key
            </th>
            <th
              className="max-w-2/3 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Value
            </th>
            <th
              className="w-52 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-end">
              Actions
            </th>
          </tr>
          </thead>
          {tagsPrors && (
            <tbody className="bg-white nodark:bg-slate-800">
            {tags.map((tag: IDocumentTag, i: number) => {
              return tagListIem(
                tag,
                i,
                tags,
                tagsPrors,
                setEditingTags,
                onEdit,
                onDelete
              );
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
    );
  } else {
    return <Spinner/>;
  }
}
