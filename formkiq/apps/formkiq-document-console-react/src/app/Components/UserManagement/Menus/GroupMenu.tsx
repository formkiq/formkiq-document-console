import { Group, User } from '../../../helpers/types/userManagement';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import UsersCombobox from '../../Generic/Listboxes/UsersCombobox';
import { Info, Trash } from '../../Icons/icons';

type GroupMenuPropsType = {
  onGroupDelete: () => void;
  setInfoTabOpen: () => void;
  group: Group;
  user: any;
  isInfoTabOpen: boolean;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  addGroupMember: () => void;
};

function GroupMenu({
  onGroupDelete,
  user,
  group,
  setInfoTabOpen,
  isInfoTabOpen,
  selectedUser,
  setSelectedUser,
  addGroupMember,
}: GroupMenuPropsType) {
  return (
    <>
      <div className="flex justify-between items-center h-14 min-h-[56px] px-6 text-sm font-bold text-neutral-900 border-b border-neutral-300 ">
        <h2>{group.name}</h2>

        <div className="flex gap-6">
          {!isInfoTabOpen && (
            <button
              title="Info"
              className="w-5 hover:text-primary-500"
              onClick={setInfoTabOpen}
            >
              <Info />
              <span className="sr-only">Info</span>
            </button>
          )}

          {user.isAdmin && (
            <button
              title="Delete"
              className="w-5 hover:text-primary-500"
              onClick={onGroupDelete}
            >
              <Trash />
              <span className="sr-only">Delete</span>
            </button>
          )}
        </div>
      </div>
      <div className="border-b border-neutral-300 flex gap-2 items-center py-4 px-6 h-20">
        <span className="text-sm font-bold whitespace-nowrap">Add User:</span>
        <UsersCombobox
          selectedValue={selectedUser}
          setSelectedValue={setSelectedUser}
        />
        <ButtonGhost className="flex items-center" onClick={addGroupMember}>
          <span className="uppercase">Add</span>
        </ButtonGhost>
      </div>
    </>
  );
}

export default GroupMenu;
