import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthState } from '../../Store/reducers/auth';
import {
  ConfigState,
  setCurrentActionEvent,
  setIsSidebarExpanded,
  setIsWorkspacesExpanded,
} from '../../Store/reducers/config';
import { DocumentListState } from '../../Store/reducers/documentsList';
import { useAppDispatch } from '../../Store/store';
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
import { IFolder } from '../../helpers/types/folder';
import { useSubfolderUri } from '../../hooks/subfolder-uri.hook';
import FolderDropWrapper from '../DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import ButtonPrimaryGradient from '../Generic/Buttons/ButtonPrimaryGradient';
import ButtonTertiary from '../Generic/Buttons/ButtonTertiary';
import {
  AccessControl,
  Api,
  ApiKey,
  ArrowBottom,
  ArrowRight,
  Attribute,
  ChevronLeft,
  ChevronRight,
  Documents,
  Examine,
  FolderOutline,
  Group, Mapping,
  Plus,
  Queue,
  Rules,
  Schema,
  Settings,
  ShareHand,
  Star,
  Trash,
  Upload,
  Users,
  Webhook,
  Workflow,
  Workspace,
} from '../Icons/icons';
import WorkspacesModal from './workspacesModal';

export function Sidebar() {
  const dispatch = useAppDispatch();

  const { user } = useSelector(AuthState);
  const { folders } = useSelector(DocumentListState);
  const {
    formkiqVersion,
    useSoftDelete,
    isSidebarExpanded,
    isWorkspacesExpanded,
    userAuthenticationType,
  } = useSelector(ConfigState);

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

  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [specialFoldersRootUri, setSpecialFoldersRootUri] =
    useState(siteDocumentsRootUri);
  const [sidebarExpanded, setSidebarExpanded] = useState(isSidebarExpanded);
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  let expandWorkspacesInitially = isWorkspacesExpanded;
  if (
    currentDocumentsRootUri.indexOf('/workspaces') === 0 ||
    (!hasUserSite && !hasDefaultSite && hasWorkspaces)
  ) {
    expandWorkspacesInitially = true;
  }
  const [workspacesExpanded, setWorkspacesExpanded] = useState(
    expandWorkspacesInitially
  );
  const [userSiteDocumentQueuesExpanded, setUserSiteDocumentQueuesExpanded] =
    useState(false);
  const [
    defaultSiteDocumentQueuesExpanded,
    setDefaultSiteDocumentQueuesExpanded,
  ] = useState(false);
  const [otherSiteDocumentQueuesExpanded, setOtherSiteDocumentQueuesExpanded] =
    useState(false);
  const [integrationsExpanded, setIntegrationsExpanded] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [isWorkspacesModalOpened, setWorkspacesModalOpened] = useState(false);

  const path = decodeURI(window.location.pathname);
  const firstSlashIndex = path.indexOf('/', 1);
  const locationPrefix =
    firstSlashIndex > 0 ? path.substring(0, firstSlashIndex) : path;

  const [defaultSiteDocumentQueues, setDefaultSiteDocumentQueues] = useState(
    []
  );
  const [userSiteDocumentQueues, setUserSiteDocumentQueues] = useState([]);
  const [otherSiteDocumentQueues, setOtherSiteDocumentQueues] = useState([]);

  const subfolderUri = useSubfolderUri();

  useEffect(() => {
    setOtherSiteDocumentQueuesExpanded(false);
    // TODO: determine if we should expand queues by default for "other" sites
    if (DocumentsAndFoldersPrefixes.indexOf(locationPrefix) > -1) {
      setDocumentsExpanded(true);
    } else if (WorkflowsAndIntegrationsPrefixes.indexOf(locationPrefix) > -1) {
      setIntegrationsExpanded(true);
    } else if (AdminPrefixes.indexOf(locationPrefix) > -1) {
      setAdminExpanded(true);
    }
  }, [locationPrefix]);

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
    if (pathname.indexOf('/workspaces') > -1) {
      setSpecialFoldersRootUri('/workspaces/' + recheckSiteInfo.siteId);
    } else {
      setSpecialFoldersRootUri('/documents');
    }
  }, [pathname]);

  useEffect(() => {
    if (hasDefaultSite && defaultSiteDocumentQueuesExpanded) {
      DocumentsService.getQueues('default').then((queuesResponse: any) => {
        if (queuesResponse.queues) {
          setDefaultSiteDocumentQueues(queuesResponse.queues);
        } else {
          setDefaultSiteDocumentQueues([]);
        }
      });
    }
  }, [defaultSiteDocumentQueuesExpanded]);

  useEffect(() => {
    if (hasUserSite && userSiteDocumentQueuesExpanded) {
      DocumentsService.getQueues(user?.email as string).then(
        (queuesResponse: any) => {
          if (queuesResponse.queues) {
            setUserSiteDocumentQueues(queuesResponse.queues);
          } else {
            setUserSiteDocumentQueues([]);
          }
        }
      );
    }
  }, [userSiteDocumentQueuesExpanded]);

  useEffect(() => {
    if (
      hasWorkspaces &&
      currentSiteId !== 'default' &&
      currentSiteId !== user?.email &&
      otherSiteDocumentQueuesExpanded
    ) {
      DocumentsService.getQueues(currentSiteId).then((queuesResponse: any) => {
        if (queuesResponse.queues) {
          setOtherSiteDocumentQueues(queuesResponse.queues);
        } else {
          setOtherSiteDocumentQueues([]);
        }
      });
    } else {
      setOtherSiteDocumentQueues([]);
    }
  }, [otherSiteDocumentQueuesExpanded]);

  const toggleSidebarExpand = () => {
    dispatch(setIsSidebarExpanded(!sidebarExpanded));
    setSidebarExpanded(!sidebarExpanded);
  };
  const toggleDocumentsExpand = () => {
    setDocumentsExpanded(!documentsExpanded);
  };
  const toggleWorkspacesExpand = () => {
    if (!workspacesExpanded) {
      setDocumentsExpanded(true);
    }
    dispatch(setIsWorkspacesExpanded(!workspacesExpanded));
    setWorkspacesExpanded(!workspacesExpanded);
  };
  const toggleDefaultSiteDocumentQueuesExpand = () => {
    if (!defaultSiteDocumentQueuesExpanded) {
      setDefaultSiteDocumentQueuesExpanded(true);
    }
    setDefaultSiteDocumentQueuesExpanded(!defaultSiteDocumentQueuesExpanded);
  };
  const toggleUserSiteDocumentQueuesExpand = () => {
    if (!userSiteDocumentQueuesExpanded) {
      setUserSiteDocumentQueuesExpanded(true);
    }
    setUserSiteDocumentQueuesExpanded(!userSiteDocumentQueuesExpanded);
  };
  const toggleOtherSiteDocumentQueuesExpand = () => {
    if (!otherSiteDocumentQueuesExpanded) {
      setOtherSiteDocumentQueuesExpanded(true);
    }
    setOtherSiteDocumentQueuesExpanded(!otherSiteDocumentQueuesExpanded);
  };
  const toggleIntegrationsExpand = () => {
    setIntegrationsExpanded(!integrationsExpanded);
  };
  const toggleAdminExpand = () => {
    setAdminExpanded(!adminExpanded);
  };
  const onWorkspacesClick = (event: any) => {
    setWorkspacesModalOpened(true);
  };
  const onWorkspacesModalClose = () => {
    setWorkspacesModalOpened(false);
  };

  const handleAction = (action: string) => {
    const nonDocumentPaths = [
      '/workflows',
      '/integrations',
      '/queues',
      '/rulesets',
      '/object-examine-tool',
      '/schemas',
      '/mappings',
      '/admin/settings',
      '/admin/groups',
      '/admin/users',
      '/admin/access-control',
    ];
    const documentViewPathRegex = /^\/(?:documents|my-documents|team-documents|workspaces\/[^/]+)\/[^/]+\/(?:view|edit)$/;
    const isNonDocumentPath = nonDocumentPaths.some(
      (path) => pathname.indexOf(path) > -1
    );
    const isDocumentViewPath = documentViewPathRegex.test(pathname);
    if (isNonDocumentPath || isDocumentViewPath) {
      window.location.href = `${currentDocumentsRootUri}?actionEvent=${action}`;
    } else {
      dispatch(setCurrentActionEvent(action));
    }
  };

  const QuickFolderList = (
    folderSiteId: string,
    folderLevels: string[],
    subfoldersToList: IFolder[]
  ) => {
    let folderBreadcrumbUrl = `${currentDocumentsRootUri}/folders`;
    let initialPaddingLeft = 8;
    if (currentDocumentsRootUri.indexOf('workspaces') > 0) {
      initialPaddingLeft = 10;
    }
    if (
      subfolderUri !== 'deleted' &&
      subfolderUri !== 'shared' &&
      subfolderUri !== 'recent' &&
      subfolderUri !== 'favorites'
    ) {
      return (
        <>
          <span className="hidden pl-6 pl-8 pl-10 pl-12 pl-14 pl-16 pl-18 pl-20 pl-22 pl-24 pl-26"></span>
          {currentSiteId === folderSiteId && (
            <div className="text-sm text-neutral-900">
              {folderLevels.length ? (
                <>
                  {folderLevels.map((folderSnippet: string, i: number) => {
                    const paddingLeft = initialPaddingLeft + i * 2;
                    folderBreadcrumbUrl += '/' + folderSnippet;
                    return (
                      <div
                        key={i}
                        className={
                          (i === folderLevels.length - 1
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' p-1 pl-' +
                          paddingLeft +
                          ' flex justify-start'
                        }
                      >
                        <div className="w-4">
                          <FolderOutline />
                        </div>
                        <Link
                          to={`${folderBreadcrumbUrl}`}
                          className="cursor-pointer grow pl-2"
                        >
                          {folderSnippet}
                        </Link>
                      </div>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </>
      );
    } else {
      return <></>;
    }
  };

  const SidebarItems = () => {
    return (
      <div className="tracking-normal">
        {isSidebarExpanded ? (
          <>
            <li
              className="w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap px-2 pt-4 pb-2 cursor-pointer"
              onClick={toggleDocumentsExpand}
              data-test-id="expand-documents"
            >
              <div className="flex justify-end mt-2 mr-1">
                {documentsExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="uppercase font-bold text-sm">
                Documents & Folders
              </div>
            </li>
            {documentsExpanded && (
              <>
                {hasUserSite && (
                  <>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/my-documents"
                        data-test-id="nav-my-documents"
                        end
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' w-full text-sm font-bold flex'
                        }
                      >
                        <FolderDropWrapper
                          folder={''}
                          sourceSiteId={currentSiteId}
                          targetSiteId={user?.email || ''}
                          className={'w-full text-sm font-bold flex pl-5 py-2'}
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Documents />
                          </div>
                          <div>My Documents</div>
                        </FolderDropWrapper>
                      </NavLink>
                    </li>
                    {QuickFolderList(
                      user?.email || '',
                      currentSiteId === user?.email && subfolderUri.length
                        ? subfolderUri.split('/')
                        : [],
                      folders
                    )}
                    {currentSiteId === user?.email && (
                      <>
                        <li
                          className="hidden w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap pt-2 pl-6 px-4 pb-2 cursor-pointer"
                          onClick={toggleUserSiteDocumentQueuesExpand}
                        >
                          <div className="flex justify-end mt-3 mr-1">
                            {userSiteDocumentQueuesExpanded ? (
                              <ArrowBottom />
                            ) : (
                              <ArrowRight />
                            )}
                          </div>
                          <div className="pl-1 font-bold text-sm">Queues</div>
                        </li>
                        {userSiteDocumentQueuesExpanded &&
                          userSiteDocumentQueues.map(
                            (queue: any, i: number) => {
                              return (
                                <span key={i}>
                                  <li className="pl-5 w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                                    <NavLink
                                      to={
                                        '/my-documents/queues/' + queue.queueId
                                      }
                                      end
                                      className={({ isActive }) =>
                                        (isActive
                                          ? 'text-primary-600 bg-neutral-200 '
                                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                                        ' w-full text-sm font-bold flex'
                                      }
                                    >
                                      <div className="ml-2 w-4 flex flex-wrap items-center mr-2">
                                        <Queue />
                                      </div>
                                      <div>
                                        <span className="tracking-tighter">
                                          {queue.name.length > 28 ? (
                                            <span>
                                              {queue.name.substring(0, 28)}...
                                            </span>
                                          ) : (
                                            <span>{queue.name}</span>
                                          )}
                                        </span>
                                      </div>
                                    </NavLink>
                                  </li>
                                </span>
                              );
                            }
                          )}
                        {userSiteDocumentQueuesExpanded &&
                          !userSiteDocumentQueues.length && (
                            <div className="text-xs pl-8">
                              (no queues found)
                            </div>
                          )}
                        {userSiteDocumentQueuesExpanded && (
                          <div className="mb-2"></div>
                        )}
                      </>
                    )}
                  </>
                )}
                {hasDefaultSite && (
                  <>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to={hasUserSite ? '/team-documents' : '/documents'}
                        data-test-id="nav-team-documents"
                        end
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' w-full text-sm font-bold flex'
                        }
                      >
                        <FolderDropWrapper
                          folder={''}
                          sourceSiteId={currentSiteId}
                          targetSiteId={'default'}
                          className={'w-full text-sm font-bold flex pl-5 py-2 '}
                        >
                          {hasUserSite ? (
                            <div className="w-4 flex flex-wrap items-center mr-2">
                              <div className="-mt-0.5">
                                <Documents />
                              </div>
                              <div className="-mt-2.5 -ml-0.5">
                                <ShareHand />
                              </div>
                            </div>
                          ) : (
                            <div className="w-4 flex items-center mr-2">
                              <Documents />
                            </div>
                          )}
                          <div>
                            {hasUserSite ? (
                              <span>Team Documents</span>
                            ) : (
                              <span>Documents</span>
                            )}
                          </div>
                        </FolderDropWrapper>
                      </NavLink>
                    </li>
                    {QuickFolderList(
                      'default',
                      currentSiteId === 'default' && subfolderUri.length
                        ? subfolderUri.split('/')
                        : [],
                      folders
                    )}
                    {currentSiteId === 'default' && (
                      <>
                        <li
                          className="w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap pt-2 pl-6 px-4 pb-2 cursor-pointer"
                          onClick={toggleDefaultSiteDocumentQueuesExpand}
                        >
                          <div className="flex justify-end mt-3 mr-1">
                            {defaultSiteDocumentQueuesExpanded ? (
                              <ArrowBottom />
                            ) : (
                              <ArrowRight />
                            )}
                          </div>
                          <div className="pl-1 uppercase font-bold text-sm">
                            Queues
                          </div>
                        </li>
                        {defaultSiteDocumentQueuesExpanded &&
                          defaultSiteDocumentQueues.map(
                            (queue: any, i: number) => {
                              return (
                                <span key={i}>
                                  <li className="pl-5 w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                                    <NavLink
                                      to={
                                        (hasUserSite
                                          ? '/team-documents'
                                          : '/documents') +
                                        '/queues/' +
                                        queue.queueId
                                      }
                                      end
                                      className={({ isActive }) =>
                                        (isActive
                                          ? 'text-primary-600 bg-neutral-200 '
                                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                                        ' w-full text-sm font-bold flex'
                                      }
                                    >
                                      <div className="ml-2 w-4 flex flex-wrap items-center mr-2">
                                        <Queue />
                                      </div>
                                      <div>
                                        <span className="tracking-tighter">
                                          {queue.name.length > 28 ? (
                                            <span>
                                              {queue.name.substring(0, 28)}...
                                            </span>
                                          ) : (
                                            <span>{queue.name}</span>
                                          )}
                                        </span>
                                      </div>
                                    </NavLink>
                                  </li>
                                </span>
                              );
                            }
                          )}
                        {defaultSiteDocumentQueuesExpanded &&
                          !defaultSiteDocumentQueues.length && (
                            <div className="text-xs pl-8 mb-2">
                              (no queues found)
                            </div>
                          )}
                      </>
                    )}
                  </>
                )}
                {hasWorkspaces && (
                  <>
                    {(hasUserSite || hasDefaultSite) && (
                      <li
                        className="w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap px-2 pt-4 pb-2 cursor-pointer"
                        onClick={toggleWorkspacesExpand}
                      >
                        <div className="flex justify-end mt-3 mr-1">
                          {workspacesExpanded ? (
                            <ArrowBottom />
                          ) : (
                            <ArrowRight />
                          )}
                        </div>
                        <div className="pl-1 uppercase font-bold text-sm">
                          Workspaces
                        </div>
                      </li>
                    )}
                    {(workspacesExpanded ||
                      (!hasUserSite && !hasDefaultSite)) &&
                      workspaceSites.map((site: any, i: number) => {
                        return (
                          <span key={i}>
                            <li className="pl-2 w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                              <NavLink
                                to={'/workspaces/' + site.siteId}
                                end
                                className={({ isActive }) =>
                                  (isActive
                                    ? 'text-primary-600 bg-neutral-200 '
                                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                                  ' w-full text-sm font-bold flex'
                                }
                              >
                                <FolderDropWrapper
                                  folder={''}
                                  sourceSiteId={currentSiteId}
                                  targetSiteId={site.siteId}
                                  className={
                                    'w-full text-sm font-bold flex pl-5 py-2 '
                                  }
                                >
                                  <div className="w-5 flex flex-wrap items-center mr-2">
                                    <Workspace />
                                  </div>
                                  <div>
                                    <span>
                                      {site.siteId.replaceAll('_', ' ')}
                                    </span>
                                  </div>
                                </FolderDropWrapper>
                              </NavLink>
                            </li>
                            {QuickFolderList(
                              site.siteId,
                              currentSiteId === site.siteId &&
                                subfolderUri.length
                                ? subfolderUri.split('/')
                                : [],
                              folders
                            )}
                            {currentSiteId === site.siteId && (
                              <>
                                <li
                                  className="hidden w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap pt-2 pl-8 px-4 pb-2 cursor-pointer"
                                  onClick={toggleOtherSiteDocumentQueuesExpand}
                                >
                                  <div className="flex justify-end mt-3 mr-1">
                                    {otherSiteDocumentQueuesExpanded ? (
                                      <ArrowBottom />
                                    ) : (
                                      <ArrowRight />
                                    )}
                                  </div>
                                  <div className="pl-1 uppercase font-bold text-sm">
                                    Queues
                                  </div>
                                </li>
                                {otherSiteDocumentQueuesExpanded &&
                                  otherSiteDocumentQueues.map(
                                    (queue: any, i: number) => {
                                      return (
                                        <span key={i}>
                                          <li className="pl-7 w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                                            <NavLink
                                              to={
                                                '/workspaces/' +
                                                currentSiteId +
                                                '/queues/' +
                                                queue.queueId
                                              }
                                              end
                                              className={({ isActive }) =>
                                                (isActive
                                                  ? 'text-primary-600 bg-neutral-200 '
                                                  : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                                                ' w-full text-sm font-bold flex'
                                              }
                                            >
                                              <div className="ml-2 w-4 flex flex-wrap items-center mr-2">
                                                <Queue />
                                              </div>
                                              <div>
                                                <span className="tracking-tighter">
                                                  {queue.name.length > 26 ? (
                                                    <span>
                                                      {queue.name.substring(
                                                        0,
                                                        26
                                                      )}
                                                      ...
                                                    </span>
                                                  ) : (
                                                    <span>{queue.name}</span>
                                                  )}
                                                </span>
                                              </div>
                                            </NavLink>
                                          </li>
                                        </span>
                                      );
                                    }
                                  )}
                                {otherSiteDocumentQueuesExpanded &&
                                  !otherSiteDocumentQueues.length && (
                                    <div className="text-xs pl-10 mb-2">
                                      (no queues found)
                                    </div>
                                  )}
                              </>
                            )}
                          </span>
                        );
                      })}
                  </>
                )}
                {!isSiteReadOnly && (
                  <>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        data-test-id="nav-favorites"
                        to={`${specialFoldersRootUri}/folders/favorites`}
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                          ' w-full text-sm font-bold flex '
                        }
                      >
                        <div
                          className={'w-full text-sm font-bold flex pl-5 py-2 '}
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Star />
                          </div>
                          <div>Favorites</div>
                        </div>
                      </NavLink>
                    </li>
                    {useSoftDelete && (
                      <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                        <NavLink
                          data-test-id="nav-trash"
                          to={`${specialFoldersRootUri}/folders/deleted`}
                          className={({ isActive }) =>
                            (isActive
                              ? 'text-primary-600 bg-neutral-200 '
                              : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                            ' w-full text-sm font-bold flex '
                          }
                        >
                          <div
                            className={
                              'w-full text-sm font-bold flex pl-5 py-2 '
                            }
                          >
                            <div className="w-4 h-4 flex items-center mr-2">
                              <Trash />
                            </div>
                            <div>Trash</div>
                          </div>
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
                <div className="flex w-full">
                  <div className="w-full mt-2 border-b border-neutral-300"></div>
                </div>
              </>
            )}
            <li
              className="mt-2 w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap px-2 pt-4 pb-2 cursor-pointer"
              data-test-id="expand-integrations"
              onClick={toggleIntegrationsExpand}
            >
              <div className="flex justify-end mt-2 mr-1">
                {integrationsExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="uppercase font-bold text-sm">
                {formkiqVersion.type !== 'core' && <span>Workflows & </span>}
                Integrations
              </div>
            </li>
            {integrationsExpanded && (
              <>
                {formkiqVersion.type !== 'core' && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to={
                        '/workflows' +
                        (pathname.indexOf('workspaces') > 0
                          ? '/workspaces/' + currentSiteId
                          : '')
                      }
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-primary-600 bg-neutral-200 '
                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                        ' w-full text-sm font-bold flex '
                      }
                    >
                      <div
                        className={
                          'w-full text-sm font-bold flex items-center pl-5 py-2 '
                        }
                      >
                        <div className="w-4 flex items-center mr-2">
                          <Workflow />
                        </div>
                        <div>Workflows</div>
                      </div>
                    </NavLink>
                  </li>
                )}
                {formkiqVersion.type !== 'core' && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to={
                        '/queues' +
                        (pathname.indexOf('workspaces') > 0
                          ? '/workspaces/' + currentSiteId
                          : '')
                      }
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-primary-600 bg-neutral-200 '
                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                        ' w-full text-sm font-bold flex '
                      }
                    >
                      <div
                        className={
                          'w-full text-sm font-bold flex items-center pl-5 py-2 '
                        }
                      >
                        <div className="w-4 flex items-center mr-2">
                          <Queue />
                        </div>
                        <div>Queues</div>
                      </div>
                    </NavLink>
                  </li>
                )}
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to={
                      '/attributes' +
                      (pathname.indexOf('workspaces') > 0
                        ? '/workspaces/' + currentSiteId
                        : '')
                    }
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-bold flex items-center pl-5 py-2 '
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Attribute />
                      </div>
                      <div>Attributes</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/integrations/api"
                    data-test-id="nav-api-explorer"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div className={'w-full text-sm font-bold flex pl-5 py-2 '}>
                      <div className="w-4 flex items-center mr-2">
                        <Api />
                      </div>
                      <div>API Explorer</div>
                    </div>
                  </NavLink>
                </li>
                {formkiqVersion.type !== 'core' && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to={
                        '/rulesets' +
                        (pathname.indexOf('workspaces') > 0
                          ? '/workspaces/' + currentSiteId
                          : '')
                      }
                      data-test-id="nav-rulesets"
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-primary-600 bg-neutral-200 '
                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                        ' w-full text-sm font-bold flex '
                      }
                    >
                      <div
                        className={'w-full text-sm font-bold flex pl-5 py-2 '}
                      >
                        <div className="w-4 flex items-center mr-2">
                          <Rules />
                        </div>
                        <div>Rulesets</div>
                      </div>
                    </NavLink>
                  </li>
                )}
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/object-examine-tool"
                    data-test-id="nav-object-examine"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div className={'w-full text-sm font-bold flex pl-5 py-2 '}>
                      <div className="w-4 flex items-center mr-2">
                        <Examine />
                      </div>
                      <div>Object Examine Tool</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to={
                      '/schemas' +
                      (pathname.indexOf('workspaces') > 0
                        ? '/workspaces/' + currentSiteId
                        : '')
                    }
                    data-test-id="nav-schemas"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div className={'w-full text-sm font-bold flex pl-5 py-2 '}>
                      <div className="w-4 flex items-center mr-2">
                        <Schema />
                      </div>
                      <div>Schemas</div>
                    </div>
                  </NavLink>
                </li>
                {formkiqVersion.type !== 'core' && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to="/mappings"
                      data-test-id="nav-mappings"
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-primary-600 bg-neutral-200 '
                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                        ' w-full text-sm font-bold flex '
                      }
                    >
                      <div
                        className={'w-full text-sm font-bold flex pl-5 py-2 '}
                      >
                        <div className="w-4 flex items-center mr-2">
                          <Mapping />
                        </div>
                        <div>Mappings</div>
                      </div>
                    </NavLink>
                  </li>
                )}
                <div className="flex w-full">
                  <div className="w-full mt-4 border-b border-neutral-300"></div>
                </div>
              </>
            )}
            {user?.isAdmin && (
              <>
                <li
                  className="mt-2 w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap px-2 pt-2 pb-2 cursor-pointer"
                  onClick={toggleAdminExpand}
                >
                  <div className="flex justify-end mt-2 mr-1">
                    {adminExpanded ? <ArrowBottom /> : <ArrowRight />}
                  </div>
                  <div className="uppercase font-bold text-sm ">
                    Administration
                  </div>
                </li>
                {adminExpanded && (
                  <>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/admin/settings"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' w-full text-sm font-bold flex '
                        }
                      >
                        <div
                          className={'w-full text-sm font-bold flex pl-5 py-2'}
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Settings />
                          </div>
                          <div>Settings</div>
                        </div>
                      </NavLink>
                    </li>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to={
                          '/admin/api-keys' +
                          (pathname.indexOf('workspaces') > 0
                            ? '/workspaces/' + currentSiteId
                            : '')
                        }
                        data-test-id="nav-api-keys"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' w-full text-sm font-bold flex '
                        }
                      >
                        <div
                          className={'w-full text-sm font-bold flex pl-5 py-2'}
                        >
                          <div className="w-4 flex items-center mr-2">
                            <ApiKey />
                          </div>
                          <div>API Keys</div>
                        </div>
                      </NavLink>
                    </li>
                    {userAuthenticationType === 'cognito' && (
                      <>
                        <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                          <NavLink
                            to="/admin/groups"
                            className={({ isActive }) =>
                              (isActive
                                ? 'text-primary-600 bg-neutral-200 '
                                : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                              ' w-full text-sm font-bold flex '
                            }
                          >
                            <div
                              className={
                                'w-full text-sm font-bold flex items-center pl-5  py-2 '
                              }
                            >
                              <div className="w-4 flex items-center mr-2">
                                <Group />
                              </div>
                              <div>Groups</div>
                            </div>
                          </NavLink>
                        </li>
                        <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                          <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                              (isActive
                                ? 'text-primary-600 bg-neutral-200 '
                                : 'text-neutral-900 bg-neutral-100 hover:text-primary-500') +
                              ' w-full text-sm font-bold flex '
                            }
                          >
                            <div
                              className={
                                'w-full text-sm font-bold flex items-center pl-5  py-2 '
                              }
                            >
                              <div className="w-4 flex items-center mr-2">
                                <Users />
                              </div>
                              <div>Users</div>
                            </div>
                          </NavLink>
                        </li>
                      </>
                    )}
                    {formkiqVersion.modules.includes('opa') && (
                      <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                        <NavLink
                          to="/admin/access-control"
                          data-test-id="nav-access-control"
                          className={({ isActive }) =>
                            (isActive
                              ? 'text-primary-600 bg-neutral-200 '
                              : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                            ' w-full text-sm font-bold flex '
                          }
                        >
                          <div
                            className={
                              'w-full text-sm font-bold flex pl-5 py-2'
                            }
                          >
                            <div className="w-4 flex items-center mr-2">
                              <AccessControl />
                            </div>
                            <div>Access Control</div>
                          </div>
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {hasUserSite && (
              <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                <NavLink
                  to="/my-documents"
                  end
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-primary-600 bg-neutral-200 '
                      : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                    ' w-full text-sm font-bold flex '
                  }
                >
                  <FolderDropWrapper
                    folder={''}
                    sourceSiteId={currentSiteId}
                    targetSiteId={user?.email || ''}
                    className={'w-full text-sm font-bold flex pl-5 py-3 '}
                  >
                    <div className="w-4 flex items-center mr-2">
                      <Documents />
                    </div>
                  </FolderDropWrapper>
                </NavLink>
              </li>
            )}
            {hasDefaultSite && (
              <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                <NavLink
                  to={hasUserSite ? '/team-documents' : '/documents'}
                  end
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-primary-600 bg-neutral-200 '
                      : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                    ' w-full text-sm font-bold flex '
                  }
                >
                  <FolderDropWrapper
                    folder={''}
                    sourceSiteId={currentSiteId}
                    targetSiteId={'default'}
                    className={'w-full text-sm font-bold flex pl-5 py-3 '}
                  >
                    {hasUserSite ? (
                      <div className="w-4 flex flex-wrap items-center mr-2">
                        <div className="-mt-0.5">
                          <Documents />
                        </div>
                        <div className="-mt-2.5 -ml-0.5">
                          <ShareHand />
                        </div>
                      </div>
                    ) : (
                      <div className="w-4 flex items-center mr-2">
                        <Documents />
                      </div>
                    )}
                  </FolderDropWrapper>
                </NavLink>
              </li>
            )}
            {hasWorkspaces && (
              <div className="w-full text-sm font-bold flex pl-5 py-3 bg-neutral-100">
                <div
                  className="w-4 flex flex-wrap items-center mr-2 cursor-pointer"
                  onClick={onWorkspacesClick}
                >
                  <Workspace />
                </div>
              </div>
            )}
            {!isSiteReadOnly && (
              <>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to={`${specialFoldersRootUri}/folders/favorites`}
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div className={'w-full text-sm font-bold flex pl-5 py-3 '}>
                      <div className="w-4 flex items-center mr-2">
                        <Star />
                      </div>
                    </div>
                  </NavLink>
                </li>
                {useSoftDelete && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to={`${specialFoldersRootUri}/folders/deleted`}
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-primary-600 bg-neutral-200 '
                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                        ' w-full text-sm font-bold flex '
                      }
                    >
                      <div
                        className={'w-full text-sm font-bold flex pl-5 py-3 '}
                      >
                        <div className="w-4 h-4 flex items-center mr-2">
                          <Trash />
                        </div>
                      </div>
                    </NavLink>
                  </li>
                )}
              </>
            )}
            <div className="flex w-full">
              <div className="w-full mt-2 mx-2 border-b border-neutral-300"></div>
            </div>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={
                  '/workflows' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-bold flex items-center pl-5 py-3 '
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Workflow />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={
                  '/queues' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-bold flex items-center pl-5 py-3 '
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Queue />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={
                  '/attributes' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div className={'w-full text-sm font-bold flex pl-5 py-3 '}>
                  <div className="w-4 flex items-center mr-2">
                    <Attribute />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to="/integrations/api"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div className={'w-full text-sm font-bold flex pl-5 py-3 '}>
                  <div className="w-4 flex items-center mr-2">
                    <Api />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to="/integrations/webhooks"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div className={'w-full text-sm font-bold flex pl-5 py-3 '}>
                  <div className="w-4 flex items-center mr-2">
                    <Webhook />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={
                  '/rulesets' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-bold flex items-center pl-5 py-3 '
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Rules />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to="/object-examine-tool"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-bold flex items-center pl-5 py-3 '
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Examine />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={
                  '/schemas' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                className={({ isActive }) =>
                  (isActive
                    ? 'text-primary-600 bg-neutral-200 '
                    : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                  ' w-full text-sm font-bold flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-bold flex items-center pl-5 py-3 '
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Schema />
                  </div>
                </div>
              </NavLink>
            </li>
            {formkiqVersion.type !== 'core' && (
              <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                <NavLink
                  to="/mappings"
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-primary-600 bg-neutral-200 '
                      : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                    ' w-full text-sm font-bold flex '
                  }
                >
                  <div
                    className={
                      'w-full text-sm font-bold flex items-center pl-5 py-3 '
                    }
                  >
                    <div className="w-4 flex items-center mr-2">
                      <Mapping />
                    </div>
                  </div>
                </NavLink>
              </li>
            )}
            {user?.isAdmin && (
              <>
                <div className="flex w-full">
                  <div className="w-full mt-2 mx-2 border-b border-neutral-300"></div>
                </div>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div className={'w-full text-sm font-bold flex pl-5 py-3 '}>
                      <div className="w-4 flex items-center mr-2">
                        <Settings />
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to={
                      '/admin/api-keys' +
                      (pathname.indexOf('workspaces') > 0
                        ? '/workspaces/' + currentSiteId
                        : '')
                    }
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-primary-600 bg-neutral-200 '
                        : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                      ' w-full text-sm font-bold flex '
                    }
                  >
                    <div className={'w-full text-sm font-bold flex pl-5 py-3 '}>
                      <div className="w-4 flex items-center mr-2">
                        <ApiKey />
                      </div>
                    </div>
                  </NavLink>
                </li>
                {userAuthenticationType === 'cognito' && (
                  <>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/admin/groups"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' w-full text-sm font-bold flex '
                        }
                      >
                        <div
                          className={
                            'w-full text-sm font-bold flex items-center pl-5 py-3 '
                          }
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Group />
                          </div>
                        </div>
                      </NavLink>
                    </li>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-primary-600 bg-neutral-200 '
                            : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                          ' w-full text-sm font-bold flex '
                        }
                      >
                        <div
                          className={
                            'w-full text-sm font-bold flex items-center pl-5 py-3 '
                          }
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Users />
                          </div>
                        </div>
                      </NavLink>
                    </li>
                  </>
                )}
                {formkiqVersion.modules?.includes('opa') && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to="/admin/access-control"
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-primary-600 bg-neutral-200 '
                          : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
                        ' w-full text-sm font-bold flex '
                      }
                    >
                      <div
                        className={'w-full text-sm font-bold flex pl-5 py-3 '}
                      >
                        <div className="w-4 flex items-center mr-2">
                          <AccessControl />
                        </div>
                      </div>
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={
        (sidebarExpanded ? 'w-64' : 'w-14') +
        ' h-screen relative bg-neutral-100'
      }
    >
      <div className="pb-20">
        <div
          className={
            (sidebarExpanded ? 'w-64' : 'w-10') +
            ' flex fixed z-30 justify-between h-logo'
          }
        >
          <Link to="/">
            {sidebarExpanded ? (
              <>
                <div className="w-logo h-logo flex justify-center items-center">
                  <picture>
                    <source
                      srcSet="/assets/img/png/brand-logo.png"
                      type="image/png"
                    />
                    <img src="/assets/img/png/brand-logo.png" />
                  </picture>
                </div>
              </>
            ) : (
              <></>
            )}
          </Link>
          <div
            className={
              (sidebarExpanded
                ? 'justify-end -ml-2 pr-2 '
                : 'justify-end -mr-4 pr-4 ') +
              ' text-neutral-900 hover:text-primary-500 flex mt-2 cursor-pointer border-r border-neutral-300 '
            }
            onClick={toggleSidebarExpand}
          >
            <div className={(!sidebarExpanded ? 'mt-2' : '-mt-1.5') + ' w-4'}>
              {sidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
            </div>
          </div>
        </div>
        <div
          className={
            (sidebarExpanded ? 'w-62' : 'w-12') +
            ' flex flex-wrap fixed bg-neutral-100 '
          }
        ></div>
      </div>
      <div
        className={
          (sidebarExpanded ? 'w-64' : 'w-14') +
          ' -pt-2 border-r border-neutral-300 fixed flex h-full flex-wrap items-start justify-start overflow-y-auto bg-neutral-100'
        }
      >
        {user && (
          <>
            <nav className="grow mb-8 pt-4">
              {!isSiteReadOnly && (
                <div className="flex flex-wrap w-full justify-center mb-4 pl-0.5">
                  <ButtonPrimaryGradient
                    className={
                      (isSidebarExpanded
                        ? ' mr-1 rounded-md'
                        : 'mb-1 rounded-full') +
                      ' flex justify-center items-center w-full'
                    }
                    style={{
                      height: isSidebarExpanded ? '32px' : '28px',
                      width: isSidebarExpanded ? '100%' : '28px',
                      padding: isSidebarExpanded ? '16px' : '0px',
                    }}
                    onClick={() => handleAction('new')}
                  >
                    {isSidebarExpanded && (
                      <span data-test-id="new-document">New</span>
                    )}
                    <div
                      className={
                        (isSidebarExpanded ? 'ml-2 mt-1 ' : 'ml-0 mt-0 ') +
                        ' w-3 h-3'
                      }
                    >
                      {Plus()}
                    </div>
                  </ButtonPrimaryGradient>
                  <ButtonTertiary
                    className={
                      (isSidebarExpanded
                        ? ' mr-1 rounded-md'
                        : 'mb-1 rounded-full') +
                      ' flex justify-center items-center w-full'
                    }
                    style={{
                      height: isSidebarExpanded ? '32px' : '28px',
                      width: isSidebarExpanded ? '100%' : '28px',
                      padding: isSidebarExpanded ? '16px' : '0px',
                    }}
                    data-test-id="upload-document"
                    onClick={() => handleAction('upload')}
                  >
                    {isSidebarExpanded && <span>Upload</span>}
                    <div
                      className={
                        (isSidebarExpanded ? 'ml-2 mt-1 ' : 'ml-0 mt-0 ') +
                        ' w-3 h-3'
                      }
                    >
                      {Upload()}
                    </div>
                  </ButtonTertiary>
                </div>
              )}
              <ul className="flex lg:flex-col gap-1">
                <SidebarItems />
              </ul>
            </nav>
            {formkiqVersion && formkiqVersion.type && isSidebarExpanded && (
              <>
                <div className="group text-xs fixed left-0 bottom-0 flex justify-start items-end pl-4 mb-2 bg-neutral-100">
                  FormKiQ
                  {formkiqVersion.type === 'enterprise' ? (
                    <span>&nbsp;Enterprise&nbsp;</span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                  v{formkiqVersion.version}
                  <div className="modulePane absolute invisible group-hover:visible bottom-full w-full mb-2">
                    {formkiqVersion.modules &&
                      formkiqVersion.modules.length && (
                        <h3 className="font-semibold mb-1">Modules:</h3>
                      )}
                    {formkiqVersion.modules.map((module: string, i: number) => {
                      return (
                        <div key={i} className="bg-white p-1">
                          {module.toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <WorkspacesModal
        isOpened={isWorkspacesModalOpened}
        onClose={onWorkspacesModalClose}
        workspaceSites={workspaceSites}
      />
    </div>
  );
}

export default Sidebar;
