import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import ApiKeyList from '../../../Components/Integrations/ApiKeyList/ApiKeyList';
import NewApiKeyModal from '../../../Components/Integrations/NewApiKey/newApiKey';
import { AuthState } from '../../../Store/reducers/auth';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../../helpers/services/toolService';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from '../../../Components/Icons/icons';
import {
  ApiKeysState,
  fetchApiKeys,
  setApiKeysLoadingStatusPending,
} from '../../../Store/reducers/apiKeys';
import { RequestStatus } from '../../../helpers/types/apiKeys';

export function ApiKeys() {
  const dispatch = useAppDispatch();

  const { user } = useSelector(AuthState);

  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);

  const pathname = decodeURI(useLocation().pathname);
  const { siteId, isSiteReadOnly } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );

  const navigate = useNavigate();
  const {
    apiKeys,
    nextApiKeysToken,
    apiKeysLoadingStatus,
    currentApiKeysSearchPage,
    isLastApiKeysSearchPageLoaded,
  } = useSelector(ApiKeysState);
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [isCurrentSiteReadOnly, setIsCurrentSiteReadonly] =
    useState(isSiteReadOnly);

  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');

  const onNewClick = (event: any, siteId: string) => {
    setNewModalSiteId(siteId);
    setNewModalOpened(true);
  };
  const onNewClose = () => {
    setNewModalOpened(false);
  };
  useEffect(() => {
    if (isNewModalOpened === false) {
      // TODO send update instead of hacky updateApiKeyExpansion
    }
  }, [isNewModalOpened]);

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    if (recheckSiteInfo.siteRedirectUrl.length) {
      navigate(
        {
          pathname: `${recheckSiteInfo.siteRedirectUrl}`,
        },
        {
          replace: true,
        }
      );
    }
    setCurrentSiteId(recheckSiteInfo.siteId);
    setIsCurrentSiteReadonly(recheckSiteInfo.isSiteReadOnly);
  }, [pathname]);

  useEffect(() => {
    updateApiKeys();
  }, [user, currentSiteId]);

  const updateApiKeys = () => {
    dispatch(fetchApiKeys({ siteId: currentSiteId, limit: 20, page: 1 }));
  };

  const deleteApiKey = (apiKey: string, siteId: string) => {
    const deleteFunc = async () => {
      await DocumentsService.deleteApiKey(apiKey, siteId).then(
        (apiKeysResponse: any) => {
          updateApiKeys();
        }
      );
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this API Key?',
      })
    );
  };
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('apiKeysScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextApiKeysToken &&
      apiKeysLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setApiKeysLoadingStatusPending());
      if (nextApiKeysToken) {
        await dispatch(
          fetchApiKeys({
            siteId: currentSiteId,
            nextToken: nextApiKeysToken,
            page: currentApiKeysSearchPage + 1,
            limit: 20,
          })
        );
      }
    }
  }, [nextApiKeysToken, apiKeysLoadingStatus, isLastApiKeysSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Api Keys</title>
      </Helmet>
      <div className="text-xl font-bold p-4">API Keys (site: {siteId})</div>
      <div className="p-4 max-w-screen-lg font-semibold">
        FormKiQ allows for API authentication using API Keys
      </div>
      {!isCurrentSiteReadOnly && (
        <div className="my-4 flex px-4">
          <button
            className="flex bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold rounded-md flex cursor-pointer focus:outline-none py-2 px-4"
            data-test-id="create-api-key"
            onClick={(event) => onNewClick(event, currentSiteId)}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </button>
        </div>
      )}
      <div className="relative overflow-hidden h-full" id="apiKeysWrapper">
        <ApiKeyList
          siteId={currentSiteId}
          apiKeys={apiKeys}
          onDelete={deleteApiKey}
          handleScroll={handleScroll}
        ></ApiKeyList>
      </div>
      <NewApiKeyModal
        isOpened={isNewModalOpened}
        onClose={onNewClose}
        updateApiKeyExpansion={updateApiKeys}
        siteId={newModalSiteId}
      />
    </>
  );
}

export default ApiKeys;
