import { Trash } from '../../Icons/icons';
import SelectedUsersActionPopover from '../Popovers/SelectedUsersActionPopover';

type UsersMenuPropsType = {
  deleteUsers: () => void;
  disableUsers: () => void;
  enableUsers: () => void;
  resetPasswords: () => void;
  user: any;
};

function UsersMenu({
  deleteUsers,
  user,
  disableUsers,
  enableUsers,
  resetPasswords,
}: UsersMenuPropsType) {
  return (
    <div className="flex justify-between items-center h-14 min-h-[56px] px-6 text-sm font-bold text-neutral-900 border-b border-neutral-300 ">
      <h2>User List</h2>
      {user.isAdmin && (
        <div className="flex gap-6 items-center">
          <button
            title="Delete"
            className="w-5 hover:text-primary-500"
            onClick={deleteUsers}
          >
            <Trash />
            <span className="sr-only">Delete</span>
          </button>

          <div className="w-px h-6 bg-neutral-300"></div>
          <SelectedUsersActionPopover
            onDisableClick={disableUsers}
            onEnableClick={enableUsers}
            onResetPasswordClick={resetPasswords}
          />
        </div>
      )}
    </div>
  );
}

export default UsersMenu;
