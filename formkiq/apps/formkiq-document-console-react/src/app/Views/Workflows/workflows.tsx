import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import DuplicateDialog from '../../Components/Generic/Dialogs/DuplicateDialog';
import { Plus } from '../../Components/Icons/icons';
import NewWorkflowModal from '../../Components/Workflows/NewWorkflow/newWorkflow';
import WorkflowList from '../../Components/Workflows/WorkflowList/WorkflowList';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import { AuthState } from '../../Store/reducers/auth';
import { openDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  deleteWorkflow,
  fetchWorkflows,
  setWorkflowsLoadingStatusPending,
  WorkflowsState,
} from '../../Store/reducers/workflows';
import { useAppDispatch } from '../../Store/store';
import RadioListbox from '../../Components/Generic/Listboxes/RadioListbox';
import {
  ConfigState,
  setWorkflowFilterPreference,
} from '../../Store/reducers/config';

export function Workflows() {
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
    workflows,
    workflowsLoadingStatus,
    nextToken,
    currentSearchPage,
    isLastSearchPageLoaded,
  } = useSelector(WorkflowsState);
  const { workflowFilterPreference } = useSelector(ConfigState);
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);

  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');

  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [duplicatedWorkflow, setDuplicatedWorkflow] = useState<any>({});
  const [showTooltipId, setShowTooltipId] = useState('');
  const [filteredWorkflows, setFilteredWorkflows] = useState<any[]>([]);

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
    if (workflowFilterPreference === 'active') {
      const newWorkflows = [...workflows].filter(
        (workflow) => workflow.status === 'ACTIVE'
      );
      setFilteredWorkflows(newWorkflows);
    } else if (workflowFilterPreference === 'inactive') {
        const newWorkflows = [...workflows].filter(
            (workflow) => workflow.status === 'INACTIVE'
        );
        setFilteredWorkflows(newWorkflows);
    } else {
        setFilteredWorkflows(workflows);
    }
  }, [workflows, workflowFilterPreference]);

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

  const updateWorkflows = async () => {
    dispatch(fetchWorkflows({ siteId: currentSiteId }));
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

  useEffect(() => {
    // Trigger scrolling in cases when table smaller than page after filtering and next page loading can't be triggered by scroll.
    const scrollpane = document.getElementById('workflowsScrollPane');
    const wrapper = document.getElementById('workflowsWrapper');
    if(!scrollpane || !wrapper) {
        return;
    }
    if (scrollpane.offsetHeight < wrapper.offsetHeight) {
        trackScrolling();
    }
  }, [filteredWorkflows]);

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
      dispatch(deleteWorkflow({ siteId, workflowId, workflows }));
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

  const handleDuplicate = (newName: string) => {
    const newWorkflow = { ...duplicatedWorkflow, name: newName };
    delete newWorkflow.workflowId;
    DocumentsService.addWorkflow(newWorkflow, newModalSiteId).then(() => {
      updateWorkflows();
    });
    setIsDuplicateDialogOpen(false);
  };

  const handleDuplicateClick = (workflowId: string, siteId: string) => {
    DocumentsService.getWorkflow(workflowId, siteId).then((response) => {
      if (response.name) {
        setNewModalSiteId(siteId);
        setOriginalName(response.name);
        setIsDuplicateDialogOpen(true);
        setDuplicatedWorkflow(response);
      }
    });
  };

  const handleCopyToClipBoard = (workflowId: string, siteId: string) => {
    DocumentsService.getWorkflow(workflowId, siteId).then((response) => {
      if (response.name) {
        navigator.clipboard.writeText(JSON.stringify(response, null, 2));
        setShowTooltipId(workflowId);
        setTimeout(() => {
          setShowTooltipId('');
        }, 2000);
      }
    });
  };

  const handleDownloadClick = (workflowId: string, siteId: string) => {
    DocumentsService.getWorkflow(workflowId, siteId).then((response) => {
      if (response.name) {
        const blob = new Blob([JSON.stringify(response, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${response.name}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const isValidString = (text: string) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const importWorkflow = (event: any) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0], 'UTF-8');
    reader.onload = (e) => {
      if (!isValidString(e.target?.result as string)) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Invalid JSON',
          })
        );
        event.target.value = '';
        return;
      }
      const workflow = JSON.parse(e.target?.result as string);
      DocumentsService.addWorkflow(workflow, siteId).then((response) => {
        if (!response.workflowId) {
          dispatch(
            openNotificationDialog({
              dialogTitle: response.errors[0].error,
            })
          );
          event.target.value = '';
          return;
        }

        window.location.href =
          siteId === 'default'
            ? `/workflows/designer?workflowId=${response.workflowId}`
            : `/workspaces/${siteId}/workflows/designer?workflowId=${response.workflowId}`;
        event.target.value = '';
      });
    };
  };

  return (
    <>
      <Helmet>
        <title>Workflows</title>
      </Helmet>

      <div
        className="flex"
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="grow flex flex-col justify-stretch">
          <div className="p-4 max-w-screen-lg font-semibold mb-4">
            <p>
              A workflow is a series of steps, which can be document actions or
              a queue step, where documents await manual action (such as an
              approval) inside of a document queue.
            </p>
            <p className="mt-4">
              NOTE: a workflow cannot be edited or deleted once it has been
              triggered by a document.
            </p>
          </div>
          {!isSiteReadOnly && (
            <div className="mb-4 flex px-4 gap-2">
              <ButtonPrimaryGradient
                data-test-id="create-workflow"
                onClick={createNewWorkflow}
                className="flex items-center"
                style={{ height: '36px' }}
              >
                <span>Create new</span>
                <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
              </ButtonPrimaryGradient>

              <input
                type="file"
                id={'import-workflow' + siteId}
                accept=".json"
                className="hidden"
                onChange={importWorkflow}
              />
              <label
                htmlFor={'import-workflow' + siteId}
                className="h-9 bg-white text-neutral-900 border border-primary-500 px-4 font-bold whitespace-nowrap hover:text-primary-500 transition duration-100 rounded-md flex items-center justify-center"
              >
                <span>Import (JSON)</span>
              </label>

              <button
                className="flex hidden bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold rounded-2xl flex cursor-pointer focus:outline-none py-2 px-4"
                data-test-id="create-workflow"
                onClick={(event) => onNewClick(event, siteId)}
              >
                <span>Create new (OLD)</span>
                <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
              </button>

              <RadioListbox
                values={['active', 'inactive', 'all']}
                titles={['Active', 'Inactive', 'All Workflows']}
                selectedValue={workflowFilterPreference}
                setSelectedValue={(val: 'active' | 'inactive' | 'all') => {
                  dispatch(setWorkflowFilterPreference(val));
                }}
              />
            </div>
          )}
          <div className="relative overflow-hidden h-full" id='workflowsWrapper'>
            <WorkflowList
              workflows={filteredWorkflows as []}
              onDelete={onWorkflowDelete}
              siteId={currentSiteId}
              handleScroll={handleScroll}
              handleDuplicateClick={handleDuplicateClick}
              handleCopyToClipBoard={handleCopyToClipBoard}
              showTooltipId={showTooltipId}
              handleDownloadClick={handleDownloadClick}
              isSiteReadOnly={isSiteReadOnly}
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
      <DuplicateDialog
        isOpen={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)} // Can also use a separate function for clarity
        onDuplicate={handleDuplicate}
        initialName={originalName} // Optionally provide the original name
      />
    </>
  );
}

export default Workflows;
