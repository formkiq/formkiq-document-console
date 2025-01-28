import MappingAttributeDialog from './MappingAttributeDialog';
import {
  MappingAttribute,
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../../helpers/types/mappings';

type CreateMappingAttributeDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
  onSave: (attribute: MappingAttribute) => void;
};

function CreateMappingAttributeDialog({
  isOpen,
  setIsOpen,
  siteId,
  onSave,
}: CreateMappingAttributeDialogPropsType) {
  const initialAttributeValue: {
    attributeKey: string;
    defaultValue: string;
    defaultValues: string[];
    sourceType: MappingAttributeSourceType | string;
    labelText: string;
    labelTexts: string[];
    labelMatchingType: MappingAttributeLabelMatchingType | string;
    metadataField: MappingAttributeMetadataField | string;
    validationRegex: string;
  } = {
    attributeKey: '',
    defaultValue: '',
    defaultValues: [],
    sourceType: '',
    labelText: '',
    labelTexts: [],
    labelMatchingType: '',
    metadataField: '',
    validationRegex: '',
  };
  return (
    <MappingAttributeDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      siteId={siteId}
      initialAttributeValue={initialAttributeValue}
      type="edit"
      onSave={onSave}
    />
  );
}

export default CreateMappingAttributeDialog;
