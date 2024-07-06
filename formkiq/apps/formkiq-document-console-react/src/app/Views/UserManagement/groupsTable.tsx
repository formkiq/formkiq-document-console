import {Link} from 'react-router-dom';
import {Group} from "../../helpers/types/userManagement";
import {Info} from "../../Components/Icons/icons";
import {useEffect, useState} from "react";
import {DocumentsService} from "../../helpers/services/documentsService";
import GroupActionPopover from '../../Components/UserManagement/Popovers/GroupActionPopover';

type GroupsTableProps = {
  groups: Group[],
  user: any,
  selectedGroupNames: string[],
  onDeleteClick: (groupName: any) => void;
  setSelectedGroupNames: (groupNames: string[]) => void;
  onAddMembersClick: (groupName: string) => void;
}

function GroupsTable({
                       groups,
                       user,
                       selectedGroupNames,
                       onDeleteClick,
                       setSelectedGroupNames,
                       onAddMembersClick
                     }: GroupsTableProps) {
  const [groupsUsers, setGroupsUsers] = useState<any>({});
  function toggleSelectAll() {
    if (selectedGroupNames.length === groups.length) {
      unselectAllGroups()
    } else {
      selectAllGroups()
    }
  }

  // checkboxes functions
  function addToSelectedGroups(id: string) {
    setSelectedGroupNames([...selectedGroupNames, id]);
  }

  function removeFromSelectedGroups(groupName: string) {
    setSelectedGroupNames(selectedGroupNames.filter(name => name !== groupName));
  }

  function selectAllGroups() {
    setSelectedGroupNames(groups.map(item => item.name));
  }

  function unselectAllGroups() {
    setSelectedGroupNames([]);
  }

  async function getGroupUsers(groupName: string) {
    DocumentsService.getGroupUsers(groupName, 20).then((response) => {
      if (response.users && response.users.length > 0) {
        setGroupsUsers((val: any) => ({...val, [groupName]: response.users}));
      }
    });
  }

  useEffect(() => {
    groups.forEach((group) => {
      getGroupUsers(group.name);
    });
  }, [groups]);

  return (
    <table className='table-auto text-neutral-900 text-sm border-b border-neutral-300 w-full '
    >
      <thead className='bg-neutral-100 border-b border-neutral-300 text-start h-10 sticky top-0'>
      <tr>
        <th scope="col" className="px-6 w-6 border-b border-neutral-300 ">
          <div className="flex items-center">
            <input id="checkbox-all" type="checkbox" checked={selectedGroupNames.length === groups.length}
                   onChange={toggleSelectAll}
                   className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"/>
            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
          </div>
        </th>
        <th scope="col">
          <div
            className='text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600'>
            Name
          </div>
        </th>
        <th scope="col">
          <div
            className='text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600'>
            Description
          </div>
        </th>
        <th scope="col">
          <div
            className='text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600'>
            Members
          </div>
        </th>
        <th scope="col" className='px-6 w-6'></th>
      </tr>
      </thead>
      <tbody className='overflow-y-auto max-h-full h-full'>

      {groups.length > 0 ? groups.map((item: Group, index: number) => (
        <tr className="hover:bg-neutral-100  h-[76px] " key={"group" + index}>
          <td className="border-b border-neutral-300">
            <div className="flex items-center justify-center">
              <input id="checkbox-all" type="checkbox" checked={selectedGroupNames.includes(item.name)}
                     onChange={() => selectedGroupNames.includes(item.name) ? removeFromSelectedGroups(item.name) : addToSelectedGroups(item.name)}
                     className="rounded-none w-4 h-4 bg-transparent  border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"/>
              <label htmlFor="checkbox-all" className="sr-only">select group</label>
            </div>
          </td>

          <td className="border-b border-neutral-300">
            <Link to={item.name}>
              <p className="truncate w-64 hover:text-primary-500"
                 style={{fontWeight: selectedGroupNames.includes(item.name) ? '700' : '400'}}>{item.name}</p>
            </Link>
          </td>

          <td className="border-b border-neutral-300">
            <p className="truncate w-64"
               style={{fontWeight: selectedGroupNames.includes(item.name) ? '700' : '400'}}>{item.description}</p>
          </td>

          <td className="border-b border-neutral-300">
            <div className="flex -space-x-2 overflow-hidden">
              {groupsUsers[item.name] && groupsUsers[item.name].length > 0 && (
                <>
                  {groupsUsers[item.name][0] &&
                    <div key={"user" + item.name + 0}
                         className="h-8 w-8 rounded-full bg-neutral-500 text-center text-white font-bold flex items-center justify-center uppercase">
                      {groupsUsers[item.name][0].username[0]}
                    </div>
                  }
                  {groupsUsers[item.name][1] &&
                    <div key={"user" + item.name + 1}
                         className="h-8 w-8 rounded-full bg-neutral-400 text-center text-white font-bold flex items-center justify-center uppercase">
                      {groupsUsers[item.name][1].username[0]}
                    </div>
                  }
                  {groupsUsers[item.name][2] &&
                    <div key={"user" + item.name + 2}
                         className="h-8 w-8 rounded-full bg-neutral-800 text-center text-white font-bold flex items-center justify-center uppercase">
                      {groupsUsers[item.name][2].username[0]}
                    </div>
                  }
                  {groupsUsers[item.name].length > 3 && (
                    <div
                      className="h-8 w-8 rounded-full bg-neutral-300 text-center text-white font-bold flex items-center justify-center">
                      + {groupsUsers[item.name].length - 3}
                    </div>
                  )}
                </>
              )}
            </div>
          </td>

          <td className="border-b border-neutral-300">
            <div className="flex items-center justify-end px-6">
              <Link
                to={`?groupName=${item.name}`}
                className="w-5 pt-0.5 text-neutral-900 mr-1 cursor-pointer hover:text-primary-500"
              >
                <Info/>
              </Link>
              {user.isAdmin &&
                <GroupActionPopover
                  value={{
                    lineType: 'group',
                    groupName: item.name,
                  }}
                  onDeleteClick={onDeleteClick}
                  onAddMembersClick={onAddMembersClick}
                />}
            </div>
          </td>
        </tr>
      )) : <tr className="h-[76px]">
        <td colSpan={7} className='text-center'>No groups found</td>
      </tr>}
      </tbody>
    </table>
  );
}

export default GroupsTable;
