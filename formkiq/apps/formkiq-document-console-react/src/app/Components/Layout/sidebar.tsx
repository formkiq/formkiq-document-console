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
  AccountAndSettingsPrefixes,
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
import {
  Api,
  ApiKey,
  ArrowBottom,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Documents,
  Examine,
  FolderOutline,
  Plus,
  Queue,
  Rules,
  Settings,
  ShareHand,
  Star,
  Trash,
  Upload,
  UserIcon,
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
    useAccountAndSettings,
    useSoftDelete,
    isSidebarExpanded,
    isWorkspacesExpanded,
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
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [isWorkspacesModalOpened, setWorkspacesModalOpened] = useState(false);

  const locationPrefix = decodeURI(window.location.pathname).substring(
    0,
    decodeURI(window.location.pathname).indexOf('/', 1)
  );

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
      setIntegrationsExpanded(false);
      setSettingsExpanded(false);
    } else if (WorkflowsAndIntegrationsPrefixes.indexOf(locationPrefix) > -1) {
      setDocumentsExpanded(false);
      setIntegrationsExpanded(true);
      setSettingsExpanded(false);
    } else if (AccountAndSettingsPrefixes.indexOf(locationPrefix) > -1) {
      setDocumentsExpanded(false);
      setIntegrationsExpanded(false);
      setSettingsExpanded(true);
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
    if (recheckSiteInfo.siteDocumentsRootUri.indexOf('workspaces') > 0) {
      if (!hasUserSite && !hasDefaultSite && hasWorkspaces) {
        setSpecialFoldersRootUri('/documents');
      }
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
  const toggleSettingsExpand = () => {
    setSettingsExpanded(!settingsExpanded);
  };
  const onWorkspacesClick = (event: any) => {
    setWorkspacesModalOpened(true);
  };
  const onWorkspacesModalClose = () => {
    setWorkspacesModalOpened(false);
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
            <div className="text-sm text-gray-500">
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
                            ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                            : 'text-gray-500 bg-white ') +
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
      <div className="tracking-tight">
        {isSidebarExpanded ? (
          <>
            <li
              className="w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
              onClick={toggleDocumentsExpand}
              data-test-id="expand-documents"
            >
              <div className="flex justify-end mt-2 mr-1">
                {documentsExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="uppercase font-semibold text-xs">
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
                            ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                            : 'text-gray-500 bg-white ') +
                          ' w-full text-sm font-medium flex'
                        }
                      >
                        <FolderDropWrapper
                          folder={''}
                          sourceSiteId={currentSiteId}
                          targetSiteId={user?.email || ''}
                          className={
                            'w-full text-sm font-medium flex pl-5 py-2'
                          }
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
                          className="hidden w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap pt-2 pl-6 px-4 pb-2 cursor-pointer"
                          onClick={toggleUserSiteDocumentQueuesExpand}
                        >
                          <div className="flex justify-end mt-2 mr-1">
                            {userSiteDocumentQueuesExpanded ? (
                              <ArrowBottom />
                            ) : (
                              <ArrowRight />
                            )}
                          </div>
                          <div className="pl-1 uppercase text-xs">Queues</div>
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
                                          ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                                          : 'text-gray-500 bg-white ') +
                                        ' w-full text-sm font-medium flex'
                                      }
                                    >
                                      <div className="ml-2 w-4 flex flex-wrap items-center mr-2">
                                        <Queue />
                                      </div>
                                      <div>
                                        <span className="tracking-tightest">
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
                            ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                            : 'text-gray-500 bg-white ') +
                          ' w-full text-sm font-medium flex'
                        }
                      >
                        <FolderDropWrapper
                          folder={''}
                          sourceSiteId={currentSiteId}
                          targetSiteId={'default'}
                          className={
                            'w-full text-sm font-medium flex pl-5 py-2 '
                          }
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
                          className="hidden w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap pt-2 pl-6 px-4 pb-2 cursor-pointer"
                          onClick={toggleDefaultSiteDocumentQueuesExpand}
                        >
                          <div className="flex justify-end mt-2 mr-1">
                            {defaultSiteDocumentQueuesExpanded ? (
                              <ArrowBottom />
                            ) : (
                              <ArrowRight />
                            )}
                          </div>
                          <div className="pl-1 uppercase text-xs">Queues</div>
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
                                          ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                                          : 'text-gray-500 bg-white ') +
                                        ' w-full text-sm font-medium flex'
                                      }
                                    >
                                      <div className="ml-2 w-4 flex flex-wrap items-center mr-2">
                                        <Queue />
                                      </div>
                                      <div>
                                        <span className="tracking-tightest">
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
                        className="w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
                        onClick={toggleWorkspacesExpand}
                      >
                        <div className="flex justify-end mt-2 mr-1">
                          {workspacesExpanded ? (
                            <ArrowBottom />
                          ) : (
                            <ArrowRight />
                          )}
                        </div>
                        <div className="pl-1 uppercase text-xs">Workspaces</div>
                      </li>
                    )}
                    {(workspacesExpanded ||
                      (!hasUserSite && !hasDefaultSite)) &&
                      workspaceSites.map((site: any, i: number) => {
                        return (
                          <span key={i}>
                            <li className="pl-3 w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                              <NavLink
                                to={'/workspaces/' + site.siteId}
                                end
                                className={({ isActive }) =>
                                  (isActive
                                    ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                                    : 'text-gray-500 bg-white ') +
                                  ' w-full text-sm font-medium flex'
                                }
                              >
                                <FolderDropWrapper
                                  folder={''}
                                  sourceSiteId={currentSiteId}
                                  targetSiteId={site.siteId}
                                  className={
                                    'w-full text-sm font-medium flex pl-5 py-2 '
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
                                  className="hidden w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap pt-2 pl-8 px-4 pb-2 cursor-pointer"
                                  onClick={toggleOtherSiteDocumentQueuesExpand}
                                >
                                  <div className="flex justify-end mt-2 mr-1">
                                    {otherSiteDocumentQueuesExpanded ? (
                                      <ArrowBottom />
                                    ) : (
                                      <ArrowRight />
                                    )}
                                  </div>
                                  <div className="pl-1 uppercase text-xs">
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
                                                  ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                                                  : 'text-gray-500 bg-white ') +
                                                ' w-full text-sm font-medium flex'
                                              }
                                            >
                                              <div className="ml-2 w-4 flex flex-wrap items-center mr-2">
                                                <Queue />
                                              </div>
                                              <div>
                                                <span className="tracking-tightest">
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
                    <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        data-test-id="nav-favorites"
                        to={`${specialFoldersRootUri}/folders/favorites`}
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                            : 'text-gray-500 bg-white ') +
                          ' w-full text-sm font-medium flex '
                        }
                      >
                        <div
                          className={
                            'w-full text-sm font-medium flex pl-5 py-2 '
                          }
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Star />
                          </div>
                          <div>Favorites</div>
                        </div>
                      </NavLink>
                    </li>
                    {useSoftDelete && (
                      <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                        <NavLink
                          data-test-id="nav-trash"
                          to={`${specialFoldersRootUri}/folders/deleted`}
                          className={({ isActive }) =>
                            (isActive
                              ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                              : 'text-gray-500 bg-white ') +
                            ' w-full text-sm font-medium flex '
                          }
                        >
                          <div
                            className={
                              'w-full text-sm font-medium flex pl-5 py-2 '
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
                  <div className="w-full mt-2 border-b"></div>
                </div>
              </>
            )}
            <li
              className="mt-2 w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
              data-test-id="expand-integrations"
              onClick={toggleIntegrationsExpand}
            >
              <div className="flex justify-end mt-2 mr-1">
                {integrationsExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="uppercase font-semibold text-xs mb-2">
                Workflows & Integrations
              </div>
            </li>
            {integrationsExpanded && (
              <>
                <li className="w-full flex mt-4 self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/workflows"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex items-center pl-5 '
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Workflow />
                      </div>
                      <div>Workflows</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex mt-6 self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/queues"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex items-center pl-5 '
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Queue />
                      </div>
                      <div>Queues</div>
                    </div>
                  </NavLink>
                </li>
                <li className="mt-4 w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/integrations/api"
                    data-test-id="nav-api-explorer"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-2 '}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Api />
                      </div>
                      <div>API Explorer</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/integrations/apiKeys"
                    data-test-id="nav-api-keys"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-2'}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <ApiKey />
                      </div>
                      <div>API Keys</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/rulesets"
                    data-test-id="nav-rulesets"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-2 '}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Rules />
                      </div>
                      <div>Rulesets</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/integrations/webhooks"
                    data-test-id="nav-webhooks"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-2 '}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Webhook />
                      </div>
                      <div>Inbound Webhooks</div>
                    </div>
                  </NavLink>
                </li>

                <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/object-examine-tool"
                    data-test-id="nav-object-examine"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-2 '}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Examine/>
                      </div>
                      <div>Object Examine Tool</div>
                    </div>
                  </NavLink>
                </li>

                <div className="flex w-full">
                  <div className="w-full mt-4 border-b"></div>
                </div>
              </>
            )}
            {useAccountAndSettings && (
              <>
                <li
                  className="mt-4 w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
                  onClick={toggleSettingsExpand}
                >
                  <div className="flex justify-end mt-2 mr-1">
                    {settingsExpanded ? <ArrowBottom /> : <ArrowRight />}
                  </div>
                  <div className="uppercase font-semibold  text-xs">
                    Account & Settings
                  </div>
                </li>
                {settingsExpanded && (
                  <>
                    <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/account"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                            : 'text-gray-500 bg-white ') +
                          ' w-full text-sm font-medium flex '
                        }
                      >
                        <div
                          className={'w-full text-sm font-medium flex pl-5 '}
                        >
                          <div className="w-4 flex items-center mr-2">
                            <UserIcon />
                          </div>
                          <div>Account</div>
                        </div>
                      </NavLink>
                    </li>
                    <li className="w-full flex mt-2 self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                            : 'text-gray-500 bg-white ') +
                          ' w-full text-sm font-medium flex '
                        }
                      >
                        <div
                          className={'w-full text-sm font-medium flex pl-5 '}
                        >
                          <div className="w-4 flex items-center mr-2">
                            <Settings />
                          </div>
                          <div>Settings</div>
                        </div>
                      </NavLink>
                    </li>
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
                      ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                      : 'text-gray-500 bg-white ') +
                    ' w-full text-sm font-medium flex '
                  }
                >
                  <FolderDropWrapper
                    folder={''}
                    sourceSiteId={currentSiteId}
                    targetSiteId={user?.email || ''}
                    className={'w-full text-sm font-medium flex pl-5 py-4 '}
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
                      ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                      : 'text-gray-500 bg-white ') +
                    ' w-full text-sm font-medium flex '
                  }
                >
                  <FolderDropWrapper
                    folder={''}
                    sourceSiteId={currentSiteId}
                    targetSiteId={'default'}
                    className={'w-full text-sm font-medium flex pl-5 py-3 '}
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
              <div className="w-full text-sm font-medium flex pl-5 py-3 bg-white mb-4">
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
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-4 '}
                    >
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
                          ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                          : 'text-gray-500 bg-white ') +
                        ' w-full text-sm font-medium flex '
                      }
                    >
                      <div
                        className={'w-full text-sm font-medium flex pl-5 py-4 '}
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
              <div className="w-full mt-2 mx-2 border-b"></div>
            </div>
            <li className="hidden w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to="/workflows"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                    : 'text-gray-500 bg-white ') +
                  ' w-full text-sm font-medium flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex items-center pl-5 py-4 '
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Workflow />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="hidden w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to="/queues"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                    : 'text-gray-500 bg-white ') +
                  ' w-full text-sm font-medium flex '
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex items-center pl-5 py-4 '
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
                to="/integrations/api"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                    : 'text-gray-500 bg-white ') +
                  ' w-full text-sm font-medium flex '
                }
              >
                <div className={'w-full text-sm font-medium flex pl-5 py-4 '}>
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
                    ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                    : 'text-gray-500 bg-white ') +
                  ' w-full text-sm font-medium flex '
                }
              >
                <div className={'w-full text-sm font-medium flex pl-5 py-4 '}>
                  <div className="w-4 flex items-center mr-2">
                    <Webhook />
                  </div>
                </div>
              </NavLink>
            </li>
            {useAccountAndSettings && (
              <>
                <div className="flex w-full">
                  <div className="w-full mt-2 mx-2 border-b"></div>
                </div>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-4 '}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <UserIcon />
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-600 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 '
                        : 'text-gray-500 bg-white ') +
                      ' w-full text-sm font-medium flex '
                    }
                  >
                    <div
                      className={'w-full text-sm font-medium flex pl-5 py-4 '}
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Settings />
                      </div>
                    </div>
                  </NavLink>
                </li>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={(sidebarExpanded ? 'w-64' : 'w-14') + ' h-screen relative'}>
      <div
        className={
          (sidebarExpanded ? 'w-64' : 'w-14') +
          ' border-r fixed flex h-full flex-wrap items-start justify-start overflow-y-scroll'
        }
      >
        <div
          className={
            (sidebarExpanded ? 'w-64' : 'w-10') +
            ' flex fixed z-30 justify-between mt-2.5'
          }
        >
          <Link to="/">
            {sidebarExpanded ? (
              <>
                <picture>
                  <source
                    srcSet="/assets/img/png/formkiq-wordmark.webp"
                    type="image/webp"
                  />
                  <source
                    srcSet="/assets/img/png/formkiq-wordmark.png"
                    type="image/png"
                  />
                  <img
                    src="/assets/img/png/formkiq-wordmark.png"
                    className="ml-6 mt-2 w-28 mb-2.5"
                    alt="FormKiQ"
                  />
                </picture>
              </>
            ) : (
              <></>
            )}
          </Link>
          <div
            className={
              (sidebarExpanded ? 'justify-end mr-2 ' : 'justify-end mr-2') +
              ' text-gray-600 hover:text-coreOrange-500 flex mt-2 cursor-pointer '
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
            ' flex flex-wrap fixed bg-white '
          }
        ></div>
        {user && (
          <>
            <nav className="grow mt-16">
              {!isSiteReadOnly && (
                <div className="flex flex-wrap w-full justify-center mb-4">
                  <button
                    className={
                      (isSidebarExpanded ? ' mr-1 ' : 'mb-1 ') +
                      ' bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-4 rounded-2xl flex cursor-pointer'
                    }
                    onClick={(event) => {
                      // TODO: create more consistent check on site location
                      if (
                        pathname.indexOf('/workflows') > -1 ||
                        pathname.indexOf('/integrations') > -1
                      ) {
                        window.location.href = `${currentDocumentsRootUri}?actionEvent=new`;
                      } else {
                        dispatch(setCurrentActionEvent('new'));
                      }
                    }}
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
                  </button>
                  <button
                    className="bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-sm font-semibold py-2 px-4 rounded-2xl flex cursor-pointer"
                    data-test-id="upload-document"
                    onClick={(event) => {
                      // TODO: create more consistent check on site location
                      if (
                        pathname.indexOf('/workflows') > -1 ||
                        pathname.indexOf('/integrations') > -1
                      ) {
                        window.location.href = `${currentDocumentsRootUri}?actionEvent=upload`;
                      } else {
                        dispatch(setCurrentActionEvent('upload'));
                      }
                    }}
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
                  </button>
                </div>
              )}
              <ul className="flex lg:flex-col gap-1">
                <SidebarItems />
              </ul>
            </nav>
            {formkiqVersion && formkiqVersion.type && isSidebarExpanded && (
              <div className="text-xxs absolute bottom-0 w-full flex justify-center items-end -mt-1 mb-4">
                {formkiqVersion.type.toUpperCase()} v{formkiqVersion.version}
              </div>
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
