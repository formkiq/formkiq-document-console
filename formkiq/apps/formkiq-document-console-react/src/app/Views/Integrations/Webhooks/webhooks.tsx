import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import NewWebhookModal from '../../../Components/Integrations/NewWebhook/newWebhook';
import WebhookList from '../../../Components/Integrations/WebhookList/WebhookList';
import { AuthState } from '../../../Store/reducers/auth';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../../helpers/services/toolService';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchWebhooks,
  setWebhooksLoadingStatusPending,
  WebhooksState,
} from '../../../Store/reducers/webhooks';
import { RequestStatus } from '../../../helpers/types/document';
import { Plus } from '../../../Components/Icons/icons';

export function Webhooks() {
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
    webhooks,
    nextWebhooksToken,
    webhooksLoadingStatus,
    currentWebhooksSearchPage,
    isLastWebhooksSearchPageLoaded,
  } = useSelector(WebhooksState);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [isCurrentSiteReadOnly, setIsCurrentSiteReadonly] =
    useState(isSiteReadOnly);

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
  }, [currentSiteId]);

  const updateWebhooks = () => {
    dispatch(fetchWebhooks({ siteId: currentSiteId, limit: 20, page: 1 }));
  };

  const deleteWebhook = (webhookId: string, siteId: string) => {
    const deleteFunc = async () => {
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

  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('webhooksScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextWebhooksToken &&
      webhooksLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setWebhooksLoadingStatusPending());
      if (nextWebhooksToken) {
        await dispatch(
          fetchWebhooks({
            siteId: currentSiteId,
            nextToken: nextWebhooksToken,
            page: currentWebhooksSearchPage + 1,
            limit: 20,
          })
        );
      }
    }
  }, [
    nextWebhooksToken,
    webhooksLoadingStatus,
    isLastWebhooksSearchPageLoaded,
  ]);

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
        <title>Webhooks</title>
      </Helmet>
      <div className="p-4 max-w-screen-lg font-semibold">
        By posting an HTML web form or any other data to a webhook URL, FormKiQ
        will process that data and add it as a new document.
      </div>
      {!isCurrentSiteReadOnly && (
        <div className="my-4 flex px-4">
          <button
            className="flex bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold rounded-md flex cursor-pointer focus:outline-none py-2 px-4"
            data-test-id="create-webhook"
            onClick={(event) => onNewClick(event, currentSiteId)}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </button>
        </div>
      )}
      <div className="relative overflow-hidden h-full" id="webhooksWrapper">
        <WebhookList
          siteId={currentSiteId}
          webhooks={webhooks}
          onDelete={deleteWebhook}
          handleScroll={handleScroll}
        ></WebhookList>
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
