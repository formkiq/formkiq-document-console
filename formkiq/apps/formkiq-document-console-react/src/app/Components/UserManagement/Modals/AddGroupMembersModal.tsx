import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import {
  addUserToGroup,
  fetchUsers,
} from '../../../Store/reducers/userManagement';
import { useAppDispatch } from '../../../Store/store';
import { parseEmailInitials } from '../../../helpers/services/toolService';
import { User } from '../../../helpers/types/userManagement';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import UsersCombobox from '../../Generic/Listboxes/UsersCombobox';
import { Close, Plus } from '../../Icons/icons';

type AddGroupMembersModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  groupName: any;
  getGroupUsers: (groupName: string) => Promise<void>;
};

function AddGroupMembersModal({
  isOpen,
  setIsOpen,
  groupName,
  getGroupUsers,
}: AddGroupMembersModalPropsType) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [usersToAdd, setUsersToAdd] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setUsersToAdd([]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usersToAdd.length === 0) return;
    for (const user of usersToAdd) {
      const userData = { user: { username: user.username } };
      dispatch(addUserToGroup({ groupName, user: userData }));
    }
    //dispatch(fetchGroups({}));
    getGroupUsers(groupName);
    closeModal();
  };

  function addUser() {
    if (selectedUser === null) return;
    if (usersToAdd.find((u) => u.username === selectedUser.username)) return;
    setUsersToAdd([...usersToAdd, selectedUser]);
    setSelectedUser(null);
  }

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => null}
          className="relative z-50 text-neutral-900"
          static
          initialFocus={usernameRef}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-6">
              <Dialog.Title className="text-2xl font-bold">
                Add Group Members
              </Dialog.Title>

              <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
                <div className="flex gap-2 w-full items-center">
                  <UsersCombobox
                    selectedValue={selectedUser}
                    setSelectedValue={setSelectedUser}
                  />

                  <button
                    type="button"
                    onClick={addUser}
                    title="Add User"
                    className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                  >
                    <Plus />
                  </button>
                </div>
                <div className="flex flex-col gap-2 w-full max-h-32 overflow-y-auto border border-neutral-300 rounded-md p-2">
                  {usersToAdd.length === 0 && (
                    <div className="text-center">No users selected.</div>
                  )}
                  {usersToAdd.map((user, index) => (
                    <div
                      key={'user' + index}
                      className="flex gap-2 items-center border-b justify-between border-neutral-300 pb-2"
                    >
                      <div className="flex gap-2 items-center">
                        <div
                          key={'user' + index}
                          className="h-8 w-8 rounded-full bg-cornflower-blue-500 text-center text-white font-bold flex items-center justify-center uppercase"
                          data-tooltip-id={`groupUserTooltip-user-` + index}
                          data-tooltip-content={user.email}
                        >
                          {parseEmailInitials(user.email)}
                          <Tooltip id={`groupUserTooltip-user-` + index} />
                        </div>
                        <div className="text-sm font-medium">{user.email}</div>
                      </div>

                      <button
                        type="button"
                        className="w-4 h-4 min-w-4 text-neutral-900 hover:text-red-500"
                        onClick={() =>
                          setUsersToAdd(
                            usersToAdd.filter(
                              (u) => u.username !== user.username
                            )
                          )
                        }
                        title="Remove"
                      >
                        <Close />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row justify-end gap-4 text-base font-bold h-10">
                  <ButtonGhost
                    className="uppercase"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </ButtonGhost>
                  <ButtonPrimaryGradient className="uppercase" type="submit">
                    Save
                  </ButtonPrimaryGradient>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default AddGroupMembersModal;
