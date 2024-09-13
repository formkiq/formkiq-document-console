import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../Store/store';
import { openDialog as openNotificationDialog } from '../../../../Store/reducers/globalNotificationControls';
import {
  createNewAttribute,
  getAttributeErrorMessages,
  isAttributeValid,
} from '../helpers';
import AttributeForm from "../AttributeForm";

type MappingAttributeDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
  type: 'create' | 'edit';
  initialAttributeValue: any;
  onSave: (attribute: any) => void;
};

function MappingAttributeDialog({
  isOpen,
  setIsOpen,
  siteId,
  type,
  initialAttributeValue,
  onSave,
}: MappingAttributeDialogPropsType) {
  const [attribute, setAttribute] = useState(initialAttributeValue);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setAttribute(initialAttributeValue);
  }, [initialAttributeValue]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAttributeValid(attribute)) {
      const errorMessages = getAttributeErrorMessages(attribute);
      if (errorMessages.length > 0) {
        dispatch(
          openNotificationDialog({ dialogTitle: errorMessages.join('\n') })
        );
      }
      return;
    }
    const newAttribute = createNewAttribute(attribute);
    onSave(newAttribute);
  };

  const closeModal = () => {
    resetAttribute();
    setIsOpen(false);
  };

  const addDefaultValue = () => {
    if (attribute.defaultValue.length === 0) {
      return;
    }
    if (
      attribute.defaultValues &&
      attribute.defaultValues.includes(attribute.defaultValue)
    ) {
      dispatch(openNotificationDialog({ dialogTitle: 'Value already exists' }));
      return;
    }
    const updatedAttribute = {
      ...attribute,
      defaultValues: attribute.defaultValues
        ? [...attribute.defaultValues, attribute.defaultValue]
        : [attribute.defaultValue],
      defaultValue: '',
    };
    setAttribute(updatedAttribute);
  };

  const addLabelText = () => {
    if (attribute.labelText.length === 0) {
      return;
    }
    if (attribute.labelTexts.includes(attribute.labelText)) {
      dispatch(openNotificationDialog({ dialogTitle: 'Label already exists' }));
      return;
    }
    setAttribute({
      ...attribute,
      labelTexts: [...attribute.labelTexts, attribute.labelText],
      labelText: '',
    });
  };

  const resetAttribute = () => {
    setAttribute(initialAttributeValue);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => null}
      className="relative z-20 text-neutral-900"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white p-6 rounded-md">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {type === 'create'
              ? 'Create New Attribute'
              : 'Edit Mapping Attribute'}
          </Dialog.Title>
          <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
            {attribute && (
              <AttributeForm
                siteId={siteId}
                addDefaultValue={addDefaultValue}
                addLabelText={addLabelText}
                attribute={attribute}
                setAttribute={setAttribute}
              />
            )}
            <div className="flex flex-row justify-end gap-4 text-base font-bold mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="h-10 border border-neutral-900 px-4 rounded-md"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="h-10 bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 rounded-md"
              >
                {type === 'create' ? '+ CREATE' : 'SAVE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

export default MappingAttributeDialog;
