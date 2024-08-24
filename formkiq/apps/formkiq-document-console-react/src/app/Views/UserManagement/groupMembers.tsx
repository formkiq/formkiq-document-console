import { Tooltip } from 'react-tooltip';
import { parseEmailInitials } from '../../helpers/services/toolService';
import { Group } from '../../helpers/types/userManagement';

type GroupMembersProps = {
  group: Group;
  groupUsers: any[];
};

function GroupMembers({ group, groupUsers }: GroupMembersProps) {
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {groupUsers && groupUsers.length > 0 && (
        <>
          {groupUsers.slice(0, 5).map((user, index) => (
            <div
              key={`user-${group.name}-${index}`}
              className={`h-8 w-8 rounded-full text-center text-white font-bold flex items-center justify-center uppercase ${getBackgroundColor(
                index
              )}`}
              data-tooltip-id={`groupUserTooltip-user-${group.name}-${index}`}
              data-tooltip-content={user.email}
            >
              {parseEmailInitials(user.email)}
              <Tooltip id={`groupUserTooltip-user-${group.name}-${index}`} />
            </div>
          ))}
          {groupUsers.length > 5 && (
            <div
              className="h-8 w-8 rounded-full bg-neutral-500 italic text-center text-white font-bold flex items-center justify-center"
              data-tooltip-id={`groupUserTooltip-user-${group.name}-more`}
              data-tooltip-content={`${groupUsers.length - 5} additional users`}
            >
              + {groupUsers.length - 5}
              <Tooltip id={`groupUserTooltip-user-${group.name}-more`} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function getBackgroundColor(index: number): string {
  const colors = [
    'bg-cornflower-blue-500',
    'bg-mountain-meadow-500',
    'bg-flamingo-500',
    'bg-turbo-600',
    'bg-ochre-500',
  ];
  return colors[index % colors.length];
}
export default GroupMembers;
