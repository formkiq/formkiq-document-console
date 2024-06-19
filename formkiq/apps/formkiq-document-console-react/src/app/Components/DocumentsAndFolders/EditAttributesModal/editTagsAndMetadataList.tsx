import { useEffect, useState } from 'react';
import { IDocumentTag } from '../../../helpers/types/documentTag';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import { Pencil, Spinner, Trash } from '../../Icons/icons';

type TagProps = {
  isOpened: boolean;
  inputValue: string;
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

  const onRemove = () => {
    onDelete(tag.key);
  };

  const onSave = () => {
    onEdit(tag.key, editingTags[index].inputValue);
  };

  const actionButtons = () => {
    if (editingTags[index]?.isOpened) {
      return (
        <div className="flex gap-4 h-6 items-center justify-end">
          <ButtonPrimaryGradient onClick={onSave}>Save</ButtonPrimaryGradient>
          <ButtonGhost onClick={closeEdit}>Cancel</ButtonGhost>
          <button onClick={onRemove} title="Remove" className="h-4">
            <Trash />
          </button>
        </div>
      );
    }
    return (
      <div className="flex gap-4 items-center justify-end">
        <button className="h-4" title="Edit" onClick={toggleEdit}>
          <Pencil />
        </button>
        <button onClick={onRemove} title="Remove" className="h-4">
          <Trash />
        </button>
      </div>
    );
  };

  const tagValue = () => {
    if (editingTags[index]?.isOpened) {
      return (
        <input
          type="text"
          defaultValue={editingTags[index].inputValue}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1 h-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Value"
          onChange={updateInputValue}
        />
      );
    } else {
      return tag.value
        ? tag.value
        : editingTags[index]?.inputValue
        ? editingTags[index].inputValue
        : '';
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
export default function EditTagsAndMetadataList({
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
          const res = el.values
            .map((val) => {
              return val;
            })
            .join(',');
          return {
            isOpened: false,
            inputValue: res,
          };
        }
        return {
          isOpened: false,
          inputValue: el.value,
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
              <th className="w-52 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Key
              </th>
              <th className="p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Value
              </th>
              <th className="w-100 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-end">
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
    return <Spinner />;
  }
}
