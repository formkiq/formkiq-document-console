import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { ArrowBottom, ArrowRight } from '../../../Components/Icons/icons';
import ApiKeyList from '../../../Components/Integrations/ApiKeyList/ApiKeyList';
import NewApiKeyModal from '../../../Components/Integrations/NewApiKey/newApiKey';
import { AuthState } from '../../../Store/reducers/auth';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';

type KeyItem = {
  siteId: string;
  readonly: boolean;
  keys: [] | null;
};

export function ApiKeys() {
  const dispatch = useAppDispatch();
  let userSite: any = null;
  let defaultSite: any = null;
  const sharedFolderSites: any[] = [];
  const { user } = useSelector(AuthState);
  if (user && user.sites) {
    user.sites.forEach((site: any) => {
      if (site.siteId === user.email) {
        userSite = site;
      } else if (site.siteId === 'default') {
        defaultSite = site;
      } else {
        sharedFolderSites.push(site);
      }
    });
  }
  const currentSite = userSite
    ? userSite
    : defaultSite
    ? defaultSite
    : sharedFolderSites[0];
  if (currentSite === null) {
    alert('No site configured for this user');
    window.location.href = '/';
  }

  const [userSiteExpanded, setUserSiteExpanded] = useState(true);
  const [userSiteApiKeys, setUserSiteApiKeys] = useState(null);
  const [defaultSiteExpanded, setDefaultSiteExpanded] = useState(true);
  const [defaultSiteApiKeys, setDefaultSiteApiKeys] = useState(null);
  const [sharedFolderKeys, setSharedFolderKeys] = useState<KeyItem[]>([]);
  const [sharedFoldersExpanded, setSharedFoldersExpanded] = useState(false);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');
  const toggleUserSiteExpand = () => {
    setUserSiteExpanded(!userSiteExpanded);
  };
  const toggleDefaultSiteExpand = () => {
    setDefaultSiteExpanded(!defaultSiteExpanded);
  };
  const toggleSharedFoldersExpand = () => {
    setSharedFoldersExpanded(!sharedFoldersExpanded);
  };
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
    updateApiKeys();
  }, [user]);

  const setApiKeys = (apiKeys: [], siteId: string, readonly: boolean) => {
    if (siteId === user?.email) {
      // NOTE: does not allow for a readonly user site
      setUserSiteApiKeys(apiKeys as any);
    } else if (siteId === 'default') {
      // NOTE: does not allow for a readonly default site
      setDefaultSiteApiKeys(apiKeys as any);
    } else {
      const index = sharedFolderKeys.findIndex((val: KeyItem) => {
        return val.siteId === siteId;
      });
      const newArr = [...sharedFolderKeys];
      if (index < 0) {
        newArr.push({ keys: apiKeys, siteId: siteId, readonly });
      } else {
        const item = { ...newArr[index] };
        item.keys = apiKeys;
        newArr[index] = item;
      }
      setSharedFolderKeys(newArr);
    }
  };

  const updateApiKeys = () => {
    if (userSite) {
      let readonly = false;
      if (userSite.permission && userSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getApiKeys(userSite.siteId).then(
        (apiKeysResponse: any) => {
          setApiKeys(apiKeysResponse.apiKeys, userSite.siteId, readonly);
        }
      );
    }
    if (defaultSite) {
      let readonly = false;
      if (defaultSite.permission && defaultSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getApiKeys(defaultSite.siteId).then(
        (apiKeysResponse: any) => {
          setApiKeys(apiKeysResponse.apiKeys, defaultSite.siteId, readonly);
        }
      );
    }
    if (sharedFolderSites.length > 0) {
      for (const item of sharedFolderSites) {
        let readonly = false;
        if (item.permission && item.permission === 'READ_ONLY') {
          readonly = true;
        }
        DocumentsService.getApiKeys(item.siteId).then(
          (apiKeysResponse: any) => {
            setApiKeys(apiKeysResponse.apiKeys, item.siteId, readonly);
          }
        );
      }
    }
  };

  const deleteApiKey = (apiKey: string, siteId: string) => {
    const deleteFunc = async () => {
      setUserSiteApiKeys(null);
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
      <div className="p-4 max-w-screen-lg font-semibold mb-4">
        FormKiQ allows for API authentication using API Keys
      </div>
      <div className="p-4">
        {userSite && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleUserSiteExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {userSiteExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">
                Api Keys: My Documents
              </div>
            </div>
            {userSiteExpanded && (
              <ApiKeyList
                siteId={userSite.siteId}
                apiKeys={userSiteApiKeys}
                isSiteReadOnly={userSite.readonly}
                onDelete={deleteApiKey}
                onNewClick={onNewClick}
              ></ApiKeyList>
            )}
          </>
        )}
        {defaultSite && defaultSite.siteId && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleDefaultSiteExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {defaultSiteExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">
                {userSite ? (
                  <span>API Keys: Team Documents</span>
                ) : (
                  <span>API Keys: Documents</span>
                )}
              </div>
            </div>
            {defaultSiteExpanded && (
              <ApiKeyList
                apiKeys={defaultSiteApiKeys}
                onDelete={deleteApiKey}
                siteId={defaultSite.siteId}
                isSiteReadOnly={defaultSite.readonly}
                onNewClick={onNewClick}
              ></ApiKeyList>
            )}
          </>
        )}
        {sharedFolderSites.length > 0 && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleSharedFoldersExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {sharedFoldersExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">
                API Keys: Shared Folders
              </div>
            </div>
            {sharedFoldersExpanded &&
              sharedFolderKeys.map((item: KeyItem, i: number) => {
                return (
                  <div key={i}>
                    <div className="mt-4 ml-4 flex flex-wrap w-full">
                      <div className="pl-1 uppercase text-sm">
                        API Keys: {item.siteId}
                      </div>
                    </div>
                    <div className="mt-4 ml-4">
                      <ApiKeyList
                        apiKeys={item.keys}
                        siteId={item.siteId}
                        isSiteReadOnly={item.readonly}
                        onDelete={deleteApiKey}
                        onNewClick={onNewClick}
                      ></ApiKeyList>
                    </div>
                  </div>
                );
              })}
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
