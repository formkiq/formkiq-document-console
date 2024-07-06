import {Info, Plus, Trash} from "../../Icons/icons";
import {Group, User} from "../../../helpers/types/userManagement";
import UsersCombobox from "../../Generic/Listboxes/UsersCombobox";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";

type GroupMenuPropsType = {
  onGroupDelete: () => void;
  setInfoTabOpen: () => void;
  group: Group;
  user: any,
  isInfoTabOpen: boolean;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  addGroupMember: () => void;
}

function GroupMenu({
                     onGroupDelete,
                     user,
                     group,
                     setInfoTabOpen,
                     isInfoTabOpen,
                     selectedUser,
                     setSelectedUser,
                     addGroupMember
                   }: GroupMenuPropsType) {
  return (
    <>
      <div
        className="flex justify-between items-center h-14 min-h-[56px] px-6 text-sm font-bold text-neutral-900 border-b border-neutral-300 ">
        <h2>{group.name}</h2>

        <div className="flex gap-6">
          {!isInfoTabOpen && <button title="Info" className="w-5 hover:text-primary-500" onClick={setInfoTabOpen}>
            <Info/>
            <span className="sr-only">Info</span>
          </button>}

          {user.isAdmin &&
            <button title="Delete" className="w-5 hover:text-primary-500" onClick={onGroupDelete}>
              <Trash/>
              <span className="sr-only">Delete</span>
            </button>}
        </div>
      </div>
      <div className="border-b border-neutral-300 flex gap-2 items-center py-4 px-6 h-20">
        <UsersCombobox selectedValue={selectedUser} setSelectedValue={setSelectedUser}/>
        <ButtonGhost className="flex items-center" onClick={addGroupMember}>
          <div className="w-4 h-4 p-0.5 border-2 border-neutral-900 rounded-full mr-2 text-neutral-900"><Plus/></div>
          INVITE NEW USER</ButtonGhost>
      </div>
    </>
  );
}

export default GroupMenu;
