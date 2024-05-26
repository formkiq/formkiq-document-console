import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { TagSchema } from '../../helpers/types/tagSchemas';
import { Pencil, Trash } from '../Icons/icons';

type CaseMenuPropsType = {
  tagSchema: TagSchema;
  updateTagSchema: (value: any) => void;
  deleteTagSchema: () => void;
};

function CaseMenu({
  tagSchema,
  updateTagSchema,
  deleteTagSchema,
}: CaseMenuPropsType) {
  const [isNameSelected, setNameSelected] = useState(false);
  const [tempNameValue, setTempNameValue] = useState(tagSchema.name);

  const editName = () => {
    setNameSelected(true);
    setTempNameValue(tagSchema.name);
  };

  const cancelNameEditing = () => {
    setTempNameValue(tagSchema.name);
    setNameSelected(false);
  };

  const saveName = () => {
    updateTagSchema({ ...tagSchema, name: tempNameValue });
    setNameSelected(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-end">
          <NavLink
            to="?editor=true"
            className="h-8 text-neutral-900 bg-neutral-200 hover:bg-neutral-300 rounded-md p-2 flex items-center gap-2 mr-2 whitespace-nowrap font-bold text-sm"
          >
            Open in Editor
            <div className="w-4 h-4">
              <Pencil />
            </div>
          </NavLink>
          <NavLink
            to={'/schemas'}
            className="h-6 text-neutral-900 hover:text-primary-500 "
          >
            Return to Schemas
          </NavLink>
        </div>

        <div className="flex gap-2">
          <button
            className="h-6 text-gray-900 hover:text-primary-500"
            title="Delete Schema"
            type="button"
            onClick={deleteTagSchema}
          >
            <Trash />
          </button>
        </div>
      </div>
      <div className="border-b border-neutral-300 w-full mt-2"></div>

      <div className="flex gap-2 items-center">
        {isNameSelected ? (
          <div className="flex gap-2 items-center">
            <input
              className="w-full h-8 border border-neutral-300 focus:border-neutral-300 p-4 text-neutral-900 text-sm outline-none focus-ring-2 focus:ring-neutral-300"
              placeholder="Name"
              autoFocus
              value={tempNameValue}
              onChange={(e) => setTempNameValue(e.target.value)}
            />
            <div className="px-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className="h-8 bg-primary-500 hover:bg-primary-600 rounded-md text-white px-4  font-bold"
                onClick={saveName}
              >
                SAVE
              </button>
              <button
                type="button"
                className="h-8 border border-neutral-900 text-neutral-900 hover:text-primary-500 rounded-md px-4 font-bold"
                onClick={cancelNameEditing}
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl font-bold text-neutral-900 ">
              {tagSchema.name}
            </h2>
            {/*Uncomment to enable editing name of the tag schema.*/}

            {/*<button className="w-6 h-6 text-neutral-400" onClick={editName}>*/}
            {/*  <Pencil/>*/}
            {/*</button>*/}
          </div>
        )}
      </div>

      <p className="text-neutral-700 text-sm mt-2">
        Allow Additional Tags:{' '}
        <span className="font-bold text-neutral-900">
          {tagSchema.tags.allowAdditionalTags ? 'Yes' : 'No'}
        </span>
      </p>
    </>
  );
}

export default CaseMenu;
