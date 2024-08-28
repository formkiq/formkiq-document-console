import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Plus } from '../../Components/Icons/icons';
import GroupInfoTab from '../../Components/UserManagement/InfoTabs/GroupInfoTab';
import GroupsMenu from '../../Components/UserManagement/Menus/GroupsMenu';
import AddGroupMembersModal from '../../Components/UserManagement/Modals/AddGroupMembersModal';
import CreateGroupModal from '../../Components/UserManagement/Modals/CreateGroupModal';
import { DocumentsService } from '../../helpers/services/documentsService';
import { RequestStatus } from '../../helpers/types/document';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  deleteGroup,
  fetchGroups,
  setGroupsLoadingStatusPending,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { useAppDispatch } from '../../Store/store';
import GroupsTable from './groupsTable';

function Groups() {
  const {
    groups,
    nextGroupsToken,
    groupsLoadingStatus,
    isLastGroupsSearchPageLoaded,
    currentGroupsSearchPage,
  } = useSelector(UserManagementState);
  const { user } = useAuthenticatedState();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const search = useLocation().search;
  const groupName = new URLSearchParams(search).get('groupName');
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddGroupMembersModalOpen, setIsAddGroupMembersModalOpen] =
    useState(false);
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [groupsUsers, setGroupsUsers] = useState<any>({});

  async function getGroupUsers(groupName: string) {
    DocumentsService.getGroupUsers(groupName, 20).then((response) => {
      if (response.users && response.users.length > 0) {
        setGroupsUsers((val: any) => ({
          ...val,
          [groupName]: response.users.sort((a: any, b: any) =>
            a.email > b.email ? 1 : -1
          ),
        }));
      }
    });
  }

  useEffect(() => {
    groups.forEach((group) => {
      getGroupUsers(group.name);
    });
  }, [groups]);

  useEffect(() => {
    dispatch(fetchGroups({}));
  }, []);

  // load more groups when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('groupsScrollPane');
    if (
      isBottom(scrollpane as HTMLElement) &&
      nextGroupsToken &&
      groupsLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setGroupsLoadingStatusPending());
      if (nextGroupsToken) {
        await dispatch(
          fetchGroups({
            nextToken: nextGroupsToken,
            page: currentGroupsSearchPage + 1,
          })
        );
      }
    }
  }, [nextGroupsToken, groupsLoadingStatus, isLastGroupsSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // delete selected groups
  const onGroupsDelete = () => {
    if (selectedGroupNames.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select at least one group',
        })
      );
    }

    const deleteGroups = () => {
      for (const groupName of selectedGroupNames) {
        dispatch(deleteGroup({ groupName }));
      }
    };

    if (selectedGroupNames.length > 0) {
      dispatch(
        openConfirmationDialog({
          dialogTitle:
            'Are you sure you want to delete ' +
            selectedGroupNames.length +
            ' selected groups?',
          callback: deleteGroups,
        })
      );
    }
  };

  // delete one group
  const onGroupDelete = (groupName: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete ' + groupName + '?',
        callback: () => {
          dispatch(deleteGroup({ groups, groupName }));
        },
      })
    );
  };

  const closeGroupInfoTab = () => {
    searchParams.delete('groupName');
    setSearchParams(searchParams);
  };

  const onAddMembersClick = (groupName: string) => {
    setSelectedGroupName(groupName);
    setIsAddGroupMembersModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Groups</title>
      </Helmet>
      <div
        className="flex flex-row "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="flex-1 inline-block h-full">
          <div className=" flex flex-col w-full h-full">
            <GroupsMenu deleteGroups={onGroupsDelete} user={user} />
            <div className="w-full py-4 px-6">
              <button
                type="button"
                className="p-6 border border-neutral-300 rounded-md flex items-center gap-4 justify-center hover:bg-neutral-100 font-bold text-sm"
                onClick={() => setIsCreateGroupModalOpen(true)}
              >
                <div className="w-6 h-6 p-1 flex items-center justify-center border border-2 border-neutral-900 rounded-full">
                  <Plus />
                </div>
                Create New Group
              </button>
            </div>
            <h2 className="px-6 pb-4 text-sm font-bold">Your Groups</h2>
            <div className="relative overflow-hidden h-full">
              <div
                className="overflow-y-scroll overflow-x-auto h-full w-full"
                id="groupsScrollPane"
                onScroll={handleScroll}
              >
                <GroupsTable
                  groups={groups}
                  user={user}
                  groupsUsers={groupsUsers}
                  selectedGroupNames={selectedGroupNames}
                  onDeleteClick={onGroupDelete}
                  setSelectedGroupNames={setSelectedGroupNames}
                  onAddMembersClick={onAddMembersClick}
                />
              </div>
            </div>
          </div>
        </div>
        {groupName && (
          <GroupInfoTab
            closeGroupInfoTab={closeGroupInfoTab}
            groupName={groupName}
            user={user}
            group={groups.find((group) => group.name === groupName)}
            groupsUsers={groupsUsers[groupName]}
          />
        )}
      </div>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        setIsOpen={setIsCreateGroupModalOpen}
      />
      <AddGroupMembersModal
        isOpen={isAddGroupMembersModalOpen}
        setIsOpen={setIsAddGroupMembersModalOpen}
        groupName={selectedGroupName}
        getGroupUsers={getGroupUsers}
      />
    </>
  );
}

export default Groups;
