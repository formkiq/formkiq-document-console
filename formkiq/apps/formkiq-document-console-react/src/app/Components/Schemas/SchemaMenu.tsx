import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {Schema} from '../../helpers/types/schemas';
import {Pencil, Trash} from '../Icons/icons';
import ButtonPrimary from "../Generic/Buttons/ButtonPrimary";
import ButtonGhost from "../Generic/Buttons/ButtonGhost";
import ButtonSecondary from "../Generic/Buttons/ButtonSecondary";

type CaseMenuPropsType = {
  schema: Schema;
  updateSchema: (value: any) => void;
  deleteSchema?: () => void;
  openEditDialog: () => void;
};

function SchemaMenu({
                      schema,
                      updateSchema,
                      deleteSchema,
                      openEditDialog,
                    }: CaseMenuPropsType) {
  const [isNameSelected, setNameSelected] = useState(false);
  const [tempNameValue, setTempNameValue] = useState(schema.name);

  const editName = () => {
    setNameSelected(true);
    setTempNameValue(schema.name);
  };

  const cancelNameEditing = () => {
    setTempNameValue(schema.name);
    setNameSelected(false);
  };

  const saveName = () => {
    updateSchema({...schema, name: tempNameValue});
    setNameSelected(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-end">
          <ButtonSecondary onClick={openEditDialog}>
              Edit Schema
          </ButtonSecondary>
          <NavLink
            to="?editor=true"
            className="h-8 text-neutral-900 bg-neutral-200 hover:bg-neutral-300 rounded-md p-2 flex items-center gap-2 mr-2 whitespace-nowrap font-bold text-sm"
          >
            Open in Editor
            <div className="w-4 h-4">
              <Pencil/>
            </div>
          </NavLink>
          <NavLink
            to={'/schemas'}
            className="h-6 text-neutral-900 hover:text-primary-500 "
          >
            Return to Schemas
          </NavLink>
        </div>
        {deleteSchema && <div className="flex gap-2">
          <button
            className="h-6 text-gray-900 hover:text-primary-500"
            title="Delete Schema"
            type="button"
            onClick={deleteSchema}
          >
            <Trash/>
          </button>
        </div>}

      </div>
      <div className="border-b border-neutral-300 w-full mt-2"></div>

      <div className="flex gap-2 items-center mt-2">
        {isNameSelected ? (
          <div className="flex gap-2 items-center">
            <input
              className="w-full rounded-md h-8 border border-neutral-300 focus:border-neutral-300 p-4 text-neutral-900 text-sm outline-none focus-ring-2 focus:ring-neutral-300"
              placeholder="Name"
              autoFocus
              value={tempNameValue}
              onChange={(e) => setTempNameValue(e.target.value)}
            />
            <div className="px-4 h-8 flex items-center justify-end gap-2">
              <ButtonPrimary
                type="button"
                onClick={saveName}
              >
                SAVE
              </ButtonPrimary>
              <ButtonGhost
                type="button"
                onClick={cancelNameEditing}
              >
                CANCEL
              </ButtonGhost>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl font-bold text-neutral-900 ">
              {schema.name}
            </h2>
            <button className="w-6 h-6 text-neutral-400" onClick={editName}>
              <Pencil/>
            </button>
          </div>
        )}
      </div>

      <p className="text-neutral-700 text-sm mt-2">
        Allow Additional Attributes:{' '}
        <span className="font-bold text-neutral-900">
          {schema.attributes.allowAdditionalAttributes ? 'Yes' : 'No'}
        </span>
      </p>
    </>
  );
}

export default SchemaMenu;
