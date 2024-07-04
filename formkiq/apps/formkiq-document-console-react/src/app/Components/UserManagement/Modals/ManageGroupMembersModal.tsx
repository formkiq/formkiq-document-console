import {Dialog} from '@headlessui/react'
import {useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../../Store/store";
import {fetchUsers, UserManagementState} from "../../../Store/reducers/userManagement";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";
import {useSelector} from "react-redux";


type ManageGroupMembersModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

function ManageGroupMembersModal({isOpen, setIsOpen}: ManageGroupMembersModalPropsType) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const {users, usersLoadingStatus, nextUsersToken} = useSelector(UserManagementState);
  const [usersToAdd, setUsersToAdd] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [isOpen]);


  const closeModal = () => {
    setIsOpen(false);
    setUsersToAdd([])
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // prevent from saving without a Name

    // dispatch(addGroup({group: groupValue}))
    closeModal()
  }

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (<>{isOpen &&
      <Dialog open={isOpen} onClose={() => null} className="relative z-50 text-neutral-900" static
              initialFocus={groupNameRef}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white p-6">
            <Dialog.Title className="text-2xl font-bold">
              Manage Group Members
            </Dialog.Title>

            <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>


              <div className="flex flex-row justify-end gap-4 text-base font-bold h-10">
                <ButtonGhost type="button" onClick={closeModal}
                             className=""> CANCEL
                </ButtonGhost>
                <ButtonPrimaryGradient type="submit" className="">SAVE</ButtonPrimaryGradient>
              </div>
            </form>
          </div>
        </div>
      </Dialog>}</>
  );
}


export default ManageGroupMembersModal;
