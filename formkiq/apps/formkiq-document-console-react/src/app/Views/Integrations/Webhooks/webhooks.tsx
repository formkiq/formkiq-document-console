import { Helmet } from "react-helmet-async"
import { useState, useEffect } from 'react'
import { RootState } from "../../../Store/store"
import { ArrowRight, ArrowBottom } from '../../../Components/Icons/icons';
import { connect, useDispatch } from "react-redux"
import NewWebhookModal from "../../../Components/Integrations/NewWebhook/newWebhook"
import WebhookList from "../../../Components/Integrations/WebhookList/WebhookList"
import { DocumentsService } from "../../../helpers/services/documentsService";
import { openDialog } from "../../../Store/reducers/globalConfirmControls";

type HookItem = {
  siteId: string,
  hooks: [] | null
}
export function Webhooks({ user }: any) {

  const dispatch = useDispatch()
  let userSite: any = null
  let defaultSite: any = null
  const sharedFolderSites: any[] = []
  if (user && user.sites) {
    user.sites.forEach((site: any) => {
      if (site.siteId === user.email) {
        userSite = site
      } else if (site.siteId === 'default') {
        defaultSite = site
      } else {
        sharedFolderSites.push(site)
      }
    })
  }
  const currentSite = userSite ? userSite : defaultSite

  const [userSiteExpanded, setUserSiteExpanded] = useState(true)
  const [userSiteWebhooks, setUserSiteWebhooks] = useState(null)
  const [defaultSiteExpanded, setDefaultSiteExpanded] = useState(true)
  const [deaultSiteWebhooks, setDefaultSiteWebhooks] = useState(null)
  const [sharedFolderHooks, setSharedFolderHooks] = useState<HookItem []>([])
  const [sharedFoldersExpanded, setSharedFoldersExpanded] = useState(false)
  const [isNewModalOpened, setNewModalOpened] = useState(false)
  const [newModalSiteId, setNewModalSiteId] = useState('default')
  const toggleUserSiteExpand = () => {
    setUserSiteExpanded(!userSiteExpanded)
  }
  const toggleDefaultSiteExpand = () => {
    setDefaultSiteExpanded(!defaultSiteExpanded)
  }
  const toggleSharedFoldersExpand = () => {
    setSharedFoldersExpanded(!sharedFoldersExpanded)
  }
  const onNewClick = (event: any, siteId: string) => {
    setNewModalSiteId(siteId)
    setNewModalOpened(true)
  }
  const onNewClose = () => {
    setNewModalOpened(false)
  }
  useEffect(() => {
    if (isNewModalOpened === false) {
      // TODO send update instead of hacky updateWebhookExpansion
    }
  }, [isNewModalOpened])

  useEffect(() => {
    updateWebhooks()
  }, [user])

  const setWebhooks = (webhooks: [], siteId: string) => {
    if (siteId === user.email) {
      setUserSiteWebhooks(webhooks as any)
    } else if (siteId === 'default') {
      setDefaultSiteWebhooks(webhooks as any)
    } else {
      const index = sharedFolderHooks.findIndex((val: HookItem) => { return val.siteId === siteId})
      const newArr = [...sharedFolderHooks]
      if(index < 0) {
        newArr.push({hooks: webhooks, siteId: siteId})
      } else {
        const item = { ...(newArr[index]) }
        item.hooks = webhooks
        newArr[index] = item
      }
      setSharedFolderHooks(newArr)
    }
  }
  
  const updateWebhooks = () => {
    if(currentSite.siteId) {
      DocumentsService.getWebhooks(currentSite.siteId).then((webhooksResponse: any) => {
        setWebhooks(webhooksResponse.webhooks, currentSite.siteId)
      })
    }
    if(sharedFolderSites.length > 0) {
      for(const item of sharedFolderSites) {
        DocumentsService.getWebhooks(item.siteId).then((webhooksResponse: any) => {
          setWebhooks(webhooksResponse.webhooks, item.siteId)
        })
      }
    }
  }

  const deleteWebhook = (webhookId: string, siteId: string) => {
    const deleteFunc = () => {
      setUserSiteWebhooks(null)
      DocumentsService.deleteWebhook(webhookId, siteId).then((webhooksResponse: any) => {
        updateWebhooks()
      })
    }
    dispatch(openDialog({ callback: deleteFunc, dialogTitle: 'Are you sure you want to delete this webhook?'}))
  }

  return (
    <>
      <Helmet>
        <title>Webhooks</title>
      </Helmet>
      <div className="max-w-screen-lg font-semibold mb-4">
        By posting an HTML web form or any other data to a webhook URL, FormKiQ will process that data and add it as a new document.
        <span className="block mt-2">
          Note: for outbound webhooks, please see <a href="/integrations/workflows" className="underline hover:text-coreOrange-500">Workflows</a>.
        </span>
      </div>
      <div>
        { userSite && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleUserSiteExpand}
              >
              <div className="flex justify-end mt-3 mr-1">
                { userSiteExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
              </div>
              <div className="pl-1 uppercase text-base">
                Webhooks: My Documents
              </div>
            </div>
            {userSiteExpanded && (
              <WebhookList siteId={userSite.siteId} webhooks={userSiteWebhooks} onDelete={deleteWebhook} onNewClick={onNewClick}></WebhookList>
            )}
          </>
        )}
        { defaultSite && defaultSite.siteId && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleDefaultSiteExpand}
              >
              <div className="flex justify-end mt-3 mr-1">
                { defaultSiteExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
              </div>
              <div className="pl-1 uppercase text-base">
                { userSite ? (
                  <span>
                    Webhooks: Shared Documents
                  </span>
                ) : (
                  <span>
                    Webhooks: Documents
                  </span>
                )}
              </div>
            </div>
            {defaultSiteExpanded && (
              <WebhookList webhooks={deaultSiteWebhooks} onDelete={deleteWebhook} siteId={defaultSite.siteId} onNewClick={onNewClick}></WebhookList>
            )}
          </>
        )}
        { sharedFolderSites.length > 0 && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleSharedFoldersExpand}
              >
              <div className="flex justify-end mt-3 mr-1">
                { sharedFoldersExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
              </div>
              <div className="pl-1 uppercase text-base">
                Webhooks: Shared Folders
              </div>
            </div>
            {sharedFoldersExpanded && sharedFolderHooks.map((item: HookItem, i: number) => {
              return (
                <div key={i}>
                  <div className="mt-4 ml-4 flex flex-wrap w-full">
                    <div className="pl-1 uppercase text-sm">
                      Webhooks: {item.siteId}
                    </div>
                  </div>
                  <div className="mt-4 ml-4">
                    <WebhookList webhooks={item.hooks} siteId={item.siteId} onDelete={deleteWebhook} onNewClick={onNewClick}></WebhookList>
                  </div>
                </div>
              )
            }
            )}
          </>
        )}
      </div>
      <NewWebhookModal isOpened={isNewModalOpened} onClose={onNewClose} updateWebhookExpansion={updateWebhooks} siteId={newModalSiteId} />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return { user: state.authReducer?.user }
};

export default connect(mapStateToProps)(Webhooks as any);
  