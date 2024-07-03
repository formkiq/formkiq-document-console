import {ILine} from "../../helpers/types/line";
import {Link} from 'react-router-dom';
import moment from "moment";
import {Group, User} from "../../helpers/types/userManagement";
import {Info} from "../../Components/Icons/icons";
import {useEffect, useState} from "react";
import {DocumentsService} from "../../helpers/services/documentsService";

type GroupsTableProps = {
  groups: Group[],
  selectedGroupNames: string[],
  onShareClick: (event: any, value: ILine | null) => void;
  onDeleteClick: (groupName: any) => void;
  onDuplicateClick: (groupName: any) => void;
  setSelectedGroupNames: (groupNames: string[]) => void;
  onGroupInfoClick: (groupName: string) => void;
}

function GroupsTable({
                       groups,
                       selectedGroupNames,
                       onShareClick,
                       onDeleteClick,
                       onDuplicateClick,
                       setSelectedGroupNames,
                       onGroupInfoClick
                     }: GroupsTableProps) {
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

  function formatDate(date: string) {
    return moment(date).format('MMM DD, YYYY');
  }


  const [groupsUsers, setGroupsUsers] = useState<any>({});

  async function getGroupUsers(groupName: string) {
    DocumentsService.getGroupUsers(groupName, 20).then((response) => {
      console.log(response.users, groupName);
      if (response.users && response.users.length > 0) {
        setGroupsUsers({...groupsUsers, [groupName]: response.users});
      }
    });
  }

  useEffect(() => {
    groups.forEach((group) => {
      getGroupUsers(group.name);
    });
  }, [groups]);

  useEffect(() => {
      console.log(groupsUsers);
  }, [groupsUsers]);

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
        <tr className="hover:bg-neutral-100 h-[76px] " key={"group" + index}>
          <td className="border-b border-neutral-300">
            <div className="flex items-center justify-center">
              <input id="checkbox-all" type="checkbox" checked={selectedGroupNames.includes(item.name)}
                     onChange={() => selectedGroupNames.includes(item.name) ? removeFromSelectedGroups(item.name) : addToSelectedGroups(item.name)}
                     className="rounded-none w-4 h-4 bg-transparent  border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"/>
              <label htmlFor="checkbox-all" className="sr-only">select group</label>
            </div>
          </td>

          <td className="border-b border-neutral-300">
            <Link to={`groups/${item.name}`}>
              <p className="truncate w-64"
                 style={{fontWeight: selectedGroupNames.includes(item.name) ? '700' : '400'}}>{item.name}</p>
            </Link>
          </td>

          <td className="border-b border-neutral-300">
            <p className="truncate w-64"
               style={{fontWeight: selectedGroupNames.includes(item.name) ? '700' : '400'}}>{item.description}</p>
          </td>

          <td className="border-b border-neutral-300">
            <div className="flex -space-x-2 overflow-hidden">
              {/*<div*/}
              {/*  className="h-8 w-8 rounded-full  bg-neutral-500 text-center text-white font-bold flex items-center justify-center">*/}
              {/*  AP*/}
              {/*</div>*/}
              {/*<div*/}
              {/*  className="h-8 w-8 rounded-full  bg-neutral-400 text-center text-white font-bold flex items-center justify-center">*/}
              {/*  RW*/}
              {/*</div>*/}
              {/*<div*/}
              {/*  className="h-8 w-8 rounded-full  bg-neutral-800 text-center text-white font-bold flex items-center justify-center">*/}
              {/*  MF*/}
              {/*</div>*/}
              {/*<div*/}
              {/*  className="h-8 w-8 rounded-full bg-neutral-300 text-center text-white font-bold flex items-center justify-center">*/}
              {/*  +3*/}
              {/*</div>*/}
              {groupsUsers[item.name] && groupsUsers[item.name].length > 0 && groupsUsers[item.name].map((user: User, i: number) => (
                <div key={"user" + item.name + i}
                     className="h-8 w-8 rounded-full bg-neutral-300 text-center text-white font-bold flex items-center justify-center">
                  {user.username[0]}
                </div>
              ))}

            </div>
          </td>


          <td className="border-b border-neutral-300">
            <div className="flex items-center justify-end px-6">
              <Link
                to={`#group=${item.name}`}
                className="w-5 pt-0.5 text-neutral-900 mr-1 cursor-pointer hover:text-primary-500"
                onClick={() => onGroupInfoClick(item.name)}
              >
                <Info/>
              </Link>
              {/*<CaseActionsPopover*/}
              {/*  value={{*/}
              {/*    lineType: 'case',*/}
              {/*    caseId: item.caseId,*/}
              {/*  }}*/}
              {/*  siteId={siteId}*/}
              {/*  onRenameClick={onRenameClick}*/}
              {/*  onAddDocumentClick={onAddDocumentClick}*/}
              {/*  onShareClick={onShareClick}*/}
              {/*  onDuplicateClick={onDuplicateClick}*/}
              {/*  onDeleteClick={onDeleteClick}*/}
              {/*/>*/}
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
