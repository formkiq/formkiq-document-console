import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import ApiKeyList from '../../../Components/Integrations/ApiKeyList/ApiKeyList';
import NewApiKeyModal from '../../../Components/Integrations/NewApiKey/newApiKey';
import {AuthState} from '../../../Store/reducers/auth';
import {openDialog} from '../../../Store/reducers/globalConfirmControls';
import {useAppDispatch} from '../../../Store/store';
import {DocumentsService} from '../../../helpers/services/documentsService';
import {getCurrentSiteInfo, getUserSites} from "../../../helpers/services/toolService";
import {useLocation, useNavigate} from "react-router-dom";

export function ApiKeys() {
  const dispatch = useAppDispatch();
  let userSite: any = null;
  let defaultSite: any = null;
  const workspaceSites: any[] = [];
  const {user} = useSelector(AuthState);
  if (user && user.sites) {
    user.sites.forEach((site: any) => {
      if (site.siteId === user.email) {
        userSite = site;
      } else if (site.siteId === 'default') {
        defaultSite = site;
      } else {
        workspaceSites.push(site);
      }
    });
  }

  const {hasUserSite, hasDefaultSite, hasWorkspaces} = getUserSites(user);

  const pathname = decodeURI(useLocation().pathname);
  const {
    siteId,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );

  const navigate = useNavigate();
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentSite, setCurrentSite] = useState<any>(null)

  useEffect(() => {
    if (currentSiteId) {
      let site: any;
      if (user?.email && currentSiteId === user.email) {
        site = userSite
      } else if (currentSiteId === 'default') {
        site = defaultSite
      } else {
        site = workspaceSites.find(site => site.siteId === currentSiteId)
      }
      setCurrentSite(site);
      if (!site) {
        alert('No site configured for this user');
        window.location.href = '/';
      }
    }
  }, [currentSiteId])

  const [currentSiteApiKeys, setCurrentSiteApiKeys] = useState<any>(null);
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
  }, [pathname]);

  useEffect(() => {
    updateApiKeys();
  }, [user, currentSiteId]);

  const setApiKeys = (apiKeys: [], siteId: string, readonly: boolean) => {
    setCurrentSiteApiKeys(apiKeys as any);
  };


  const updateApiKeys = () => {

    let readonly = false;
    if (currentSite && currentSite.permission && currentSite.permission === 'READ_ONLY') {
      readonly = true;
    }
    DocumentsService.getApiKeys(currentSiteId).then(
      (apiKeysResponse: any) => {
        setApiKeys(apiKeysResponse.apiKeys, currentSiteId, readonly);
      }
    );
  };

  const deleteApiKey = (apiKey: string, siteId: string) => {
    const deleteFunc = async () => {
      setCurrentSiteApiKeys(null);
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

  return (
    <>
      <Helmet>
        <title>Api Keys</title>
      </Helmet>
      <div className="p-4 max-w-screen-lg font-semibold">
        FormKiQ allows for API authentication using API Keys
      </div>
      <div className="p-4">
        {currentSite && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
            >
              <div className="pl-1 uppercase text-base">
                Api Keys
                <span className="block normal-case">
                  (Site ID: {currentSiteId})
                </span>
              </div>
            </div>
            <ApiKeyList
              siteId={currentSiteId}
              apiKeys={currentSiteApiKeys}
              isSiteReadOnly={currentSite.readonly}
              onDelete={deleteApiKey}
              onNewClick={onNewClick}
            ></ApiKeyList>
          </>
        )}
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
