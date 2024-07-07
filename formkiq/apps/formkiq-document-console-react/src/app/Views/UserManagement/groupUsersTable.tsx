import { User } from '../../helpers/types/userManagement';
import GroupUserActionPopover from '../../Components/UserManagement/Popovers/GroupUserActionPopover';
import {
  Close,
  Disable,
  Enable,
  ResetPassword,
} from '../../Components/Icons/icons';

type GroupsUsersTableProps = {
  user: any;
  groupUsers: User[];
  selectedGroupUsers: string[];
  onDeleteClick: (username: any) => void;
  onDisableClick: (username: any) => void;
  onEnableClick: (username: any) => void;
  setSelectedGroupUsers: (usernames: string[]) => void;
  onResetPasswordClick: (username: any) => void;
  onDeleteSelectedGroupUsers: () => void;
  onDisableSelectedGroupUsers: () => void;
  onEnableSelectedGroupUsers: () => void;
  onResetPasswordSelectedGroupUsers: () => void;
};

function GroupUsersTable({
  user,
  groupUsers,
  selectedGroupUsers,
  onDeleteClick,
  onDisableClick,
  onEnableClick,
  setSelectedGroupUsers,
  onResetPasswordClick,
  onDeleteSelectedGroupUsers,
  onDisableSelectedGroupUsers,
  onEnableSelectedGroupUsers,
  onResetPasswordSelectedGroupUsers,
}: GroupsUsersTableProps) {
  function toggleSelectAll() {
    if (selectedGroupUsers.length === groupUsers.length) {
      unselectAllGroupUsers();
    } else {
      selectAllGroupUsers();
    }
  }

  // checkboxes functions
  function addToSelectedGroupUsers(username: string) {
    setSelectedGroupUsers([...selectedGroupUsers, username]);
  }

  function removeFromSelectedGroupUsers(username: string) {
    setSelectedGroupUsers(
      selectedGroupUsers.filter((name) => name !== username)
    );
  }

  function selectAllGroupUsers() {
    setSelectedGroupUsers(groupUsers.map((item) => item.username));
  }

  function unselectAllGroupUsers() {
    setSelectedGroupUsers([]);
  }

  return (
    <table className="table-auto text-neutral-900 text-sm border-b border-neutral-300 w-full ">
      <thead className="bg-neutral-100 border-b border-neutral-300 text-start h-10 sticky top-0">
        {selectedGroupUsers.length === 0 || !user.isAdmin ? (
          <tr>
            <th scope="col" className="px-6 w-6 border-b border-neutral-300 ">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  checked={selectedGroupUsers.length === groupUsers.length}
                  onChange={toggleSelectAll}
                  className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="w-64">
              <div className="text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Email
              </div>
            </th>
            <th scope="col">
              <div className="text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Username
              </div>
            </th>
            <th scope="col" className="px-6 w-6"></th>
          </tr>
        ) : (
          <tr>
            <th scope="col" className="px-6 w-6 border-b border-neutral-300 ">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  checked={selectedGroupUsers.length === groupUsers.length}
                  onChange={toggleSelectAll}
                  className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="w-64">
              <div className="text-start">
                Selected {selectedGroupUsers.length}
              </div>
            </th>

            <th scope="col" colSpan={2} className="text-end">
              <div className="flex justify-end gap-8 px-6">
                <button
                  onClick={onResetPasswordSelectedGroupUsers}
                  className="flex gap-2 items-center text-neutral-900 hover:text-primary-500"
                >
                  <div className="w-6 h-6">
                    <ResetPassword />
                  </div>
                  Reset Password
                </button>
                <button
                  onClick={onDisableSelectedGroupUsers}
                  className="flex gap-2 items-center text-neutral-900 hover:text-primary-500"
                >
                  <div className="w-6 h-6">
                    <Disable />
                  </div>
                  Disable
                </button>
                <button
                  onClick={onEnableSelectedGroupUsers}
                  className="flex gap-2 items-center text-neutral-900 hover:text-primary-500"
                >
                  <div className="w-5 h-5">
                    <Enable />
                  </div>
                  Enable
                </button>
                <button
                  onClick={onDeleteSelectedGroupUsers}
                  className="flex gap-2 items-center text-neutral-900 hover:text-primary-500"
                >
                  <div className="w-5 h-5">
                    <Close />
                  </div>
                  Remove
                </button>
              </div>
            </th>
          </tr>
        )}
      </thead>
      <tbody className="overflow-y-auto max-h-full h-full">
        {groupUsers.length > 0 ? (
          groupUsers.map((item: User, index: number) => (
            <tr
              className="hover:bg-neutral-100  h-[76px] "
              key={'group' + index}
            >
              <td className="border-b border-neutral-300">
                <div className="flex items-center justify-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    checked={selectedGroupUsers.includes(item.username)}
                    onChange={() =>
                      selectedGroupUsers.includes(item.username)
                        ? removeFromSelectedGroupUsers(item.username)
                        : addToSelectedGroupUsers(item.username)
                    }
                    className="rounded-none w-4 h-4 bg-transparent  border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    select user
                  </label>
                </div>
              </td>
              <td className="border-b border-neutral-300">
                <p className="truncate w-64 font-bold">{item.email}</p>
              </td>

              <td className="border-b border-neutral-300">
                <p
                  className="truncate w-72"
                  style={{
                    fontWeight: selectedGroupUsers.includes(item.username)
                      ? '700'
                      : '400',
                  }}
                >
                  {item.username}
                </p>
              </td>
              <td className="border-b border-neutral-300 w-6 px-6">
                {user.isAdmin && (
                  <GroupUserActionPopover
                    value={{
                      lineType: 'user',
                      username: item.username,
                    }}
                    onDeleteClick={onDeleteClick}
                    onDisableClick={onDisableClick}
                    onEnableClick={onEnableClick}
                    onResetPasswordClick={onResetPasswordClick}
                    user={item}
                  />
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr className="h-[76px]">
            <td colSpan={7} className="text-center">
              No group users found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default GroupUsersTable;
