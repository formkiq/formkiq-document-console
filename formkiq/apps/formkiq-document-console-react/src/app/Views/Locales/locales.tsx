import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
//import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import {
  deleteLocale,
  fetchLocales,
  LocalesState,
  setLocalesLoadingStatusPending,
} from '../../Store/reducers/locales';
import { useAppDispatch } from '../../Store/store';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { Locale, RequestStatus } from '../../helpers/types/locales';

import CreateLocaleDialog from '../../Components/Locales/Dialogs/LocaleDialog/CreateLocaleDialog';
//import EditMappingDialog from '../../Components/Mappings/Dialogs/MappingDialog/EditMappingDialog';
import { useSelector } from 'react-redux';
import { useIsReadOnlyUser } from '../../hooks/is-read-only-user.hook';
import LocalesTable from './localesTable';

function Locales() {
  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const {
    locales,
    nextLocalesToken,
    localesLoadingStatus,
    isLastLocalesSearchPageLoaded,
    currentLocalesSearchPage,
  } = useSelector(LocalesState);
  const dispatch = useAppDispatch();
  const isReadOnlyUser = useIsReadOnlyUser({ user, siteId });
  const [isLocaleEditTabVisible, setIsLocaleEditTabVisible] = useState(false);
  const [editingLocale, setEditingLocale] = useState<Locale | null>(null);
  const [isLocaleAddTabVisible, setIsLocaleAddTabVisible] = useState(false);

  // update siteId
  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    setCurrentSiteId(recheckSiteInfo.siteId);
  }, [pathname]);

  // update locales when different siteId selected
  useEffect(() => {
    dispatch(fetchLocales({ siteId: currentSiteId }));
  }, [currentSiteId]);

  // load more locales when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('localesScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextLocalesToken &&
      localesLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setLocalesLoadingStatusPending());
      if (nextLocalesToken) {
        await dispatch(
          fetchLocales({
            siteId: currentSiteId,
            nextToken: nextLocalesToken,
            page: currentLocalesSearchPage + 1,
          })
        );
      }
    }
  }, [nextLocalesToken, localesLoadingStatus, isLastLocalesSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // Delete locale
  const onLocaleDelete = (locale: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this locale?',
        callback: () => {
          dispatch(deleteLocale({ locale, siteId: currentSiteId }));
        },
      })
    );
  };

  // Open tab to create/edit locale
  const showLocaleEditTab = (locale: Locale) => {
    setEditingLocale(locale);
    setTimeout(() => setIsLocaleEditTabVisible(true), 10);
  };

  return (
    <>
      <Helmet>
        <title>Locales</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-300">
          <div className="pt-4 max-w-screen-lg font-semibold mb-4">
            <div className="text-xl font-bold mb-4">
              Locales (site: {siteId})
            </div>
          </div>
          <div className="flex gap-2 p-2">
            {!isReadOnlyUser && (
              <ButtonPrimaryGradient
                onClick={() => setIsLocaleAddTabVisible(true)}
                style={{ height: '36px' }}
              >
                + Create New Locale
              </ButtonPrimaryGradient>
            )}
          </div>
        </div>
        <div
          className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full"
          id="localesScrollPane"
          onScroll={handleScroll}
        >
          <LocalesTable
            user={user}
            siteId={siteId}
            locales={locales}
            onLocaleDelete={onLocaleDelete}
            showLocaleEditTab={showLocaleEditTab}
          />
        </div>
      </div>
      <CreateLocaleDialog
        isOpen={isLocaleAddTabVisible}
        setIsOpen={setIsLocaleAddTabVisible}
        siteId={siteId}
      />
    </>
  );
}

export default Locales;
