import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { ArrowBottom, ArrowRight } from '../../../Components/Icons/icons';
import NewWebhookModal from '../../../Components/Integrations/NewWebhook/newWebhook';
import WebhookList from '../../../Components/Integrations/WebhookList/WebhookList';
import { AuthState } from '../../../Store/reducers/auth';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';

type HookItem = {
  siteId: string;
  readonly: boolean;
  hooks: [] | null;
};
export function Webhooks() {
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
  const [userSiteWebhooks, setUserSiteWebhooks] = useState(null);
  const [defaultSiteExpanded, setDefaultSiteExpanded] = useState(true);
  const [defaultSiteWebhooks, setDefaultSiteWebhooks] = useState(null);
  const [sharedFolderHooks, setSharedFolderHooks] = useState<HookItem[]>([]);
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
      // TODO send update instead of hacky updateWebhookExpansion
    }
  }, [isNewModalOpened]);

  useEffect(() => {
    updateWebhooks();
  }, [user]);

  const setWebhooks = (webhooks: [], siteId: string, readonly: boolean) => {
    if (siteId === user?.email) {
      // NOTE: does not allow for a readonly user site
      setUserSiteWebhooks(webhooks as any);
    } else if (siteId === 'default') {
      // NOTE: does not allow for a readonly default site
      setDefaultSiteWebhooks(webhooks as any);
    }
  };

  const updateWebhooks = async () => {
    if (userSite) {
      let readonly = false;
      if (userSite.permission && userSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getWebhooks(userSite.siteId).then(
        (webhooksResponse: any) => {
          setWebhooks(webhooksResponse.webhooks, userSite.siteId, readonly);
        }
      );
    }
    if (defaultSite) {
      let readonly = false;
      if (defaultSite.permission && defaultSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getWebhooks(defaultSite.siteId).then(
        (webhooksResponse: any) => {
          setWebhooks(webhooksResponse.webhooks, defaultSite.siteId, readonly);
        }
      );
    }
    if (sharedFolderSites.length > 0) {
      const initialSharedFolderHooksPromises = sharedFolderSites.map((item) => {
        let readonly = false;
        if (item.permission && item.permission === 'READ_ONLY') {
          readonly = true;
        }
        return DocumentsService.getWebhooks(item.siteId).then(
          (webhooksResponse: any) => {
            return {
              hooks: webhooksResponse.webhooks,
              siteId: item.siteId,
              readonly,
            };
          }
        );
      });

      Promise.all(initialSharedFolderHooksPromises)
        .then((initialSharedFolderHooks) => {
          setSharedFolderHooks(initialSharedFolderHooks);
        })
        .catch((error) => {
          // Handle any errors that occurred during the requests
          console.error('Error fetching webhooks:', error);
        });
    }
  };

  const deleteWebhook = (webhookId: string, siteId: string) => {
    const deleteFunc = async () => {
      setUserSiteWebhooks(null);
      await DocumentsService.deleteWebhook(webhookId, siteId).then(
        (webhooksResponse: any) => {
          updateWebhooks();
        }
      );
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this webhook?',
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Webhooks</title>
      </Helmet>
      <div className="p-4 max-w-screen-lg font-semibold mb-4">
        By posting an HTML web form or any other data to a webhook URL, FormKiQ
        will process that data and add it as a new document.
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
                Webhooks: My Documents
                <span className="block normal-case">
                  {' '}
                  (Site ID: {userSite.siteId})
                </span>
              </div>
            </div>
            {userSiteExpanded && (
              <WebhookList
                siteId={userSite.siteId}
                webhooks={userSiteWebhooks}
                isSiteReadOnly={userSite.readonly}
                onDelete={deleteWebhook}
                onNewClick={onNewClick}
              ></WebhookList>
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
                  <span>
                    Webhooks: Team Documents
                    <span className="block normal-case">
                      (Site ID: default)
                    </span>
                  </span>
                ) : (
                  <span>
                    Webhooks: Documents
                    <span className="block normal-case">
                      (Site ID: default)
                    </span>
                  </span>
                )}
              </div>
            </div>
            {defaultSiteExpanded && (
              <WebhookList
                webhooks={defaultSiteWebhooks}
                onDelete={deleteWebhook}
                siteId={defaultSite.siteId}
                isSiteReadOnly={defaultSite.readonly}
                onNewClick={onNewClick}
              ></WebhookList>
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
                Webhooks: Workspaces
              </div>
            </div>
            {sharedFoldersExpanded &&
              sharedFolderHooks.map((item: HookItem, i: number) => {
                return (
                  <div key={i}>
                    <div className="mt-4 ml-4 flex flex-wrap w-full">
                      <div className="pl-1 uppercase text-sm">
                        Webhooks:{' '}
                        <span className="normal-case">{item.siteId}</span>
                      </div>
                    </div>
                    <div className="mt-4 ml-4">
                      <WebhookList
                        webhooks={item.hooks}
                        siteId={item.siteId}
                        isSiteReadOnly={item.readonly}
                        onDelete={deleteWebhook}
                        onNewClick={onNewClick}
                      ></WebhookList>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>
      <NewWebhookModal
        isOpened={isNewModalOpened}
        onClose={onNewClose}
        updateWebhookExpansion={updateWebhooks}
        siteId={newModalSiteId}
      />
    </>
  );
}

export default Webhooks;
