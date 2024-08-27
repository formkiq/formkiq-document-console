import MappingDialog from './MappingDialog';
import { Mapping} from '../../../helpers/types/mappings';

type EditMappingDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
  mapping: Mapping;
};

function EditMappingDialog({
  isOpen,
  setIsOpen,
  siteId,
  mapping,
}: EditMappingDialogPropsType) {
  return (
    <MappingDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      siteId={siteId}
      initialMappingValue={mapping}
      type="edit"
    />
  );
}

export default EditMappingDialog;
