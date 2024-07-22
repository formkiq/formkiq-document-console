import {Group, User} from '../../helpers/types/userManagement';
import {useEffect, useState} from 'react';
import UserActionPopover from '../../Components/UserManagement/Popovers/UserActionPopover';
import {DocumentsService} from '../../helpers/services/documentsService';
import {Link} from 'react-router-dom';

type UsersTableProps = {
  user: any;
  users: User[];
  selectedUsers: string[];
  onDeleteClick: (username: any) => void;
  onDisableClick: (username: any) => void;
  onEnableClick: (username: any) => void;
  setSelectedUsers: (usernames: string[]) => void;
  onResetPasswordClick: (username: any) => void;
  onManageGroupsClick: (username: any) => void;
};

function UsersTable({
                      user,
                      users,
                      selectedUsers,
                      onDeleteClick,
                      onDisableClick,
                      onEnableClick,
                      setSelectedUsers,
                      onResetPasswordClick,
                      onManageGroupsClick,
                    }: UsersTableProps) {
  const [userGroups, setUserGroups] = useState<any>({});

  function toggleSelectAll() {
    if (selectedUsers.length === users.length) {
      unselectAllUsers();
    } else {
      selectAllUsers();
    }
  }

  // checkboxes functions
  function addToSelectedUsers(username: string) {
    setSelectedUsers([...selectedUsers, username]);
  }

  function removeFromSelectedUsers(username: string) {
    setSelectedUsers(selectedUsers.filter((name) => name !== username));
  }

  function selectAllUsers() {
    setSelectedUsers(users.map((item) => item.username));
  }

  function unselectAllUsers() {
    setSelectedUsers([]);
  }

  async function getUserGroups(username: string) {
    DocumentsService.getUserGroups(username).then((response) => {
      if (response.groups && response.groups.length > 0) {
        setUserGroups((val: any) => ({...val, [username]: response.groups}));
      }
    });
  }

  useEffect(() => {
    users.forEach((user) => {
      getUserGroups(user.username);
    });
  }, [users]);

  return (
    <table className="table-auto text-neutral-900 text-sm border-b border-neutral-300 w-full ">
      <thead className="bg-neutral-100 border-b border-neutral-300 text-start h-10 sticky top-0">
      <tr>
        <th scope="col" className="px-6 w-6 border-b border-neutral-300 ">
          <div className="flex items-center">
            <input
              id="checkbox-all"
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={toggleSelectAll}
              className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
            />
            <label htmlFor="checkbox-all" className="sr-only">
              checkbox
            </label>
          </div>
        </th>
        <th scope="col" className="w-64">
          <div
            className="text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Email
          </div>
        </th>
        <th scope="col">
          <div
            className="text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Username
          </div>
        </th>
        <th scope="col">
          <div
            className="text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Groups
          </div>
        </th>
        <th scope="col" className="px-6 w-6"></th>
      </tr>
      </thead>
      <tbody className="overflow-y-auto max-h-full h-full">
      {users.length > 0 ? (
        users.map((item: User, index: number) => (
          <tr
            className="hover:bg-neutral-100  h-[76px] "
            key={'group' + index}
          >
            <td className="border-b border-neutral-300">
              <div className="flex items-center justify-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  checked={selectedUsers.includes(item.username)}
                  onChange={() =>
                    selectedUsers.includes(item.username)
                      ? removeFromSelectedUsers(item.username)
                      : addToSelectedUsers(item.username)
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
                  fontWeight: selectedUsers.includes(item.username)
                    ? '700'
                    : '400',
                }}
              >
                {item.username}
              </p>
            </td>
            <td className="border-b border-neutral-300">
              <p
                className="truncate w-72"
                style={{
                  fontWeight: selectedUsers.includes(item.username)
                    ? '700'
                    : '400',
                }}
              >
                {userGroups[item.username] &&
                  userGroups[item.username].map(
                    (group: Group, index: number) => (
                      <span key={"group_" + group.name + item.username}>
                          <Link
                            key={group.name + item.username}
                            to={`/groups/${group.name}`}
                            className="hover:text-primary-500 underline "
                          >
                            {group.name}
                          </Link>
                        {index < userGroups[item.username].length - 1 && ', '}
                        </span>
                    )
                  )}
              </p>
            </td>

            <td className="border-b border-neutral-300 w-6 px-6">
              {user.isAdmin && (
                <UserActionPopover
                  value={{
                    lineType: 'user',
                    username: item.username,
                  }}
                  onDeleteClick={onDeleteClick}
                  onDisableClick={onDisableClick}
                  onEnableClick={onEnableClick}
                  onResetPasswordClick={onResetPasswordClick}
                  onManageGroupsClick={onManageGroupsClick}
                  user={item}
                />
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr className="h-[76px]">
          <td colSpan={7} className="text-center">
            No users found
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

export default UsersTable;
