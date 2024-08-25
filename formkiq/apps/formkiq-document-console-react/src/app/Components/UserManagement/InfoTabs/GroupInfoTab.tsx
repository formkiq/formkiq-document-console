import { Link, useParams } from 'react-router-dom';
import { User } from '../../../helpers/types/userManagement';
import GroupMembers from '../../../Views/UserManagement/groupMembers';
import { ChevronRight, Close } from '../../Icons/icons';

type GroupInfoTabProps = {
  closeGroupInfoTab: () => void;
  groupName: string;
  user: any;
  group: any;
  users?: User[];
  groupsUsers: User[];
};

function GroupInfoTab({
  closeGroupInfoTab,
  groupName,
  user,
  group,
  users,
  groupsUsers,
}: GroupInfoTabProps) {
  const { groupName: name } = useParams();

  if (!group) return null;
  return (
    <div className="w-72 h-full bg-white border-l border-neutral-300 p-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">{groupName}</p>
        <button
          type="button"
          onClick={closeGroupInfoTab}
          className="h-6 w-6 text-neutral-500 hover:text-neutral-900"
          title="Close"
        >
          <Close />
        </button>
      </div>
      <p className="mt-4 text-xs font-extrabold uppercase mx-4">
        Group Members
      </p>
      <div className="flex gap-2 my-2 items-center mx-4">
        <GroupMembers group={group} groupUsers={groupsUsers} />
      </div>
      {user.isAdmin && !name && (
        <Link
          to={groupName}
          className="w-4/5 flex gap-1 items-center text-xs font-bold hover:text-primary-500 cursor-pointer mx-4"
        >
          <>
            <span className="pt-0.5">View / Manage User Access</span>
            <div className="w-3">
              <ChevronRight />
            </div>
          </>
        </Link>
      )}

      {group?.description && (
        <>
          <div className="border-b border-neutral-300 mt-4" />
          <p className="mt-4 text-xs font-extrabold mx-4">DESCRIPTION</p>
          <div className="border border-neutral-300 p-1 mt-2 rounded-md mx-4">
            <p className="text-sm">{group.description}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default GroupInfoTab;
