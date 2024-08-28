import { Pencil, Trash } from '../Icons/icons';
import { Mapping } from '../../helpers/types/mappings';
import { useState } from 'react';
import ButtonTertiary from '../Generic/Buttons/ButtonTertiary';
import ButtonPrimaryGradient from '../Generic/Buttons/ButtonPrimaryGradient';

type GroupMenuPropsType = {
  onMappingDelete: () => void;
  mapping: Mapping;
  saveChanges: (mapping: Mapping) => void;
};

function MappingMenu({
  onMappingDelete,
  mapping,
  saveChanges,
}: GroupMenuPropsType) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState(mapping.name);
  const [description, setDescription] = useState(mapping.description);
  const onSave = () => {
    const updatedMapping = { ...mapping, name, description };
    saveChanges(updatedMapping);
    setIsEditing(false);
  };
  return (
    <>
      <div className="flex justify-between items-center h-14 min-h-[56px] px-6 border-b border-neutral-300 ">
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <>
              <input
                className="border-b border-neutral-300 rounded-md text-lg"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold">{mapping.name}</h2>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <>
              <ButtonTertiary onClick={() => setIsEditing(!isEditing)}>
                Cancel
              </ButtonTertiary>
              <ButtonPrimaryGradient onClick={onSave}>
                Save
              </ButtonPrimaryGradient>
              <div className="h-6 w-px bg-neutral-300"></div>
            </>
          ) : (
            <button
              title="Edit"
              className="w-5 h-5 hover:text-primary-500"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil />
            </button>
          )}
          <button
            title="Delete"
            className="w-5 h-5 hover:text-primary-500"
            onClick={onMappingDelete}
          >
            <Trash />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center py-4 px-6">
        {isEditing ? (
          <textarea
            className="border-b border-neutral-300 resize-none"
            placeholder="Description"
            cols={60}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
            <p className="text-sm">{mapping.description}</p>
        )}
      </div>
    </>
  );
}

export default MappingMenu;
