import {ChevronRight, Close} from "../../Icons/icons";
import {useEffect, useState} from "react";
import {DocumentsService} from "../../../helpers/services/documentsService";

type GroupInfoTabProps = {
  closeGroupInfoTab: () => void;
  groupName: string;
  onManageMembersClick: (groupName: string) => void;
  user: any;
}

function GroupInfoTab({closeGroupInfoTab, groupName, onManageMembersClick, user}: GroupInfoTabProps) {
  const [groupsUsers, setGroupsUsers] = useState<any[]>([]);
  useEffect(() => {
    DocumentsService.getGroupUsers(groupName, 20).then((response) => {
      if (response.users) {
        setGroupsUsers(response.users);
      }
    });
  }, [groupName]);
  return (
    <div className="w-72 h-full bg-white border-l border-neutral-100 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">{groupName}</p>
        <button type="button" onClick={closeGroupInfoTab} className="h-6 w-6 text-neutral-500 hover:text-neutral-900"
                title="Close"
        >
          <Close/>
        </button>
      </div>
      <p className="mt-4 text-xs font-extrabold">GROUP MEMBERS</p>
      <div className="flex gap-2 my-2 items-center">
        {groupsUsers[0] &&
          <div key={"info" + groupName + 0}
               className="h-8 w-8 rounded-full bg-neutral-500 text-center text-white font-bold flex items-center justify-center">
            {groupsUsers[0].username[0]}
          </div>
        }
        {groupsUsers[1] &&
          <div key={"info" + groupName + 1}
               className="h-8 w-8 rounded-full bg-neutral-400 text-center text-white font-bold flex items-center justify-center">
            {groupsUsers[1].username[0]}
          </div>
        }
        {groupsUsers[2] &&
          <div key={"info" + groupName + 2}
               className="h-8 w-8 rounded-full bg-neutral-800 text-center text-white font-bold flex items-center justify-center">
            {groupsUsers[2].username[0]}
          </div>
        }
        {groupsUsers.length > 3 && (
          <div
            className="text-center font-bold text-sm">
            + Over {groupsUsers.length - 3} users
          </div>
        )}
        {groupsUsers.length === 0 && (
          <div
            className="text-center font-bold text-sm">
            No users in a group
          </div>
        )}

      </div>
      {user.isAdmin &&
        <div
          className="w-3/5 flex gap-1 items-center text-xs font-bold hover:text-primary-500 cursor-pointer"
          onClick={(event) => {
            onManageMembersClick(groupName)
          }}>
          <>
            <span className="pt-0.5">
            Access settings
            </span>
            <div className="w-3">
              <ChevronRight/>
            </div>
          </>
        </div>}

    </div>
  );
}

export default GroupInfoTab
;
