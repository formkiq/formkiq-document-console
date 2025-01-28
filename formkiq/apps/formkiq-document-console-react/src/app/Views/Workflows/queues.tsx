import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import NewQueueModal from '../../Components/Workflows/NewQueue/newQueue';
import QueueList from '../../Components/Workflows/QueueList/QueueList';
import { AuthState } from '../../Store/reducers/auth';
import { openDialog } from '../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../Store/store';

import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { Plus } from '../../Components/Icons/icons';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import {
  deleteQueue,
  fetchQueues,
  QueuesState,
  setQueuesLoadingStatusPending,
} from '../../Store/reducers/queues';

type QueueItem = {
  siteId: string;
  readonly: boolean;
  queues: [] | null;
};

export function Queues() {
  const dispatch = useAppDispatch();
  const { user } = useSelector(AuthState);

  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId, siteDocumentsRootUri, isSiteReadOnly } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const navigate = useNavigate();
  const {
    queues,
    queuesLoadingStatus,
    nextQueuesToken,
    currentQueuesSearchPage,
    isLastQueuesSearchPageLoaded,
  } = useSelector(QueuesState);
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);

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
      // TODO send update instead of hacky updateQueueExpansion
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
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
  }, [pathname]);

  useEffect(() => {
    updateQueues();
  }, [user]);

  useEffect(() => {
    dispatch(
      fetchQueues({
        siteId: currentSiteId,
      })
    );
  }, [currentSiteId]);

  const updateQueues = async () => {
    dispatch(fetchQueues({ siteId: currentSiteId }));
  };

  const viewQueue = (queueId: string, siteId: string) => {
    navigate(`${currentDocumentsRootUri}/queues/${queueId}`);
  };

  const onDeleteQueue = (queueId: string, siteId: string) => {
    const deleteFunc = async () => {
      dispatch(deleteQueue({ queueId, siteId, queues }));
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this queue?',
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

    const scrollpane = document.getElementById('queuesScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextQueuesToken &&
      queuesLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setQueuesLoadingStatusPending());
      if (nextQueuesToken) {
        await dispatch(
          fetchQueues({
            siteId: currentSiteId,
            nextToken: nextQueuesToken,
            page: currentQueuesSearchPage + 1,
          })
        );
      }
    }
  }, [nextQueuesToken, queuesLoadingStatus, isLastQueuesSearchPageLoaded]);

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
        <title>Queues</title>
      </Helmet>

      <div
        className="flex"
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="grow flex flex-col justify-stretch">
          <div className="p-4 max-w-screen-lg font-semibold mb-4">
            <div className="text-xl font-bold mb-4">
              Queues (site: {siteId})
            </div>
            <p>
              A queue is place where documents wait for manual actions to be
              performed.
            </p>
            <p className="mt-4">
              NOTE: a queue cannot be deleted once it has been used by a
              document.
            </p>
          </div>
          {!isSiteReadOnly && (
            <div className="mb-4 flex px-4">
              <ButtonPrimaryGradient
                data-test-id="create-queue"
                onClick={(event: any) => onNewClick(event, siteId)}
                className="flex items-center"
                style={{ height: '36px' }}
              >
                <span>Create new</span>
                <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
              </ButtonPrimaryGradient>
            </div>
          )}
          <div className="relative overflow-hidden h-full">
            <QueueList
              siteId={currentSiteId}
              handleScroll={handleScroll}
              queues={queues as []}
              onView={viewQueue}
              onDelete={onDeleteQueue}
            ></QueueList>
          </div>
        </div>
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
