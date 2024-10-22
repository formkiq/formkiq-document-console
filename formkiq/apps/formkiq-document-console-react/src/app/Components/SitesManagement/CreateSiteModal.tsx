import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useAppDispatch } from '../../Store/store';
import ButtonPrimaryGradient from '../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../Generic/Buttons/ButtonGhost';
import RadioListbox from '../Generic/Listboxes/RadioListbox';
import { DocumentsService } from '../../helpers/services/documentsService';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';

type CreateSiteModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSitesChange: () => void;
};
type SiteType = {
  id: string;
  title: string;
  status: 'ACTIVE' | 'INACTIVE';
};

function CreateSiteModal({
  isOpen,
  setIsOpen,
  onSitesChange,
}: CreateSiteModalPropsType) {
  const dispatch = useAppDispatch();
  const [siteValue, setSiteValue] = useState<SiteType>({
    id: '',
    title: '',
    status: 'ACTIVE',
  });

  const closeModal = () => {
    setIsOpen(false);
    setSiteValue({ id: '', title: '', status: 'ACTIVE' });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // prevent from saving without a Title or ID
    if (!siteValue.title || !siteValue.id) {
      return;
    }
    DocumentsService.addSite({ site: siteValue }).then((res) => {
      if (res.status === 200) {
        onSitesChange();
        closeModal();
      } else {
        if (res.errors) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error. ' + res.errors[0].error,
            })
          );
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error. Site has not been created.',
            })
          );
        }
      }
    });
  };

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    if (pattern.test(e.target.value)) {
      setSiteValue({ ...siteValue, title: e.target.value });
    }
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    if (pattern.test(e.target.value)) {
      setSiteValue({ ...siteValue, id: e.target.value });
    }
  }

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => null}
          className="relative z-10 text-neutral-900"
          static
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-6">
              <Dialog.Title className="text-2xl font-bold">
                Create New Site
              </Dialog.Title>

              <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
                <input
                  type="text"
                  className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                  placeholder="Title"
                  required
                  value={siteValue.title}
                  pattern="^[a-zA-Z0-9_-]+$"
                  onChange={handleNameChange}
                  onKeyDown={(e) => preventDialogClose(e)}
                />
                <input
                  type="text"
                  className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                  placeholder="Site ID"
                  required
                  value={siteValue.id}
                  pattern="^[a-zA-Z0-9_-]+$"
                  onChange={handleIdChange}
                  onKeyDown={(e) => preventDialogClose(e)}
                />
                <div className="h-10 max-w-[200px]">
                  <p className="text-sm font-bold">Status</p>
                  <RadioListbox
                    selectedValue={siteValue.status}
                    setSelectedValue={(value: 'ACTIVE' | 'INACTIVE') => {
                      setSiteValue({ ...siteValue, status: value });
                    }}
                    values={['ACTIVE', 'INACTIVE']}
                    titles={['Active', 'Inactive']}
                    placeholderText="Status"
                  />
                </div>

                <div className="flex flex-row justify-end gap-4 text-base font-bold h-10 mt-4">
                  <ButtonGhost type="button" onClick={closeModal} className="">
                    CANCEL
                  </ButtonGhost>
                  <ButtonPrimaryGradient type="submit" className="">
                    + CREATE SITE
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

export default CreateSiteModal;
