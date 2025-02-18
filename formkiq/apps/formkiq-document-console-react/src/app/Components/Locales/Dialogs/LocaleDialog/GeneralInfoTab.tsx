import { Locale } from '../../../../helpers/types/locales';
import { preventDialogClose } from '../helpers';

function GeneralInfoTab({
  locale,
  setLocale,
  localeNameRef,
}: {
  locale: Partial<Locale>;
  setLocale: (locale: any) => void;
  localeNameRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <>
      <input
        type="text"
        className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
        placeholder="Add locale"
        required
        value={locale.name}
        onChange={(e) => setLocale({ ...locale, name: e.target.value })}
        ref={localeNameRef}
        onKeyDown={preventDialogClose}
      />
    </>
  );
}

export default GeneralInfoTab;
