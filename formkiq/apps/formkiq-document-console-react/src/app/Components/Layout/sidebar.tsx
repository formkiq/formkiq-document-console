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
  Group,
  HistoryIcon,
  Mapping,
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

  const NavigationItem = ({
    to,
    icon,
    title,
    testId = '',
    level = 0,
  }: {
    to: string;
    icon: any;
    title: string;
    testId?: string;
    level?: number;
  }) => {
    return (
      <li
        className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap"
        style={{ paddingLeft: isSidebarExpanded ? `${level * 16}px` : '0px' }}
      >
        <NavLink
          to={to}
          className={({ isActive }) =>
            (isActive
              ? 'text-primary-600 bg-neutral-200 '
              : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
            ' w-full text-sm font-bold flex '
          }
          data-test-id={testId}
          end
        >
          <div className="w-full text-sm font-bold flex items-center pl-5 py-2">
            <div className="w-4 flex items-center mr-2">{icon}</div>
            {isSidebarExpanded && <div>{title}</div>}
          </div>
        </NavLink>
      </li>
    );
  };
  const DocumentsNavigationItem = ({
    to,
    icon,
    title,
    testId = '',
    folder = '',
    targetSiteId = '',
  }: {
    to: string;
    icon: any;
    title: string;
    testId?: string;
    folder?: string;
    targetSiteId?: string;
  }) => {
    return (
      <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
        <NavLink
          to={to}
          data-test-id={testId}
          end
          className={({ isActive }) =>
            (isActive
              ? 'text-primary-600 bg-neutral-200 '
              : 'text-neutral-900 bg-neutral-100 hover:text-primary-500 ') +
            ' w-full text-sm font-bold flex'
          }
        >
          <FolderDropWrapper
            folder={folder}
            sourceSiteId={currentSiteId}
            targetSiteId={targetSiteId}
            className="w-full text-sm font-bold flex pl-5 py-2"
          >
            <div className="w-4 flex items-center mr-2">{icon}</div>
            {isSidebarExpanded && <div>{title}</div>}
          </FolderDropWrapper>
        </NavLink>
      </li>
    );
  };

  const ExpandableSection = (props: any) => {
    const { isExpanded, toggleExpand, title, testId, level = 0 } = props;
    return isSidebarExpanded ? (
      <li
        className="w-full flex self-start text-neutral-900 hover:text-primary-500 justify-center lg:justify-start whitespace-nowrap px-2 pt-4 pb-2 cursor-pointer"
        onClick={toggleExpand}
        data-test-id={testId}
        style={{
          paddingLeft: isSidebarExpanded
            ? `${level === 0 ? 10 : level * 16}px`
            : '0px',
        }}
      >
        <div className="flex justify-end mt-2 mr-1">
          {isExpanded ? <ArrowBottom /> : <ArrowRight />}
        </div>
        <div className="uppercase font-bold text-sm">{title}</div>
      </li>
    ) : (
      <></>
    );
  };

  const SidebarItems = () => {
    return (
      <div className="tracking-normal pb-16">
        <>
          <ExpandableSection
            isExpanded={documentsExpanded}
            toggleExpand={toggleDocumentsExpand}
            title="Documents & Folders"
            testId="expand-documents"
          />
          {(documentsExpanded || !isSidebarExpanded) && (
            <>
              {hasUserSite && (
                <>
                  <DocumentsNavigationItem
                    to="/my-documents"
                    icon={<Documents />}
                    title="My Documents"
                    testId="nav-my-documents"
                    targetSiteId={user?.email || ''}
                    folder={''}
                  />
                  {QuickFolderList(
                    user?.email || '',
                    currentSiteId === user?.email && subfolderUri.length
                      ? subfolderUri.split('/')
                      : [],
                    folders
                  )}
                  {currentSiteId === user?.email && (
                    <>
                      <ExpandableSection
                        isExpanded={userSiteDocumentQueuesExpanded}
                        toggleExpand={toggleUserSiteDocumentQueuesExpand}
                        title="Queues"
                        testId="expand-queues"
                        level={1}
                      />
                      {userSiteDocumentQueuesExpanded &&
                        isSidebarExpanded &&
                        userSiteDocumentQueues.map((queue: any, i: number) => {
                          return (
                            <span key={i}>
                              <NavigationItem
                                to={`/my-documents/queues/${queue.queueId}`}
                                icon={<Queue />}
                                title={
                                  queue.name.length > 20
                                    ? `${queue.name.substring(0, 20)}...`
                                    : queue.name
                                }
                                testId="nav-queue"
                                level={1}
                              />
                            </span>
                          );
                        })}
                      {userSiteDocumentQueuesExpanded &&
                        isSidebarExpanded &&
                        !userSiteDocumentQueues.length && (
                          <div className="text-xs pl-8">(no queues found)</div>
                        )}
                      {userSiteDocumentQueuesExpanded && isSidebarExpanded && (
                        <div className="mb-2"></div>
                      )}
                    </>
                  )}
                </>
              )}
              {hasDefaultSite && (
                <>
                  <DocumentsNavigationItem
                    to={hasUserSite ? '/team-documents' : '/documents'}
                    icon={
                      hasUserSite ? (
                        <>
                          <div className="-mt-0.5">
                            <Documents />
                          </div>
                          <div className="-mt-2.5 -ml-0.5">
                            <ShareHand />
                          </div>
                        </>
                      ) : (
                        <Documents />
                      )
                    }
                    title={hasUserSite ? 'Team Documents' : 'Documents'}
                    testId="nav-team-documents"
                    targetSiteId={'default'}
                    folder={''}
                  />
                  {isSidebarExpanded &&
                    QuickFolderList(
                      'default',
                      currentSiteId === 'default' && subfolderUri.length
                        ? subfolderUri.split('/')
                        : [],
                      folders
                    )}
                  {currentSiteId === 'default' && (
                    <>
                      <ExpandableSection
                        isExpanded={defaultSiteDocumentQueuesExpanded}
                        toggleExpand={toggleDefaultSiteDocumentQueuesExpand}
                        title="Queues"
                        testId="expand-queues"
                        level={1}
                      />
                      {defaultSiteDocumentQueuesExpanded &&
                        isSidebarExpanded &&
                        defaultSiteDocumentQueues.map(
                          (queue: any, i: number) => {
                            return (
                              <span key={i}>
                                <NavigationItem
                                  to={
                                    (hasUserSite
                                      ? '/team-documents'
                                      : '/documents') +
                                    '/queues/' +
                                    queue.queueId
                                  }
                                  icon={<Queue />}
                                  title={
                                    queue.name.length > 20
                                      ? `${queue.name.substring(0, 20)}...`
                                      : queue.name
                                  }
                                  testId="nav-queue"
                                  level={1}
                                />
                              </span>
                            );
                          }
                        )}
                      {defaultSiteDocumentQueuesExpanded &&
                        isSidebarExpanded &&
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
                    <ExpandableSection
                      isExpanded={workspacesExpanded}
                      toggleExpand={toggleWorkspacesExpand}
                      title="Workspaces"
                      testId="expand-workspaces"
                    />
                  )}
                  {isSidebarExpanded ? (
                    (workspacesExpanded || (!hasUserSite && !hasDefaultSite)) &&
                    workspaceSites.map((site: any, i: number) => {
                      return (
                        <span key={i}>
                          <DocumentsNavigationItem
                            to={'/workspaces/' + site.siteId}
                            icon={<Workspace />}
                            title={site.siteId.replaceAll('_', ' ')}
                            testId="nav-workspace"
                            targetSiteId={site.siteId}
                            folder={''}
                          />
                          {QuickFolderList(
                            site.siteId,
                            currentSiteId === site.siteId && subfolderUri.length
                              ? subfolderUri.split('/')
                              : [],
                            folders
                          )}
                          {currentSiteId === site.siteId && (
                            <>
                              <ExpandableSection
                                isExpanded={otherSiteDocumentQueuesExpanded}
                                toggleExpand={
                                  toggleOtherSiteDocumentQueuesExpand
                                }
                                title="Queues"
                                testId="expand-queues"
                                level={2}
                              />
                              {otherSiteDocumentQueuesExpanded &&
                                otherSiteDocumentQueues.map(
                                  (queue: any, i: number) => {
                                    return (
                                      <span key={i}>
                                        <NavigationItem
                                          to={
                                            '/workspaces/' +
                                            currentSiteId +
                                            '/queues/' +
                                            queue.queueId
                                          }
                                          icon={<Queue />}
                                          title={
                                            queue.name.length > 20
                                              ? `${queue.name.substring(
                                                  0,
                                                  20
                                                )}...`
                                              : queue.name
                                          }
                                          testId="nav-queue"
                                          level={1}
                                        />
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
                    })
                  ) : (
                    <>
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
                    </>
                  )}
                </>
              )}
              {!isSiteReadOnly && (
                <>
                  <NavigationItem
                    to={`${specialFoldersRootUri}/folders/favorites`}
                    icon={<Star />}
                    title="Favorites"
                    testId="nav-favorites"
                    level={0}
                  />

                  {useSoftDelete && (
                    <NavigationItem
                      to={`${specialFoldersRootUri}/folders/deleted`}
                      icon={<Trash />}
                      title="Trash"
                      testId="nav-trash"
                      level={0}
                    />
                  )}
                </>
              )}
              <div className="flex w-full">
                <div className="w-full mt-2 border-b border-neutral-300"></div>
              </div>
            </>
          )}
          <ExpandableSection
            isExpanded={integrationsExpanded}
            toggleExpand={toggleIntegrationsExpand}
            title={
              formkiqVersion.type !== 'core'
                ? 'Workflows & Integrations'
                : 'Integrations'
            }
            testId="expand-integrations"
          />
          {(integrationsExpanded || !isSidebarExpanded) && (
            <>
              {formkiqVersion.type !== 'core' && (
                <NavigationItem
                  to={
                    '/workflows' +
                    (pathname.indexOf('workspaces') > 0
                      ? '/workspaces/' + currentSiteId
                      : '')
                  }
                  icon={<Workflow />}
                  title="Workflows"
                  testId="nav-workflows"
                />
              )}
              {formkiqVersion.type !== 'core' && (
                <NavigationItem
                  to={
                    '/queues' +
                    (pathname.indexOf('workspaces') > 0
                      ? '/workspaces/' + currentSiteId
                      : '')
                  }
                  icon={<Queue />}
                  title="Queues"
                  testId="nav-queues"
                />
              )}
              <NavigationItem
                to={
                  '/attributes' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                icon={<Attribute />}
                title="Attributes"
                testId="nav-attributes"
              />
              <NavigationItem
                to="/integrations/api"
                icon={<Api />}
                title="API Explorer"
                testId="nav-api-explorer"
              />
              <NavigationItem
                to="/integrations/webhooks"
                icon={<Webhook />}
                title="Webhooks"
                testId="nav-webhooks"
              />
              {formkiqVersion.type !== 'core' && (
                <NavigationItem
                  to={
                    '/rulesets' +
                    (pathname.indexOf('workspaces') > 0
                      ? '/workspaces/' + currentSiteId
                      : '')
                  }
                  icon={<Rules />}
                  title="Rulesets"
                  testId="nav-rulesets"
                />
              )}
              <NavigationItem
                to="/object-examine-tool"
                icon={<Examine />}
                title="Object Examine Tool"
                testId="nav-object-examine"
              />
              <NavigationItem
                to={
                  '/schemas' +
                  (pathname.indexOf('workspaces') > 0
                    ? '/workspaces/' + currentSiteId
                    : '')
                }
                icon={<Schema />}
                title="Schemas"
                testId="nav-schemas"
              />
              {formkiqVersion.type !== 'core' && (
                <NavigationItem
                  to="/mappings"
                  icon={<Mapping />}
                  title="Mappings"
                  testId="nav-mappings"
                />
              )}
              <div className="flex w-full">
                <div className="w-full mt-4 border-b border-neutral-300"></div>
              </div>
            </>
          )}
          {user?.isAdmin && (
            <>
              <ExpandableSection
                title="Administration"
                expanded={adminExpanded}
                toggleExpand={toggleAdminExpand}
                testId="nav-admin"
              />

              {(adminExpanded || !isSidebarExpanded) && (
                <>
                  <NavigationItem
                    to="/admin/settings"
                    icon={<Settings />}
                    title="Settings"
                    testId="nav-settings"
                  />
                  <NavigationItem
                    to={
                      '/admin/api-keys' +
                      (pathname.indexOf('workspaces') > 0
                        ? '/workspaces/' + currentSiteId
                        : '')
                    }
                    icon={<ApiKey />}
                    title="API Keys"
                    testId="nav-api-keys"
                  />
                  {userAuthenticationType === 'cognito' && (
                    <>
                      <NavigationItem
                        to="/admin/groups"
                        icon={<Group />}
                        title="Groups"
                        testId="nav-groups"
                      />
                      <NavigationItem
                        to="/admin/users"
                        icon={<Users />}
                        title="Users"
                        testId="nav-users"
                      />
                    </>
                  )}
                  {formkiqVersion.modules.includes('opa') && (
                    <NavigationItem
                      to="/admin/access-control"
                      icon={<AccessControl />}
                      title="Access Control"
                      testId="nav-access-control"
                    />
                  )}
                  <NavigationItem
                    to="/admin/user-activities"
                    icon={<HistoryIcon />}
                    title="User Activities"
                    testId="nav-user-activities"
                  />
                </>
              )}
            </>
          )}
        </>
      </div>
    );
  };

  return (
    <div
      className={
        (sidebarExpanded ? 'w-64' : 'w-14') +
        ' relative bg-neutral-100 h-screen overflow-y-auto'
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
