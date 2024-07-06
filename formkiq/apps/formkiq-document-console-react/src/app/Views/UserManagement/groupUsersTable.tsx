import {Link} from 'react-router-dom';
import {User} from "../../helpers/types/userManagement";
import {Info} from "../../Components/Icons/icons";
import {useEffect, useState} from "react";
import {DocumentsService} from "../../helpers/services/documentsService";
import GroupActionPopover from '../../Components/UserManagement/Popovers/GroupActionPopover';

type GroupsUsersTableProps = {
  user: any,
  groupUsers: User[]
  selectedGroupUsers: string[],
  onDeleteClick: (username: any) => void;
  onDisableClick: (username: any) => void;
  setSelectedGroupUsers: (usernames: string[]) => void;
}

function GroupUsersTable({
                           user,
                           groupUsers,
                           selectedGroupUsers,
                           onDeleteClick,
                           onDisableClick,
                           setSelectedGroupUsers,
                         }: GroupsUsersTableProps) {

  function toggleSelectAll() {
    if (selectedGroupUsers.length === groupUsers.length) {
      unselectAllGroupUsers()
    } else {
      selectAllGroupUsers()
    }
  }

  // checkboxes functions
  function addToSelectedGroupUsers(username: string) {
    setSelectedGroupUsers([...selectedGroupUsers, username]);
  }

  function removeFromSelectedGroupUsers(username: string) {
    setSelectedGroupUsers(selectedGroupUsers.filter(name => name !== username));
  }

  function selectAllGroupUsers() {
    setSelectedGroupUsers(groupUsers.map(item => item.username));
  }

  function unselectAllGroupUsers() {
    setSelectedGroupUsers([]);
  }

  useEffect(() => {
    console.log(groupUsers, 'groupUsers')
  }, [groupUsers]);

  return (
    <table className='table-auto text-neutral-900 text-sm border-b border-neutral-300 w-full '
    >
      <thead className='bg-neutral-100 border-b border-neutral-300 text-start h-10 sticky top-0'>
      <tr>
        <th scope="col" className="px-6 w-6 border-b border-neutral-300 ">
          <div className="flex items-center">
            <input id="checkbox-all" type="checkbox" checked={selectedGroupUsers.length === groupUsers.length}
                   onChange={toggleSelectAll}
                   className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"/>
            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
          </div>
        </th>
        <th scope="col">
          <div
            className='text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600'>
            Email
          </div>
        </th>
        <th scope="col">
          <div
            className='text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600'>
            Username
          </div>
        </th>
        <th scope="col" className='px-6 w-6'></th>
      </tr>
      </thead>
      <tbody className='overflow-y-auto max-h-full h-full'>

      {groupUsers.length > 0 ? groupUsers.map((item: User, index: number) => (
        <tr className="hover:bg-neutral-100  h-[76px] " key={"group" + index}>
          <td className="border-b border-neutral-300">
            <div className="flex items-center justify-center">
              <input id="checkbox-all" type="checkbox" checked={selectedGroupUsers.includes(item.username)}
                     onChange={() => selectedGroupUsers.includes(item.username) ? removeFromSelectedGroupUsers(item.username) : addToSelectedGroupUsers(item.username)}
                     className="rounded-none w-4 h-4 bg-transparent  border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"/>
              <label htmlFor="checkbox-all" className="sr-only">select user</label>
            </div>
          </td>
          <td className="border-b border-neutral-300">
            <p className="truncate w-64 font-bold"
               style={{fontWeight: selectedGroupUsers.includes(item.username) ? '700' : '400'}}>{item.email}</p>
          </td>

          <td className="border-b border-neutral-300">
            <p className="truncate w-64"
               style={{fontWeight: selectedGroupUsers.includes(item.username) ? '700' : '400'}}>{item.username}</p>
          </td>
          <td className="border-b border-neutral-300">
            {user.isAdmin &&
              <GroupActionPopover
                value={{
                  lineType: 'group',
                  username: item.username,
                }}
                onDeleteClick={onDeleteClick}
                onDisableClick={onDisableClick}
              />}
          </td>
        </tr>
      )) : <tr className="h-[76px]">
        <td colSpan={7} className='text-center'>No groups found</td>
      </tr>}
      </tbody>
    </table>
  );
}

export default GroupUsersTable;
