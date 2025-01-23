import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { RequestStatus } from '../../helpers/types/document';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  addUserToGroup,
  deleteGroup,
  deleteUserFromGroup,
  disableUser,
  enableUser,
  fetchGroupUsers,
  resetUserPassword,
  setGroupUsersLoadingStatusPending,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { useAppDispatch } from '../../Store/store';

import { useNavigate, useParams } from 'react-router-dom';
import GroupInfoTab from '../../Components/UserManagement/InfoTabs/GroupInfoTab';
import GroupMenu from '../../Components/UserManagement/Menus/GroupMenu';
import { DocumentsService } from '../../helpers/services/documentsService';
import { Group as GroupType, User } from '../../helpers/types/userManagement';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import GroupUsersTable from './groupUsersTable';

function Group() {
  const {
    groupUsers,
    nextGroupUsersToken,
    groupUsersLoadingStatus,
    isLastGroupUsersSearchPageLoaded,
    currentGroupUsersSearchPage,
  } = useSelector(UserManagementState);
  const { user } = useAuthenticatedState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { groupName } = useParams();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [isInfoTabOpen, setIsInfoTabOpen] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);

  function updateGroup() {
    if (!groupName) return;
    DocumentsService.getGroup(groupName).then((response) => {
      if (response.group) {
        setGroup(response.group);
      }
    });
  }

  function updateGroupUsers() {
    if (!groupName) return;
    dispatch(fetchGroupUsers({ groupName, page: 1 }));
  }

  useEffect(() => {
    updateGroup();
    updateGroupUsers();
  }, []);

  // load more users when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('groupUsersScrollPane');
    if (
      isBottom(scrollpane as HTMLElement) &&
      nextGroupUsersToken &&
      groupUsersLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setGroupUsersLoadingStatusPending());
      if (nextGroupUsersToken) {
        await dispatch(
          fetchGroupUsers({
            nextToken: nextGroupUsersToken,
            page: currentGroupUsersSearchPage + 1,
          })
        );
      }
    }
  }, [
    nextGroupUsersToken,
    groupUsersLoadingStatus,
    isLastGroupUsersSearchPageLoaded,
  ]);

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

  // delete group
  const onGroupDelete = () => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete ' + groupName + '?',
        callback: () => {
          dispatch(deleteGroup({ groupName }));
          navigate('/groups');
        },
      })
    );
  };

  // remove user from group
  const onGroupUserDelete = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to remove the user from the group?',
        callback: () => {
          dispatch(deleteUserFromGroup({ groupName, username }));
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onGroupUserDisable = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to disable the user?',
        callback: () => {
          dispatch(disableUser({ username }));
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onGroupUserEnable = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to enable the user?',
        callback: () => {
          dispatch(enableUser({ username }));
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onGroupUserResetPassword = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to reset the user password?',
        callback: () => {
          dispatch(resetUserPassword({ username }));
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onDeleteSelectedGroupUsers = () => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to remove ${selectedGroupUsers.length} selected users from the group?`,
        callback: () => {
          for (const username of selectedGroupUsers) {
            dispatch(deleteUserFromGroup({ groupName, username }));
          }
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onDisableSelectedGroupUsers = () => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to disable ${selectedGroupUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedGroupUsers) {
            dispatch(disableUser({ username }));
          }
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onEnableSelectedGroupUsers = () => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to enable ${selectedGroupUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedGroupUsers) {
            dispatch(enableUser({ username }));
          }
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  const onResetPasswordSelectedGroupUsers = () => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to reset the password for ${selectedGroupUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedGroupUsers) {
            dispatch(resetUserPassword({ username }));
          }
          setTimeout(updateGroupUsers, 500);
        },
      })
    );
  };

  function addGroupMember() {
    if (!selectedUser) return;
    if (!group) return;
    if (groupUsers.find((user) => user.username === selectedUser.username)) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'User already in group',
        })
      );
      return;
    }
    const userData = { user: { username: selectedUser.username } };
    dispatch(addUserToGroup({ groupName: group.name, user: userData }));
    setTimeout(updateGroupUsers, 500);
  }

  if (!group) return null;
  if (!groupName) return null;
  return (
    <>
      <Helmet>
        <title>Group Users</title>
      </Helmet>
      <div
        className="flex flex-row "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="flex-1 inline-block h-full">
          <div className=" flex flex-col w-full h-full">
            <GroupMenu
              onGroupDelete={onGroupDelete}
              user={user}
              group={group as GroupType}
              isInfoTabOpen={isInfoTabOpen}
              setInfoTabOpen={() => setIsInfoTabOpen(true)}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              addGroupMember={addGroupMember}
            />

            {/*<h2 className="px-6 pb-4 text-sm font-bold">{g}</h2>*/}
            <div className="relative overflow-hidden h-full">
              <div
                className="overflow-y-scroll overflow-x-auto h-full w-full"
                id="groupUsersScrollPane"
                onScroll={handleScroll}
              >
                <GroupUsersTable
                  user={user}
                  groupUsers={groupUsers}
                  selectedGroupUsers={selectedGroupUsers}
                  onDeleteClick={onGroupUserDelete}
                  onDisableClick={onGroupUserDisable}
                  onEnableClick={onGroupUserEnable}
                  onResetPasswordClick={onGroupUserResetPassword}
                  setSelectedGroupUsers={setSelectedGroupUsers}
                  onDeleteSelectedGroupUsers={onDeleteSelectedGroupUsers}
                  onDisableSelectedGroupUsers={onDisableSelectedGroupUsers}
                  onEnableSelectedGroupUsers={onEnableSelectedGroupUsers}
                  onResetPasswordSelectedGroupUsers={
                    onResetPasswordSelectedGroupUsers
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {isInfoTabOpen && (
          <GroupInfoTab
            closeGroupInfoTab={() => setIsInfoTabOpen(false)}
            groupName={groupName}
            user={user}
            group={group}
            users={groupUsers}
            groupsUsers={groupUsers}
          />
        )}
      </div>
    </>
  );
}

export default Group;
