import { Dialog } from '@headlessui/react';
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../../Store/store';
import { addUser } from '../../../Store/reducers/userManagement';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';

type CreateUserModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

function CreateUserModal({ isOpen, setIsOpen }: CreateUserModalPropsType) {
  const emailRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');

  const closeModal = () => {
    setIsOpen(false);
    setEmail('');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // prevent from saving without a Name
    if (email === '') {
      return;
    }
    dispatch(addUser({ email }));
    closeModal();
  };

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => null}
          className="relative z-50 text-neutral-900"
          static
          initialFocus={emailRef}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-6">
              <Dialog.Title className="text-2xl font-bold">
                Add New User
              </Dialog.Title>

              <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
                <input
                  className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                  placeholder="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={emailRef}
                  onKeyDown={(e) => preventDialogClose(e)}
                />

                <div className="flex flex-row justify-end gap-4 text-base font-bold h-10">
                  <ButtonGhost type="button" onClick={closeModal} className="">
                    CANCEL
                  </ButtonGhost>
                  <ButtonPrimaryGradient type="submit" className="">
                    + ADD
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

export default CreateUserModal;
