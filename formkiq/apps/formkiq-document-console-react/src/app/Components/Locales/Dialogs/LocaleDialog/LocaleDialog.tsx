import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';

import { Locale } from 'apps/formkiq-document-console-react/src/app/helpers/types/locales';
import {
  addLocale,
  fetchLocales,
  updateLocale,
} from 'apps/formkiq-document-console-react/src/app/Store/reducers/locales';
import { openDialog as openNotificationDialog } from '../../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../../Store/store';
import GeneralInfoTab from './GeneralInfoTab';

type LocaleDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
  type: 'create' | 'edit';
  initialLocaleValue: Locale;
};

function LocaleDialog({
  isOpen,
  setIsOpen,
  siteId,
  type,
  initialLocaleValue,
}: LocaleDialogPropsType) {
  const [selectedTab, setSelectedTab] = useState<'generalInfo'>('generalInfo');
  const [locale, setLocale] = useState(initialLocaleValue);
  const localeNameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLocale(initialLocaleValue);
  }, [initialLocaleValue]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locale.locale.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please enter the locale (RFC 5646).',
        })
      );
      setSelectedTab('generalInfo');
      return;
    }
    try {
      if (type === 'create') {
        await dispatch(addLocale({ locale, siteId })).unwrap();
      } else if (type === 'edit' && locale.locale) {
        await dispatch(
          updateLocale({
            localeBody: { locale },
            siteId,
            locale: locale.locale,
          })
        ).unwrap();
      }
      dispatch(fetchLocales({ siteId, page: 1, limit: 20, nextToken: null }));
      closeModal();
    } catch (error: any) {
      dispatch(openNotificationDialog({ dialogTitle: error.message }));
    }
  };

  const closeModal = () => {
    resetLocale();
    setSelectedTab('generalInfo');
    setIsOpen(false);
  };

  const resetLocale = () => {
    setLocale(initialLocaleValue);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => null}
      className="relative z-20 text-neutral-900"
      initialFocus={localeNameRef}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white p-6 rounded-md">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {type === 'create' ? 'Create New Locale' : 'Edit Locale'}
          </Dialog.Title>
          <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
            <div className="flex flex-row justify-start gap-2 text-sm font-bold">
              <button
                type="button"
                className="h-8 px-4"
                style={{
                  borderBottom:
                    selectedTab === 'generalInfo'
                      ? '1px solid #171C26'
                      : '1px solid transparent',
                  color: selectedTab === 'generalInfo' ? '#171C26' : '#68758D',
                }}
                onClick={() => setSelectedTab('generalInfo')}
              >
                GENERAL
              </button>
            </div>
            {locale && (
              <>
                {selectedTab === 'generalInfo' && (
                  <GeneralInfoTab
                    locale={locale}
                    setLocale={setLocale}
                    localeNameRef={localeNameRef}
                  />
                )}
              </>
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

export default LocaleDialog;
