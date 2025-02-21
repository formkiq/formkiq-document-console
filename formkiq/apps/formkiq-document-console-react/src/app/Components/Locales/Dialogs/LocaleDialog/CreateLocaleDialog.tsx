import { LocaleResourceItem } from 'apps/formkiq-document-console-react/src/app/helpers/types/locales';
import LocaleDialog from './LocaleDialog';

type CreateLocaleDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
};

function CreateLocaleDialog({
  isOpen,
  setIsOpen,
  siteId,
}: CreateLocaleDialogPropsType) {
  const initialLocaleValue: {
    locale: string;
    resourceItems: LocaleResourceItem[];
  } = { locale: '', resourceItems: [] };
  return (
    <LocaleDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      siteId={siteId}
      initialLocaleValue={initialLocaleValue}
      type="create"
    />
  );
}

export default CreateLocaleDialog;
