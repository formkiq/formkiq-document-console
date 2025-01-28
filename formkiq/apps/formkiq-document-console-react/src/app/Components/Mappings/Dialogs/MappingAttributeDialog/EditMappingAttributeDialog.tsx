import MappingAttributeDialog from './MappingAttributeDialog';
import { MappingAttribute } from '../../../../helpers/types/mappings';

type EditMappingAttributeDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
  attribute: MappingAttribute;
  onSave: (attribute: MappingAttribute) => void;
};

function EditMappingAttributeDialog({
  isOpen,
  setIsOpen,
  siteId,
  attribute,
  onSave
}: EditMappingAttributeDialogPropsType) {
  return (
    <MappingAttributeDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      siteId={siteId}
      initialAttributeValue={attribute}
      type="edit"
      onSave={onSave}
    />
  );
}

export default EditMappingAttributeDialog;
