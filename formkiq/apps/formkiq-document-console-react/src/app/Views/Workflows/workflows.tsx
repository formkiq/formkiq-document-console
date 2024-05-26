import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import DuplicateDialog from '../../Components/Generic/Dialogs/DuplicateDialog';
import { ArrowBottom, ArrowRight } from '../../Components/Icons/icons';
import NewWorkflowModal from '../../Components/Workflows/NewWorkflow/newWorkflow';
import WorkflowList from '../../Components/Workflows/WorkflowList/WorkflowList';
import { AuthState } from '../../Store/reducers/auth';
import { openDialog } from '../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';

type WorkflowItem = {
  siteId: string;
  readonly: boolean;
  workflows: [] | null;
};

export function Workflows() {
  const dispatch = useAppDispatch();
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
  const [userSiteWorkflows, setUserSiteWorkflows] = useState(null);
  const [defaultSiteExpanded, setDefaultSiteExpanded] = useState(true);
  const [defaultSiteWorkflows, setDefaultSiteWorkflows] = useState(null);
  const [workspaceWorkflows, setWorkspaceWorkflows] = useState<WorkflowItem[]>(
    []
  );
  const [workspacesExpanded, setWorkspacesExpanded] = useState(false);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [newModalSiteId, setNewModalSiteId] = useState('default');

  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [duplicatedWorkflow, setDuplicatedWorkflow] = useState<any>({});
  const [showTooltipId, setShowTooltipId] = useState('');

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
      // TODO send update instead of hacky updateWorkflowExpansion
    }
  }, [isNewModalOpened]);

  useEffect(() => {
    updateWorkflows();
  }, [user]);

  const setWorkflows = (workflows: [], siteId: string, readonly: boolean) => {
    if (siteId === user?.email) {
      // NOTE: does not allow for a readonly user site
      setUserSiteWorkflows(workflows as any);
    } else if (siteId === 'default') {
      // NOTE: does not allow for a readonly default site
      setDefaultSiteWorkflows(workflows as any);
    }
  };

  const updateWorkflows = async () => {
    if (userSite) {
      let readonly = false;
      if (userSite.permission && userSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getWorkflows(userSite.siteId).then(
        (workflowsResponse: any) => {
          setWorkflows(workflowsResponse.workflows, userSite.siteId, readonly);
        }
      );
    }
    if (defaultSite) {
      let readonly = false;
      if (defaultSite.permission && defaultSite.permission === 'READ_ONLY') {
        readonly = true;
      }
      DocumentsService.getWorkflows(defaultSite.siteId).then(
        (workflowsResponse: any) => {
          setWorkflows(
            workflowsResponse.workflows,
            defaultSite.siteId,
            readonly
          );
        }
      );
    }
    if (workspaceSites.length > 0) {
      const initialWorkspaceWorkflowsPromises = workspaceSites.map((item) => {
        let readonly = false;
        if (item.permission && item.permission === 'READ_ONLY') {
          readonly = true;
        }
        return DocumentsService.getWorkflows(item.siteId).then(
          (workflowsResponse: any) => {
            return {
              workflows: workflowsResponse.workflows,
              siteId: item.siteId,
              readonly,
            };
          }
        );
      });

      Promise.all(initialWorkspaceWorkflowsPromises)
        .then((initialWorkspaceWorkflows) => {
          setWorkspaceWorkflows(initialWorkspaceWorkflows);
        })
        .catch((error) => {
          // Handle any errors that occurred during the requests
          console.error('Error fetching workflows:', error);
        });
    }
  };

  const deleteWorkflow = (workflowId: string, siteId: string) => {
    const deleteFunc = async () => {
      setUserSiteWorkflows(null);
      await DocumentsService.deleteWorkflow(workflowId, siteId).then(
        (workflowsResponse: any) => {
          updateWorkflows();
        }
      );
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this workflow?',
      })
    );
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

  return (
    <>
      <Helmet>
        <title>Workflows</title>
      </Helmet>
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
      <div className="p-4 mb-20">
        {userSite && (
          <>
            <div
              className="w-full flex self-start text-neutral-900 hover:text-neutral-600 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleUserSiteExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {userSiteExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">
                Workflows: My Documents
                <span className="block normal-case">
                  {' '}
                  (Site ID: {userSite.siteId})
                </span>
              </div>
            </div>
            {userSiteExpanded && (
              <WorkflowList
                siteId={userSite.siteId}
                workflows={userSiteWorkflows}
                isSiteReadOnly={userSite.readonly}
                onDelete={deleteWorkflow}
                onNewClick={onNewClick}
                handleDuplicateClick={handleDuplicateClick}
                handleCopyToClipBoard={handleCopyToClipBoard}
                showTooltipId={showTooltipId}
                handleDownloadClick={handleDownloadClick}
              ></WorkflowList>
            )}
          </>
        )}
        {defaultSite && defaultSite.siteId && (
          <>
            <div
              className="w-full flex self-start text-neutral-900 hover:text-neutral-600 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleDefaultSiteExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {defaultSiteExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">
                {userSite ? (
                  <span>
                    Workflows: Team Documents
                    <span className="block normal-case">
                      (Site ID: default)
                    </span>
                  </span>
                ) : (
                  <span>
                    Workflows: Documents
                    <span className="block normal-case">
                      (Site ID: default)
                    </span>
                  </span>
                )}
              </div>
            </div>
            {defaultSiteExpanded && (
              <WorkflowList
                workflows={defaultSiteWorkflows}
                onDelete={deleteWorkflow}
                siteId={defaultSite.siteId}
                isSiteReadOnly={defaultSite.readonly}
                onNewClick={onNewClick}
                handleDuplicateClick={handleDuplicateClick}
                handleCopyToClipBoard={handleCopyToClipBoard}
                showTooltipId={showTooltipId}
                handleDownloadClick={handleDownloadClick}
              ></WorkflowList>
            )}
          </>
        )}
        {workspaceSites.length > 0 && (
          <>
            <div
              className="w-full flex self-start text-neutral-900 hover:text-neutral-600 justify-center lg:justify-start whitespace-nowrap px-2 py-2 cursor-pointer"
              onClick={toggleWorkspacesExpand}
            >
              <div className="flex justify-end mt-3 mr-1">
                {workspacesExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="pl-1 uppercase text-base">
                Workflows: Workspaces
              </div>
            </div>
            {workspacesExpanded &&
              workspaceWorkflows.map((item: WorkflowItem, i: number) => {
                return (
                  <div key={i}>
                    <div className="mt-4 ml-4 flex flex-wrap w-full">
                      <div className="pl-1 uppercase text-sm">
                        Workflows:{' '}
                        <span className="normal-case">{item.siteId}</span>
                      </div>
                    </div>
                    <div className="mt-4 ml-4">
                      <WorkflowList
                        workflows={item.workflows}
                        siteId={item.siteId}
                        isSiteReadOnly={item.readonly}
                        onDelete={deleteWorkflow}
                        onNewClick={onNewClick}
                        handleDuplicateClick={handleDuplicateClick}
                        handleCopyToClipBoard={handleCopyToClipBoard}
                        showTooltipId={showTooltipId}
                        handleDownloadClick={handleDownloadClick}
                      ></WorkflowList>
                    </div>
                  </div>
                );
              })}
          </>
        )}
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
