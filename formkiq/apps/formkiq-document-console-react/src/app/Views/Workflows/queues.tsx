import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowBottom, ArrowRight } from '../../Components/Icons/icons';
import NewQueueModal from '../../Components/Workflows/NewQueue/newQueue';
import QueueList from '../../Components/Workflows/QueueList/QueueList';
import { AuthState } from '../../Store/reducers/auth';
import { openDialog } from '../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';

type QueueItem = {
  siteId: string;
  readonly: boolean;
  queues: [] | null;
};
export function Queues() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let userSite: any = null;
  let defaultSite: any = null;
  const workspaceSites: any[] = [];
  const { user } = useSelector(AuthState);
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
  const currentSite = userSite
    ? userSite
    : defaultSite
    ? defaultSite
    : workspaceSites[0];
  if (currentSite === null) {
    alert('No site configured for this user');
    window.location.href = '/';
  }

  const [userSiteExpanded, setUserSiteExpanded] = useState(true);
  const [userSiteQueues, setUserSiteQueues] = useState(null);
  const [defaultSiteExpanded, setDefaultSiteExpanded] = useState(true);
  const [defaultSiteQueues, setDefaultSiteQueues] = useState(null);
  const [workspaceQueues, setWorkspaceQueues] = useState<QueueItem[]>([]);
  const [workspacesExpanded, setWorkspacesExpanded] = useState(false);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');
  const toggleUserSiteExpand = () => {
    setUserSiteExpanded(!userSiteExpanded);
  };
  const toggleDefaultSiteExpand = () => {
    setDefaultSiteExpanded(!defaultSiteExpanded);
  };
  const toggleWorkspacesExpand = () => {
    setWorkspacesExpanded(!workspacesExpanded);
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
      // TODO send update instead of hacky updateQueueExpansion
    }
  }, [isNewModalOpened]);

  useEffect(() => {
    updateQueues();
  }, [user]);

  const setQueues = (queues: [], siteId: string, readonly: boolean) => {
    if (siteId === user?.email) {
      // NOTE: does not allow for a readonly user site
      setUserSiteQueues(queues as any);
    } else if (siteId === 'default') {
      // NOTE: does not allow for a readonly default site
      setDefaultSiteQueues(queues as any);
    }
  };

  const updateQueues = async () => {
    if (userSite) {
      let readonly = false;
      if (userSite.permission && userSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getQueues(userSite.siteId).then(
        (queuesResponse: any) => {
          setQueues(queuesResponse.queues, userSite.siteId, readonly);
        }
      );
    }
    if (defaultSite) {
      let readonly = false;
      if (defaultSite.permission && defaultSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getQueues(defaultSite.siteId).then(
        (queuesResponse: any) => {
          setQueues(queuesResponse.queues, defaultSite.siteId, readonly);
        }
      );
    }
    if (workspaceSites.length > 0) {
      const initialWorkspaceQueuesPromises = workspaceSites.map((item) => {
        let readonly = false;
        if (item.permission && item.permission === 'READ_ONLY') {
          readonly = true;
        }
        return DocumentsService.getQueues(item.siteId).then(
          (queuesResponse: any) => {
            return {
              queues: queuesResponse.queues,
              siteId: item.siteId,
              readonly,
            };
          }
        );
      });

      Promise.all(initialWorkspaceQueuesPromises)
        .then((initialWorkspaceQueues) => {
          setWorkspaceQueues(initialWorkspaceQueues);
        })
        .catch((error) => {
          // Handle any errors that occurred during the requests
          console.error('Error fetching queues:', error);
        });
    }
  };

  const viewQueue = (queueId: string, siteId: string) => {
    let rootUri = '';
    if (userSite && siteId === userSite.siteId) {
      rootUri = '/my-documents';
    } else if (siteId === defaultSite.siteId) {
      rootUri = '/documents';
    } else {
      rootUri = `/workspaces/${siteId}`;
    }
    navigate(`${rootUri}/queues/${queueId}`);
  };

  const deleteQueue = (queueId: string, siteId: string) => {
    const deleteFunc = async () => {
      setUserSiteQueues(null);
      await DocumentsService.deleteQueue(queueId, siteId).then(
        (queuesResponse: any) => {
          updateQueues();
        }
      );
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this queue?',
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Queues</title>
      </Helmet>
      <div className="p-4 max-w-screen-lg font-semibold mb-4">
        <p>
          A queue is place where documents wait for manual actions to be
          performed.
        </p>
        <p className="mt-4">
          NOTE: a queue cannot be deleted once it has been used by a document.
        </p>
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
                Queues: My Documents
                <span className="block normal-case">
                  {' '}
                  (Site ID: {userSite.siteId})
                </span>
              </div>
            </div>
            {userSiteExpanded && (
              <QueueList
                siteId={userSite.siteId}
                queues={userSiteQueues}
                isSiteReadOnly={userSite.readonly}
                onView={viewQueue}
                onDelete={deleteQueue}
                onNewClick={onNewClick}
              ></QueueList>
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
                    Queues: Team Documents
                    <span className="block normal-case">
                      (Site ID: default)
                    </span>
                  </span>
                ) : (
                  <span>
                    Queues: Documents
                    <span className="block normal-case">
                      (Site ID: default)
                    </span>
                  </span>
                )}
              </div>
            </div>
            {defaultSiteExpanded && (
              <QueueList
                queues={defaultSiteQueues}
                onView={viewQueue}
                onDelete={deleteQueue}
                siteId={defaultSite.siteId}
                isSiteReadOnly={defaultSite.readonly}
                onNewClick={onNewClick}
              ></QueueList>
            )}
          </>
        )}
        {workspaceSites.length > 0 && (
          <>
            <div
              className="w-full flex self-start text-gray-600 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleWorkspacesExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {workspacesExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">Queues: Workspaces</div>
            </div>
            {workspacesExpanded &&
              workspaceQueues.map((item: QueueItem, i: number) => {
                return (
                  <div key={i}>
                    <div className="mt-4 ml-4 flex flex-wrap w-full">
                      <div className="pl-1 uppercase text-sm">
                        Queues:{' '}
                        <span className="normal-case">{item.siteId}</span>
                      </div>
                    </div>
                    <div className="mt-4 ml-4">
                      <QueueList
                        queues={item.queues}
                        siteId={item.siteId}
                        isSiteReadOnly={item.readonly}
                        onView={viewQueue}
                        onDelete={deleteQueue}
                        onNewClick={onNewClick}
                      ></QueueList>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>
      <NewQueueModal
        isOpened={isNewModalOpened}
        onClose={onNewClose}
        updateQueueExpansion={updateQueues}
        siteId={newModalSiteId}
      />
    </>
  );
}

export default Queues;
