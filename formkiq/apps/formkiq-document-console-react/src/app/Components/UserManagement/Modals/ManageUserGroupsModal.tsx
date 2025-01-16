import { Dialog } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../Store/store';
import {
  addUserToGroup,
  deleteUserFromGroup,
  fetchGroups,
  setGroupsLoadingStatusPending,
  UserManagementState,
} from '../../../Store/reducers/userManagement';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import { useSelector } from 'react-redux';
import { RequestStatus } from '../../../helpers/types/document';
import { Group } from '../../../helpers/types/userManagement';
import { Link } from 'react-router-dom';
import { DocumentsService } from '../../../helpers/services/documentsService';
import ButtonTertiary from '../../Generic/Buttons/ButtonTertiary';
import { openDialog as openConfirmationDialog } from '../../../Store/reducers/globalConfirmControls';

type ManageUserGroupsModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  userId: string;
  onUserGroupsUpdated: () => void;
};

function ManageUserGroupsModal({
  isOpen,
  setIsOpen,
  userId,
  onUserGroupsUpdated,
}: ManageUserGroupsModalPropsType) {
  const dispatch = useAppDispatch();
  const {
    groups,
    nextGroupsToken,
    groupsLoadingStatus,
    isLastGroupsSearchPageLoaded,
    currentGroupsSearchPage,
  } = useSelector(UserManagementState);

  const [userGroupsNames, setUserGroupNames] = useState<string[]>([]);
  useEffect(() => {
    dispatch(fetchGroups({}));
  }, []);

  async function getUserGroups() {
    DocumentsService.getUserGroups(userId).then((response) => {
      if (response.groups && response.groups.length > 0) {
        const groupNames = response.groups.map((group: Group) => group.name);
        setUserGroupNames(groupNames);
      }
    });
  }

  useEffect(() => {
    getUserGroups();
  }, [groups, userId]);

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

  const closeModal = () => {
    setIsOpen(false);
  };

  const addToGroup = (groupName: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to add this user to the ${groupName} group?`,
        callback: async () => {
          const userData = { user: { username: userId } };
          await dispatch(
            addUserToGroup({
              user: userData,
              groupName,
            })
          );
          getUserGroups();
          onUserGroupsUpdated();
        },
      })
    );
  };

  const removeFromGroup = (groupName: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: `Are you sure you want to remove this user from the ${groupName} group?`,
        callback: async () => {
          await dispatch(
            deleteUserFromGroup({
              username: userId,
              groupName,
            })
          );
          getUserGroups();
          onUserGroupsUpdated();
        },
      })
    );
  };

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => null}
          className="relative text-neutral-900"
          static
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-6">
              <Dialog.Title className="text-2xl font-bold">
                Manage User Groups
              </Dialog.Title>
              <div
                className="overflow-y-scroll overflow-x-auto h-full w-full my-4 max-h-[400px] border border-neutral-300"
                id="groupsScrollPane"
                onScroll={handleScroll}
              >
                <table className="table-auto text-neutral-900 text-sm w-full ">
                  <thead className="bg-neutral-100 border-b border-neutral-300 text-start h-10 sticky top-0">
                    <tr>
                      <th scope="col">
                        <div className="px-2 text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                          Name
                        </div>
                      </th>
                      <th scope="col">
                        <div className="px-2 text-start text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                          Description
                        </div>
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto max-h-full h-full">
                    {groups.length > 0 ? (
                      groups.map((item: Group, index: number) => (
                        <tr key={'group' + index}>
                          <td className="px-2 py-2 border-b border-neutral-300">
                            <Link
                              to={'/admin/groups/' + item.name}
                              title={item.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="truncate w-32 hover:text-primary-500">
                                {item.name}
                              </p>
                            </Link>
                          </td>

                          <td className="px-2 border-b border-neutral-300">
                            <p className="">{item.description}</p>
                          </td>
                          <td className="px-2 border-b border-neutral-300">
                            {userGroupsNames.includes(item.name) ? (
                              <ButtonTertiary
                                type="button"
                                onClick={() => removeFromGroup(item.name)}
                                className="w-24"
                              >
                                REMOVE
                              </ButtonTertiary>
                            ) : (
                              <ButtonPrimaryGradient
                                type="button"
                                onClick={() => addToGroup(item.name)}
                                className="w-24"
                              >
                                + ADD
                              </ButtonPrimaryGradient>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h-[76px]">
                        <td colSpan={7} className="text-center">
                          No groups found. Create a group{' '}
                          <Link
                            to="/admin/groups"
                            className="text-primary-500 hover:text-primary-600 underline"
                          >
                            {' '}
                            here
                          </Link>
                          .
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-row justify-end gap-4 text-base font-bold h-10">
                <ButtonGhost type="button" onClick={closeModal} className="">
                  CLOSE
                </ButtonGhost>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default ManageUserGroupsModal;
