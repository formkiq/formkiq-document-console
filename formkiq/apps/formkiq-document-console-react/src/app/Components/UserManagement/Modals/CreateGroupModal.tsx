import {Dialog} from '@headlessui/react'
import {useEffect, useRef, useState} from "react";
import {Group} from "../../../helpers/types/userManagement";
import {CheckedRadio, Close} from "../../Icons/icons";
import {SelectedEventArgs, UploaderComponent,} from "@syncfusion/ej2-react-inputs";
import {DocumentsService, IFileUploadData} from "../../../helpers/services/documentsService";
import {useAppDispatch} from "../../../Store/store";
import {addGroup} from "../../../Store/reducers/userManagement";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";




type CreateCaseModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

function CreateGroupModal({isOpen, setIsOpen}: CreateCaseModalPropsType) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const [groupValue, setGroupValue] = useState({name: '', description: ''})


  const closeModal = () => {
    setIsOpen(false);
    setGroupValue({name: '', description: ''})
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // prevent from saving without a Name
    if (!groupValue.name) {
          return;
    }
    dispatch(addGroup({group: groupValue}))
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
              Create New Case
            </Dialog.Title>

            <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>

                <input type="text" className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                       placeholder="Name group"
                       required value={groupValue.name}
                       onChange={(e) => setGroupValue({...groupValue, name: e.target.value})}
                       ref={groupNameRef}
                       onKeyDown={(e) => preventDialogClose(e)}/>
                <textarea rows={3} className=" px-4 border border-neutral-300 text-sm rounded-md"
                          placeholder="Description..."
                          value={groupValue.description}
                          onChange={(e) => setGroupValue({...groupValue, description: e.target.value})}/>


              <div className="flex flex-row justify-end gap-4 text-base font-bold h-10">
                <ButtonGhost type="button" onClick={closeModal}
                        className=""> CANCEL
                </ButtonGhost>
                <ButtonPrimaryGradient type="submit" className="">+ CREATE GROUP</ButtonPrimaryGradient>
              </div>
            </form>
          </div>
        </div>
      </Dialog>}</>
  );
}


export default CreateGroupModal;
