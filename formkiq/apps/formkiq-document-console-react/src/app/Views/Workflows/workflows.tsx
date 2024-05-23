import {useCallback, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {ArrowBottom, ArrowRight, Plus} from '../../Components/Icons/icons';
import NewWorkflowModal from '../../Components/Workflows/NewWorkflow/newWorkflow';
import WorkflowList from '../../Components/Workflows/WorkflowList/WorkflowList';
import {AuthState} from '../../Store/reducers/auth';
import {openDialog} from '../../Store/reducers/globalConfirmControls';
import {useAppDispatch} from '../../Store/store';
import {DocumentsService} from '../../helpers/services/documentsService';
import {useLocation, useNavigate} from "react-router-dom";
import {getCurrentSiteInfo, getUserSites} from "../../helpers/services/toolService";
import {DocumentListState, fetchDocuments} from "../../Store/reducers/documentsList";
import {
  deleteWorkflow,
  fetchWorkflows,
  setWorkflowsLoadingStatusPending,
  WorkflowsState
} from "../../Store/reducers/workflows";
import {RequestStatus} from "../../helpers/types/document";
import {openDialog as openNotificationDialog} from "../../Store/reducers/globalNotificationControls";
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";


type WorkflowItem = {
  siteId: string;
  readonly: boolean;
  workflows: [] | null;
};

export function Workflows() {
  const dispatch = useAppDispatch();
  const {user} = useSelector(AuthState);

  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {
    siteId,
    siteDocumentsRootUri,
    isSiteReadOnly,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const navigate = useNavigate();

  const {
    workflows,
    workflowsLoadingStatus,
    nextToken,
    currentSearchPage,
    isLastSearchPageLoaded
  } = useSelector(WorkflowsState);

  const [currentSiteId, setCurrentSiteId] = useState(siteId)
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);

  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');

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

  const onNewClick = (event: any, siteId: string) => {
    setNewModalSiteId(siteId);
    setNewModalOpened(true);
  };
  const onNewClose = () => {
    setNewModalOpened(false);
  };
  useEffect(() => {
    if (isNewModalOpened === false) {
      // TODO send update instead of hacky updateWorkflowExpansion
    }
  }, [isNewModalOpened]);

  useEffect(() => {
    updateWorkflows();
  }, [user, currentSiteId]);

  useEffect(() => {
    dispatch(
      fetchWorkflows({
        siteId: currentSiteId,
      })
    );
  }, [
    currentSiteId,
  ]);

  const updateWorkflows = async () => {
    dispatch(fetchWorkflows({siteId: currentSiteId}));
  };

  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('workflowsScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextToken &&
      workflowsLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setWorkflowsLoadingStatusPending());
      if (nextToken) {
        await dispatch(
          fetchWorkflows({
            siteId: currentSiteId,
            nextToken,
            page: currentSearchPage + 1,
          })
        );
      }
    }
  }, [nextToken, workflowsLoadingStatus, isLastSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  const onWorkflowDelete = (workflowId: string, siteId: string) => {
    const deleteFunc = async () => {
      dispatch(deleteWorkflow({siteId, workflowId, workflows}));
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this workflow?',
      })
    );
  };

  const createNewWorkflow = () => {
    const workflow = {
      name: 'New Workflow',
      description: 'New Workflow Description',
      status: 'ACTIVE',
      steps: [],
    };

    DocumentsService.addWorkflow(workflow, siteId).then((response) => {
      if (!response.workflowId) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Something went wrong. Please try again later',
          })
        );
      }

      window.location.href =
        siteId === 'default'
          ? `/workflows/designer?workflowId=${response.workflowId}`
          : `/workspaces/${siteId}/workflows/designer?workflowId=${response.workflowId}`;
    });
  };

  return (
    <>
      <Helmet>
        <title>Workflows</title>
      </Helmet>

      <div className="flex" style={{
        height: `calc(100vh - 3.68rem)`,
      }}>
        <div className="grow flex flex-col justify-stretch">
          <div className="p-4 max-w-screen-lg font-semibold mb-4">
            <p>
              A workflow is a series of steps, which can be document actions or a
              queue step, where documents await manual action (such as an approval)
              inside of a document queue.
            </p>
            <p className="mt-4">
              NOTE: a workflow cannot be edited or deleted once it has been
              triggered by a document.
            </p>
          </div>
          {!isSiteReadOnly && (
            <div className="mb-4 flex px-4">
              <ButtonPrimaryGradient
                data-test-id="create-workflow"
                onClick={createNewWorkflow}
                className="flex items-center"
                style={{height: '36px'}}
              >
                <span>Create new</span>
                <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
              </ButtonPrimaryGradient>
              <button
                className="flex hidden bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold rounded-2xl flex cursor-pointer focus:outline-none py-2 px-4"
                data-test-id="create-workflow"
                onClick={(event) => onNewClick(event, siteId)}
              >
                <span>Create new (OLD)</span>
                <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
              </button>
            </div>
          )}
          <div className="relative overflow-hidden h-full">
            <WorkflowList
              workflows={workflows as []}
              onDelete={onWorkflowDelete}
              siteId={currentSiteId}
              handleScroll={handleScroll}
            ></WorkflowList>
          </div>
        </div>
      </div>
      <NewWorkflowModal
        isOpened={isNewModalOpened}
        onClose={onNewClose}
        updateWorkflowExpansion={updateWorkflows}
        siteId={newModalSiteId}
      />
    </>
  );
}

export default Workflows;
