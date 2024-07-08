import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { RequestStatus } from '../../helpers/types/document';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../Store/store';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  deleteUser,
  disableUser,
  enableUser,
  fetchUsers,
  resetUserPassword,
  setUsersLoadingStatusPending,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import UsersMenu from '../../Components/UserManagement/Menus/UsersMenu';
import UsersTable from './usersTable';
import {Plus} from "../../Components/Icons/icons";
import CreateUserModal from "../../Components/UserManagement/Modals/CreateUserModal";

function Users() {
  const {
    users,
    nextUsersToken,
    usersLoadingStatus,
    isLastUsersSearchPageLoaded,
    currentUsersSearchPage,
  } = useSelector(UserManagementState);
  const { user } = useAuthenticatedState();
  const dispatch = useAppDispatch();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  function updateUsers() {
    dispatch(fetchUsers({ page: 1 }));
  }

  useEffect(() => {
    updateUsers();
  }, []);

  // load more users when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('usersScrollPane');
    if (
      isBottom(scrollpane as HTMLElement) &&
      nextUsersToken &&
      usersLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setUsersLoadingStatusPending());
      if (nextUsersToken) {
        await dispatch(
          fetchUsers({
            nextToken: nextUsersToken,
            page: currentUsersSearchPage + 1,
          })
        );
      }
    }
  }, [nextUsersToken, usersLoadingStatus, isLastUsersSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  const onDeleteUsers = () => {
    if (selectedUsers.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select at least one user',
        })
      );
      return;
    }
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to delete ${selectedUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedUsers) {
            dispatch(deleteUser({ username }));
          }
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onUserDelete = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete the user?',
        callback: () => {
          dispatch(deleteUser({ username: username as string }));
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onUserDisable = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to disable the user?',
        callback: () => {
          dispatch(disableUser({ username }));
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onUserEnable = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to enable the user?',
        callback: () => {
          dispatch(enableUser({ username }));
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onUserResetPassword = (username: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to reset the user password?',
        callback: () => {
          dispatch(resetUserPassword({ username }));
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onDisableSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select at least one user',
        })
      );
      return;
    }
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to disable ${selectedUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedUsers) {
            dispatch(disableUser({ username }));
          }
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onEnableSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select at least one user',
        })
      );
      return;
    }
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to enable ${selectedUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedUsers) {
            dispatch(enableUser({ username }));
          }
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  const onResetPasswordSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select at least one user',
        })
      );
      return;
    }
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to reset the password for ${selectedUsers.length} selected users?`,
        callback: () => {
          for (const username of selectedUsers) {
            dispatch(resetUserPassword({ username }));
          }
          setTimeout(updateUsers, 500);
        },
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <div
        className="flex flex-row "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="flex-1 inline-block h-full">
          <div className=" flex flex-col w-full h-full">
            <UsersMenu
              user={user}
              deleteUsers={onDeleteUsers}
              disableUsers={onDisableSelectedUsers}
              enableUsers={onEnableSelectedUsers}
              resetPasswords={onResetPasswordSelectedUsers}
            />
            <div className="w-full py-4 px-6">
              <button type="button"
                      className="p-6 border border-neutral-300 rounded-md flex items-center gap-4 justify-center hover:bg-neutral-100 font-bold text-sm"
                      onClick={() => setIsCreateUserModalOpen(true)}>
                <div
                  className="w-6 h-6 p-1 flex items-center justify-center border border-2 border-neutral-900 rounded-full">
                  <Plus/>
                </div>
                Add New User
              </button>
            </div>
            <div className="relative overflow-hidden h-full">
              <div
                className="overflow-y-scroll overflow-x-auto h-full w-full"
                id="usersScrollPane"
                onScroll={handleScroll}
              >
                <UsersTable
                  user={user}
                  users={users}
                  selectedUsers={selectedUsers}
                  onDeleteClick={onUserDelete}
                  onDisableClick={onUserDisable}
                  onEnableClick={onUserEnable}
                  onResetPasswordClick={onUserResetPassword}
                  setSelectedUsers={setSelectedUsers}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        setIsOpen={setIsCreateUserModalOpen}
      />
    </>
  );
}

export default Users;
