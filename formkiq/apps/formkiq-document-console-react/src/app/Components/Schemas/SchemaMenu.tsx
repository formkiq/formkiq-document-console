import {NavLink, useLocation} from 'react-router-dom';
import ButtonPrimary from '../Generic/Buttons/ButtonPrimary';
import { Json, Trash } from '../Icons/icons';

type CaseMenuPropsType = {
  deleteSchema?: () => void;
  onEditClick: () => void;
  isEditing: boolean;
};

function SchemaMenu({
  deleteSchema,
  onEditClick,
  isEditing,
}: CaseMenuPropsType) {
  const {pathname} = useLocation();
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 items-end h-8">
          {isEditing ? (
            <></>
          ) : (
            <>
              <ButtonPrimary onClick={onEditClick}>Edit Schema</ButtonPrimary>
              <NavLink
                to="?editor=true"
                className="h-8 text-neutral-900 bg-neutral-200 hover:bg-neutral-300 rounded-md p-2 flex items-center gap-2 mr-2 whitespace-nowrap font-bold text-sm"
              >
                Open in JSON Editor
                <div className="w-4 h-4">
                  <Json />
                </div>
              </NavLink>
            </>
          )}
          <NavLink
            to={pathname.substring(0, pathname.lastIndexOf('/'))}
            className="text-neutral-900 hover:text-primary-500 "
          >
            Return to Schemas
          </NavLink>
        </div>
        {deleteSchema && (
          <div className="flex gap-2">
            <button
              className="h-6 text-gray-900 hover:text-primary-500"
              title="Delete Schema"
              type="button"
              onClick={deleteSchema}
            >
              <Trash />
            </button>
          </div>
        )}
      </div>
      <div className="border-b border-neutral-300 w-full mt-2"></div>
    </>
  );
}

export default SchemaMenu;
