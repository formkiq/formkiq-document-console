import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthState, logout } from '../../Store/reducers/auth';
import { ConfigState } from '../../Store/reducers/config';
import {
  DataCacheState,
  setCurrentDocument,
  setCurrentDocumentPath,
} from '../../Store/reducers/data';
import {
  fetchDocuments,
  setDocuments,
} from '../../Store/reducers/documentsList';
import { useAppDispatch } from '../../Store/store';
import {
  InlineEditableContentTypes,
  TextFileEditorEditableContentTypes,
} from '../../helpers/constants/contentTypes';
import { TopLevelFolders } from '../../helpers/constants/folders';
import {
  AdminPrefixes,
  DocumentsAndFoldersPrefixes,
  WorkflowsAndIntegrationsPrefixes,
} from '../../helpers/constants/pagePrefixes';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { IDocument } from '../../helpers/types/document';
import { ILine } from '../../helpers/types/line';
import { useQueueId } from '../../hooks/queue-id.hook';
import { useSubfolderUri } from '../../hooks/subfolder-uri.hook';
import { useDocumentActions } from '../DocumentsAndFolders/DocumentActionsPopover/DocumentActionsContext';
import DocumentActionsModalContainer from '../DocumentsAndFolders/DocumentActionsPopover/DocumentActionsModalContainer';
import DocumentActionsPopover from '../DocumentsAndFolders/DocumentActionsPopover/documentActionsPopover';
import SearchInput from '../DocumentsAndFolders/Search/searchInput';
import ButtonPrimary from '../Generic/Buttons/ButtonPrimary';
import ButtonTertiary from '../Generic/Buttons/ButtonTertiary';
import {
  Admin,
  Api,
  ApiKey,
  Attribute,
  Bell,
  ChevronDown,
  Documents,
  Examine,
  Group,
  HistoryIcon,
  Mapping,
  Queue,
  Recent,
  Rules,
  Schema,
  Settings,
  Share,
  ShareHand,
  SitesManagement,
  Star,
  Trash,
  Users,
  Webhook,
  Workflow,
  Workspace,
} from '../Icons/icons';
import Notifications from './notifications';

const documentSubpaths: string[] = ['folders', 'settings', 'help', 'new'];

const getTopLevelFolderName = (folder: string) => {
  switch (folder) {
    case 'shared':
      return 'Shared with me';
    case 'favorites':
      return 'Favorites';
    case 'recent':
      return 'Recent';
    case 'deleted':
      return 'Trash';
    default:
      return '';
  }
};

function Navbar() {
  const search = useLocation().search;
  const searchWord = new URLSearchParams(search).get('searchWord');
  const advancedSearch = new URLSearchParams(search).get('advancedSearch');
  const searchFolder = new URLSearchParams(search).get('searchFolder');
  const filterTag = new URLSearchParams(search).get('filterTag');
  const filterAttribute = new URLSearchParams(search).get('filterAttribute');
  const searchParams = new URLSearchParams(search);
  const queueId = useQueueId();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(AuthState);
  const {
    formkiqVersion,
    useIndividualSharing,
    useCollections,
    useSoftDelete,
    useNotifications,
    isSidebarExpanded,
  } = useSelector(ConfigState);
  const { currentDocumentPath, currentDocument } = useSelector(DataCacheState);

  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { hash } = useLocation();
  const {
    siteId,
    siteDocumentsRootUri,
    siteDocumentsRootName,
    isSiteReadOnly,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [infoDocumentId, setInfoDocumentId] = useState('');

  const subfolderUri = useSubfolderUri();

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    setCurrentSiteId(recheckSiteInfo.siteId);
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
  }, [pathname]);

  const [showAccountDropdown, setShowAccountDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    React.useState(false);

  const location = useLocation();
  const { onSubmitForReviewModalClick, onDocumentReviewModalClick } =
    useDocumentActions();

  const locationPrefix = useMemo(() => {
    let locationPrefix = decodeURI(location.pathname);
    if (locationPrefix.indexOf('/', 1) > -1) {
      locationPrefix = locationPrefix.substring(
        0,
        locationPrefix.indexOf('/', 1)
      );
    }
    return locationPrefix;
  }, [location]);

  const currentSection = useMemo(() => {
    if (DocumentsAndFoldersPrefixes.indexOf(locationPrefix) > -1) {
      return 'DocumentsAndFolders';
    } else if (WorkflowsAndIntegrationsPrefixes.indexOf(locationPrefix) > -1) {
      return 'WorkflowsAndIntegrations';
    } else if (AdminPrefixes.indexOf(locationPrefix) > -1) {
      return 'AccountAndSettings';
    }

    return 'DocumentsAndFolders';
  }, [locationPrefix]);

  const [inputValue, setInput] = useState('');

  let documentId = '';
  const documentViewPath = matchPath(
    { path: `${siteDocumentsRootUri}/:id/*` },
    decodeURI(window.location.pathname)
  ) as any;
  if (
    documentViewPath &&
    documentViewPath.params &&
    documentViewPath.params.id
  ) {
    if (documentSubpaths.indexOf(documentViewPath.params.id) === -1) {
      documentId = documentViewPath.params.id;
    }
  }
  useEffect(() => {
    setInput(searchWord ? searchWord : '');
  }, [search]);

  const redirectToSearchPage = () => {
    if (inputValue) {
      navigate(
        {
          pathname: currentDocumentsRootUri,
          search: `?searchWord=${inputValue}`,
        },
        {
          replace: true,
        }
      );
    }
  };
  const handleKeyDown = (ev: any) => {
    if (inputValue) {
      if (ev.key === 'Enter') {
        redirectToSearchPage();
      }
    }
  };

  const ToggleAccountSettings = () =>
    setShowAccountDropdown(!showAccountDropdown);
  const ToggleNotifications = () =>
    setShowNotificationsDropdown(!showNotificationsDropdown);
  const signOut = () => {
    dispatch(logout());
    ToggleAccountSettings();
  };

  const updateInputValue = (event: any) => {
    const val: string = event.target.value;
    setInput(val);
  };

  const ParseEmailInitials = () => {
    if (user) {
      const emailUsername = user?.email.substring(0, user?.email.indexOf('@'));
      const emailParts = emailUsername.split('.');
      let initials = '';
      emailParts.forEach((part: string) => {
        initials += part[0];
      });
      initials = initials.substring(0, 3).toUpperCase();
      return <>{initials}</>;
    }
    return <></>;
  };

  const changeSystemSubfolder = (event: any, systemSubfolderUri: string) => {
    const newSiteId = event.target.options[event.target.selectedIndex].value;
    let newDocumentsRootUri = '/documents';
    if (newSiteId === user?.email) {
      newDocumentsRootUri = '/my-documents';
    } else if (newSiteId === 'default' && hasUserSite) {
      newDocumentsRootUri = '/team-documents';
    } else {
      newDocumentsRootUri = '/workspaces/' + newSiteId;
    }
    navigate(
      {
        pathname: `${newDocumentsRootUri}/folders/${systemSubfolderUri}`,
      },
      {
        replace: true,
      }
    );
  };

  const changeSiteId = (event: any) => {
    const newSiteId = event.target.options[event.target.selectedIndex].value;

    const pathWithoutSubfolder = location.pathname.split('/')[1];
    const pathWithSubfolder =
      location.pathname.split('/')[1] + '/' + location.pathname.split('/')[2];
    const pathsWithSubfolder: string[] = [
      'admin/api-keys',
      'admin/user-activities',
      'orchestrations/webhooks',
    ];

    let newDocumentsRootUri;

    let path = pathWithoutSubfolder;
    if (pathsWithSubfolder.indexOf(pathWithSubfolder) !== -1) {
      path = pathWithSubfolder;
    }
    if (newSiteId === user?.email) {
      newDocumentsRootUri = path;
    } else if (newSiteId === 'default') {
      newDocumentsRootUri = path;
    } else {
      newDocumentsRootUri = path + '/workspaces/' + newSiteId;
    }
    navigate(
      {
        pathname: `${newDocumentsRootUri}`,
      },
      {
        replace: true,
      }
    );
  };

  const DownloadDocument = () => {
    if (documentId.length) {
      DocumentsService.getDocumentUrl(
        documentId,
        currentSiteId,
        '',
        false
      ).then((urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      });
    }
  };

  const [hasDocumentVersions, setHasDocumentVersions] = useState(false);
  const [hasInProgressWorkflow, setHasInProgressWorkflow] = useState(false);

  useEffect(() => {
    DocumentsService.getDocumentVersions(documentId, currentSiteId).then(
      (response: any) => {
        if (response.documents && response.documents.length > 0) {
          setHasDocumentVersions(true);
        } else {
          setHasDocumentVersions(false);
        }
      }
    );
    if (documentId.length) {
      DocumentsService.getWorkflowsInDocument(currentSiteId, documentId).then(
        (response: any) => {
          if (response.workflows?.length) {
            const inProgressWorkflows = response.workflows.filter(
              (workflow: any) => {
                if (workflow.status === 'IN_PROGRESS') {
                  return true;
                } else {
                  return false;
                }
              }
            );
            if (inProgressWorkflows.length > 0) {
              setHasInProgressWorkflow(true);
            } else {
              setHasInProgressWorkflow(false);
            }
          } else {
            setHasInProgressWorkflow(false);
          }
        }
      );
    } else {
      setHasInProgressWorkflow(false);
    }
  }, [documentId]);

  const viewFolder = (event: any, action = '') => {
    dispatch(setDocuments({ documents: [] }));
    navigate(
      {
        pathname:
          siteDocumentsRootUri +
          '/folders/' +
          currentDocumentPath.substring(
            0,
            currentDocumentPath.lastIndexOf('/')
          ) +
          '?scrollToDocumentLine=true' +
          '#id=' +
          documentId +
          '&action=' +
          action,
      },
      {
        replace: true,
      }
    );
  };

  const editDocument = () => {
    navigate(
      {
        pathname: pathname.replace(/\/view$/, '/edit'),
      },
      {
        replace: true,
      }
    );
  };

  const viewDocument = () => {
    navigate(
      {
        pathname: pathname.replace(/\/edit$/, '/view'),
      },
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    if (hash.indexOf('#id=') > -1) {
      setInfoDocumentId(hash.substring(4));
    } else if (hash.indexOf('#history_id') > -1) {
      setInfoDocumentId(hash.substring(12));
    } else {
      setInfoDocumentId('');
    }
  }, [hash]);

  const expandAdvancedSearch = () => {
    searchParams.set('advancedSearch', 'visible');
    navigate(
      {
        pathname:
          pathname +
          '?' +
          searchParams.toString() +
          (infoDocumentId.length > 0 ? `#id=${infoDocumentId}` : ''),
      },
      {
        replace: true,
      }
    );
  };

  const onDocumentDataChange = (event: any, value: ILine | null) => {
    if (currentSection === 'DocumentsAndFolders') {
      dispatch(setDocuments({ documents: null }));
      dispatch(
        fetchDocuments({
          siteId: currentSiteId,
          formkiqVersion,
          searchWord,
          searchFolder,
          queueId,
          subfolderUri,
          filterTag,
          filterAttribute,
        })
      );
    }

    if (!currentDocument) return;
    DocumentsService.getDocumentById(
      (currentDocument as IDocument).documentId,
      currentSiteId
    ).then((response: IDocument) => {
      if (response) {
        dispatch(setCurrentDocument(response));
        dispatch(setCurrentDocumentPath(response.path));
      } else {
        navigate(
          {
            pathname: siteDocumentsRootUri,
          },
          {
            replace: true,
          }
        );
      }
    });
  };

  return (
    user && (
      <div className="flex w-full h-14.5">
        {useNotifications && showNotificationsDropdown && (
          <>{Notifications(ToggleNotifications)}</>
        )}
        <div className="flex grow relative flex-wrap items-start">
          <div
            className={
              (isSidebarExpanded ? 'left-64' : 'left-16') +
              ' flex fixed top-0 right-0 z-20 h-14.5 items-center justify-between bg-white border-b  border-neutral-300'
            }
          >
            <div className="w-7/8 flex">
              <div
                className={'flex ' + (documentId.length ? 'w-full' : 'w-2/3')}
              >
                {!isSidebarExpanded && (
                  <div className="w-40">
                    <div className="absolute top-0 pt-2">
                      <div className="p-2 w-logoCollapsed h-logoCollapsed flex items-center">
                        <picture>
                          <source
                            srcSet="/assets/img/png/brand-logo-small.png"
                            type="image/png"
                          />
                          <img src="/assets/img/png/brand-logo-small.png" />
                        </picture>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={
                    (isSidebarExpanded ? 'w-full' : 'grow') +
                    ' flex items-center pl-5'
                  }
                >
                  {subfolderUri &&
                  TopLevelFolders.indexOf(subfolderUri) > -1 ? (
                    <>
                      <div className="w-6 mr-1 text-primary-600">
                        {subfolderUri === 'shared' && (
                          <div className="w-6">
                            <Share />
                          </div>
                        )}
                        {subfolderUri === 'favorites' && (
                          <div className="w-5">
                            <Star />
                          </div>
                        )}
                        {subfolderUri === 'recent' && (
                          <div className="w-6">
                            <Recent />
                          </div>
                        )}
                        {subfolderUri === 'deleted' && (
                          <div className="w-4">
                            <Trash />
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                        {getTopLevelFolderName(subfolderUri)}
                      </div>
                      {((hasUserSite && hasDefaultSite) ||
                        (hasUserSite && hasWorkspaces) ||
                        (hasDefaultSite && hasWorkspaces) ||
                        (hasWorkspaces && workspaceSites.length > 1)) && (
                        <div className="flex">
                          <span className="text-xs pt-1 pl-4 pr-1 justify-end">
                            Workspace:
                          </span>
                          <select
                            data-test-id="system-subfolder-select"
                            className="text-xs bg-gray-100 px-2 py-1 pr-8 rounded-md"
                            value={currentSiteId}
                            onChange={(event) => {
                              changeSystemSubfolder(event, subfolderUri);
                            }}
                          >
                            {hasUserSite && (
                              <option value={user?.email}>My Documents</option>
                            )}
                            {hasUserSite && hasDefaultSite && (
                              <option value="default">
                                Team Documents (default)
                              </option>
                            )}
                            {!hasUserSite && hasDefaultSite && (
                              <option value="default">
                                Documents (default)
                              </option>
                            )}
                            {hasWorkspaces && workspaceSites.length > 0 && (
                              <>
                                {workspaceSites.map(
                                  (workspaceSite, i: number) => {
                                    return (
                                      <option
                                        key={i}
                                        value={workspaceSite.siteId}
                                      >
                                        {workspaceSite.siteId}
                                      </option>
                                    );
                                  }
                                )}
                              </>
                            )}
                          </select>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {locationPrefix === '/workflows' ||
                      locationPrefix === '/queues' ||
                      locationPrefix === '/orchestrations' ||
                      locationPrefix === '/schemas' ||
                      locationPrefix === '/object-examine-tool' ||
                      locationPrefix === '/rulesets' ||
                      locationPrefix === '/admin' ||
                      locationPrefix === '/attributes' ||
                      locationPrefix === '/mappings' ? (
                        <>
                          <div className="w-6 mr-1 text-primary-600">
                            {pathname.indexOf('/workflows') > -1 && (
                              <div className="w-5">
                                <Workflow />
                              </div>
                            )}
                            {pathname.indexOf('/queues') > -1 && (
                              <div className="w-5">
                                <Queue />
                              </div>
                            )}
                            {pathname.indexOf('/rulesets') > -1 && (
                              <div className="w-5">
                                <Rules />
                              </div>
                            )}
                            {pathname.indexOf('/schemas') > -1 && (
                              <div className="w-5">
                                <Schema />
                              </div>
                            )}
                            {pathname.indexOf('/object-examine-tool') > -1 && (
                              <div className="w-5">
                                <Examine />
                              </div>
                            )}

                            {pathname.indexOf('/orchestrations/api') > -1 && (
                              <div className="w-5">
                                <Api />
                              </div>
                            )}
                            {pathname.indexOf('/orchestrations/webhooks') >
                              -1 && (
                              <div className="w-5">
                                <Webhook />
                              </div>
                            )}

                            {pathname.indexOf('/admin/settings') > -1 && (
                              <div className="w-5">
                                <Settings />
                              </div>
                            )}
                            {pathname.indexOf('/admin/api-keys') > -1 && (
                              <div className="w-5">
                                <ApiKey />
                              </div>
                            )}
                            {pathname.indexOf('/admin/user-activities') >
                              -1 && (
                              <div className="w-5">
                                <HistoryIcon />
                              </div>
                            )}
                            {pathname.indexOf('/admin/access-control') > -1 && (
                              <div className="w-5">
                                <Admin />
                              </div>
                            )}
                            {pathname.indexOf('/admin/sites-management') >
                              -1 && (
                              <div className="w-5">
                                <SitesManagement />
                              </div>
                            )}
                            {pathname.indexOf('/admin/groups') > -1 && (
                              <div className="w-5">
                                <Group />
                              </div>
                            )}
                            {pathname.indexOf('/admin/users') > -1 && (
                              <div className="w-5">
                                <Users />
                              </div>
                            )}
                            {pathname.indexOf('/attributes') > -1 && (
                              <div className="w-5">
                                <Attribute />
                              </div>
                            )}
                            {pathname.indexOf('/mappings') > -1 && (
                              <div className="w-5">
                                <Mapping />
                              </div>
                            )}
                          </div>

                          <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 ">
                            {pathname.indexOf('/workflows') > -1 && (
                              <span>Workflows</span>
                            )}
                            {pathname.indexOf('/queues') > -1 && (
                              <span>Queues</span>
                            )}
                            {pathname.indexOf('/orchestrations/api') > -1 && (
                              <span>API Explorer</span>
                            )}
                            {pathname.indexOf('/object-examine-tool') > -1 && (
                              <span>Examine PDF</span>
                            )}
                            {pathname.indexOf('/orchestrations/webhooks') >
                              -1 && <span>Inbound Webhooks</span>}
                            {pathname.indexOf('/admin/settings') > -1 && (
                              <span>Settings</span>
                            )}
                            {pathname.indexOf('/admin/api-keys') > -1 && (
                              <span>API Keys</span>
                            )}
                            {pathname.indexOf('/admin/user-activities') >
                              -1 && <span>User Activities</span>}
                            {pathname.indexOf('/admin/access-control') > -1 && (
                              <span>Access Control (OPA)</span>
                            )}
                            {pathname.indexOf('/admin/sites-management') >
                              -1 && <span>Sites Management</span>}
                            {pathname.indexOf('/schemas') > -1 && (
                              <span>Schemas</span>
                            )}
                            {pathname.indexOf('/admin/groups') > -1 && (
                              <span>Groups</span>
                            )}
                            {pathname.indexOf('/admin/users') > -1 && (
                              <span>Users</span>
                            )}
                            {pathname.indexOf('/rulesets') > -1 && (
                              <span>Rulesets</span>
                            )}
                            {pathname.indexOf('/attributes') > -1 && (
                              <span>Attributes</span>
                            )}
                            {pathname.indexOf('/mappings') > -1 && (
                              <span>Mappings</span>
                            )}
                          </div>
                          {(pathname.indexOf('/rulesets') > -1 ||
                            pathname.indexOf('/schemas') > -1 ||
                            pathname.indexOf('/workflows') > -1 ||
                            pathname.indexOf('/admin/api-keys') > -1 ||
                            pathname.indexOf('/admin/user-activities') > -1 ||
                            pathname.indexOf('/queues') > -1 ||
                            pathname.indexOf('/attributes') > -1 ||
                            pathname.indexOf('/mappings') > -1 ||
                            pathname.indexOf('/orchestrations/webhooks') >
                              -1) &&
                            ((hasUserSite && hasDefaultSite) ||
                              (hasUserSite && hasWorkspaces) ||
                              (hasDefaultSite && hasWorkspaces) ||
                              (hasWorkspaces && workspaceSites.length > 1)) && (
                              <div className="flex">
                                <span className="text-xs pt-1 pl-4 pr-1 justify-end">
                                  Workspace:
                                </span>
                                <select
                                  data-test-id="system-subfolder-select"
                                  className="text-xs bg-gray-100 px-2 py-1 pr-8 rounded-md"
                                  value={currentSiteId}
                                  onChange={(event) => {
                                    changeSiteId(event);
                                  }}
                                >
                                  {hasUserSite && (
                                    <option value={user?.email}>
                                      My Documents
                                    </option>
                                  )}
                                  {hasUserSite && hasDefaultSite && (
                                    <option value="default">
                                      Team Documents (default)
                                    </option>
                                  )}
                                  {!hasUserSite && hasDefaultSite && (
                                    <option value="default">
                                      Documents (default)
                                    </option>
                                  )}
                                  {hasWorkspaces && workspaceSites.length > 0 && (
                                    <>
                                      {workspaceSites.map(
                                        (workspaceSite, i: number) => {
                                          return (
                                            <option
                                              key={i}
                                              value={workspaceSite.siteId}
                                            >
                                              {workspaceSite.siteId}
                                            </option>
                                          );
                                        }
                                      )}
                                    </>
                                  )}
                                </select>
                              </div>
                            )}
                        </>
                      ) : (
                        <>
                          <div className="w-6 mr-1 text-primary-600">
                            {siteDocumentsRootUri.indexOf('/documents') >
                              -1 && (
                              <div className="w-6">
                                <Documents />
                              </div>
                            )}
                            {siteDocumentsRootUri.indexOf('/my-documents') >
                              -1 && (
                              <div className="w-5">
                                <Documents />
                              </div>
                            )}
                            {siteDocumentsRootUri.indexOf('/team-documents') >
                              -1 && (
                              <div className="w-6 flex flex-wrap items-center mr-2">
                                <div className="w-4">
                                  <Documents />
                                </div>
                                <div className="w-5 -mt-3 -ml-0.5">
                                  <ShareHand />
                                </div>
                              </div>
                            )}
                            {siteDocumentsRootUri.indexOf('/workspaces/') >
                              -1 && (
                              <div className="w-6 flex flex-wrap items-center mr-2">
                                <div className="w-6">
                                  <Workspace />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 ">
                            {pathname.indexOf('documents/queues/') > 0 ? (
                              <>
                                {pathname.indexOf(
                                  '1ddb4cbb-43be-482f-9de7-c15401a4553b'
                                ) > 0 && <span>Queue: Document Approval</span>}
                                {pathname.indexOf(
                                  '3fddbc42-dbe5-4aba-b9fe-58b0fefdce6e'
                                ) > 0 && (
                                  <span>
                                    Queue: Financial Document Intake Review
                                  </span>
                                )}
                                {pathname.indexOf(
                                  '1ddb4cbb-43be-482f-9de7-c15401a4553b'
                                ) === -1 &&
                                  pathname.indexOf(
                                    '3fddbc42-dbe5-4aba-b9fe-58b0fefdce6e'
                                  ) === -1 && <span>Queue</span>}
                              </>
                            ) : (
                              <>{siteDocumentsRootName}</>
                            )}
                            {documentId && currentDocumentPath?.length ? (
                              <span>
                                <span className="px-2">|</span>
                                {currentDocumentPath}
                                <span className="px-2"></span>
                                {hasInProgressWorkflow ? (
                                  <>
                                    <ButtonPrimary
                                      className={
                                        'text-small font-bold mx-2 px-4 cursor-pointer whitespace-nowrap'
                                      }
                                      onClick={(event: any) =>
                                        onDocumentReviewModalClick(event, {
                                          lineType: 'document',
                                          documentId: documentId,
                                          folder: currentDocumentPath.substring(
                                            0,
                                            currentDocumentPath.lastIndexOf('/')
                                          ),
                                          documentInstance: currentDocument,
                                        })
                                      }
                                    >
                                      Submit Document Review
                                    </ButtonPrimary>
                                    <ButtonTertiary
                                      className={
                                        'text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap'
                                      }
                                      onClick={(e: any) => viewFolder(e, '')}
                                    >
                                      View in Folder
                                    </ButtonTertiary>
                                  </>
                                ) : (
                                  <>
                                    <ButtonTertiary
                                      className={
                                        'text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap'
                                      }
                                      onClick={(e: any) => viewFolder(e, '')}
                                    >
                                      View in Folder
                                    </ButtonTertiary>
                                    <ButtonTertiary
                                      className={
                                        'text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap'
                                      }
                                      onClick={DownloadDocument}
                                    >
                                      Download
                                    </ButtonTertiary>
                                    <ButtonTertiary
                                      className={
                                        'text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap'
                                      }
                                      onClick={(event: any) =>
                                        onSubmitForReviewModalClick(event, {
                                          lineType: 'document',
                                          documentId: documentId,
                                          folder: currentDocumentPath.substring(
                                            0,
                                            currentDocumentPath.lastIndexOf('/')
                                          ),
                                          documentInstance: currentDocument,
                                        })
                                      }
                                    >
                                      Submit for Review
                                    </ButtonTertiary>
                                    {hasDocumentVersions && (
                                      <ButtonTertiary
                                        className={
                                          'hidden text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap'
                                        }
                                        onClick={(e: any) =>
                                          viewFolder(e, 'history')
                                        }
                                      >
                                        View Versions
                                      </ButtonTertiary>
                                    )}
                                  </>
                                )}

                                {!isSiteReadOnly &&
                                  currentDocument &&
                                  (InlineEditableContentTypes.indexOf(
                                    currentDocument.contentType
                                  ) > -1 ||
                                    TextFileEditorEditableContentTypes.indexOf(
                                      currentDocument.contentType
                                    ) > -1) && (
                                    <>
                                      {pathname.indexOf('/view') > -1 && (
                                        <ButtonTertiary
                                          className="text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap"
                                          onClick={editDocument}
                                        >
                                          Edit Document
                                        </ButtonTertiary>
                                      )}
                                      {pathname.indexOf('/edit') > -1 && (
                                        <ButtonTertiary
                                          className="text-smaller font-semibold mx-2 px-2 cursor-pointer whitespace-nowrap"
                                          onClick={viewDocument}
                                        >
                                          View Document
                                        </ButtonTertiary>
                                      )}
                                    </>
                                  )}

                                {documentId &&
                                  currentDocumentPath?.length &&
                                  currentDocument && (
                                    <div className="w-5 h-5 text-neutral-900 inline-flex mx-2 pt-2 items-end">
                                      <DocumentActionsPopover
                                        value={{
                                          lineType: 'document',
                                          folder: currentDocument
                                            ? (
                                                currentDocument as IDocument
                                              ).path
                                                .split('/')
                                                .slice(0, -1)
                                                .join('/')
                                            : '',
                                          documentId: (
                                            currentDocument as IDocument
                                          ).documentId,
                                          documentInstance: currentDocument,
                                        }}
                                        siteId={siteId}
                                        isSiteReadOnly={isSiteReadOnly}
                                        formkiqVersion={formkiqVersion}
                                        useIndividualSharing={
                                          useIndividualSharing
                                        }
                                        useCollections={useCollections}
                                        useSoftDelete={useSoftDelete}
                                        isDeeplinkPath={
                                          (currentDocument as IDocument)
                                            ?.deepLinkPath &&
                                          (currentDocument as IDocument)
                                            .deepLinkPath.length > 0
                                        }
                                      />
                                    </div>
                                  )}
                              </span>
                            ) : (
                              <span></span>
                            )}
                            {searchWord && (
                              <span>
                                <span className="px-2">-</span>
                                Search Results
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              {!documentId.length &&
                currentSection === 'DocumentsAndFolders' &&
                !advancedSearch && (
                  <div className="flex items-center gap-5 w-1/2">
                    <SearchInput
                      onChange={updateInputValue}
                      onKeyDown={handleKeyDown}
                      siteId={currentSiteId}
                      documentsRootUri={currentDocumentsRootUri}
                      value={inputValue}
                      expandAdvancedSearch={expandAdvancedSearch}
                    />
                  </div>
                )}
              {advancedSearch &&
                advancedSearch === 'hidden' &&
                (formkiqVersion.modules.includes('typesense') ||
                  formkiqVersion.modules.includes('opensearch')) && (
                  <button
                    onClick={expandAdvancedSearch}
                    className="text-sm flex gap-2 h-4 items-center font-bold text-gray-500 hover:text-primary-500 cursor-pointer whitespace-nowrap"
                  >
                    Expand Search Tab
                    <ChevronDown />
                  </button>
                )}
            </div>
            <div className="w-1/4 flex justify-end mr-16">
              {useNotifications && (
                <span
                  className="mt-0.5 mr-4 w-4 cursor-pointer"
                  onClick={ToggleNotifications}
                >
                  {Bell()}
                </span>
              )}
              <div className="justify-center hidden lg:flex items-center">
                <div className="dropdown -mt-1 relative">
                  <button
                    className="w-8 h-8 rounded-full aspect-square bg-gray-400 text-white font-bold focus:ring-2 focus:ring-primary-500 transition"
                    type="button"
                    data-bs-toggle="dropdown"
                    data-test-id="profile"
                    aria-expanded="false"
                    onClick={ToggleAccountSettings}
                  >
                    <ParseEmailInitials />
                  </button>
                  {showAccountDropdown && (
                    <ul className="dropdown-menu min-w-max absolute bg-white right-0 text-base z-50 float-right list-none text-left rounded-lg border  border-neutral-300 mt-2.5">
                      <li>
                        <Link
                          onClick={signOut}
                          to="/sign-out"
                          data-test-id="sign-out"
                          className="dropdown-item text-sm py-2 px-5 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 transition"
                        >
                          Sign out
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              <button className="lg:hidden">
                <div className="w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <DocumentActionsModalContainer
          currentSiteId={currentSiteId}
          isSiteReadOnly={isSiteReadOnly}
          currentDocumentsRootUri={currentDocumentsRootUri}
          onDocumentDataChange={onDocumentDataChange}
        />
      </div>
    )
  );
}

export default Navbar;
