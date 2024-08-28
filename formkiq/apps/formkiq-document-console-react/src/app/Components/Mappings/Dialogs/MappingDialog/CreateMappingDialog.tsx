import MappingDialog from './MappingDialog';
import { MappingAttribute } from '../../../../helpers/types/mappings';

type CreateMappingDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
};

function CreateMappingDialog({
  isOpen,
  setIsOpen,
  siteId,
}: CreateMappingDialogPropsType) {
  const initialMappingValue: {
    name: string;
    description: string;
    attributes: MappingAttribute[];
  } = { name: '', description: '', attributes: [] };
  return (
    <MappingDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      siteId={siteId}
      initialMappingValue={initialMappingValue}
      type="create"
    />
  );
}

export default CreateMappingDialog;
