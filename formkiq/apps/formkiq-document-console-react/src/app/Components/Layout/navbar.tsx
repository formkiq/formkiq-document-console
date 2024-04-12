import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthState, logout } from '../../Store/reducers/auth';
import { ConfigState } from '../../Store/reducers/config';
import { DataCacheState } from '../../Store/reducers/data';
import { useAppDispatch } from '../../Store/store';
import { TopLevelFolders } from '../../helpers/constants/folders';
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
import { useSubfolderUri } from '../../hooks/subfolder-uri.hook';
import SearchInput from '../DocumentsAndFolders/Search/searchInput';
import {
  Admin,
  Api,
  ApiKey,
  Bell,
  Documents,
  Examine,
  Queue,
  Recent,
  Rules,
  Schema,
  Settings,
  Share,
  ShareHand,
  Star,
  Trash,
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(AuthState);
  const { useNotifications, isSidebarExpanded } = useSelector(ConfigState);
  const { currentDocumentPath } = useSelector(DataCacheState);

  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId, siteDocumentsRootUri, siteDocumentsRootName } =
    getCurrentSiteInfo(
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
    } else if (AccountAndSettingsPrefixes.indexOf(locationPrefix) > -1) {
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
      navigate(`documents?searchWord=${inputValue}`);
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
    let newDocumentsRootUri;
    if (newSiteId === user?.email) {
      newDocumentsRootUri = location.pathname.split('/')[1];
    } else if (newSiteId === 'default') {
      newDocumentsRootUri = location.pathname.split('/')[1];
    } else {
      newDocumentsRootUri =
        location.pathname.split('/')[1] + '/workspaces/' + newSiteId;
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
  }, [documentId]);

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
                        <select
                          data-test-id="system-subfolder-select"
                          className="ml-4 text-xs bg-gray-100 px-2 py-1 rounded-md"
                          value={currentSiteId}
                          onChange={(event) => {
                            changeSystemSubfolder(event, subfolderUri);
                          }}
                        >
                          {hasUserSite && (
                            <option value={user?.email}>My Documents</option>
                          )}
                          {hasUserSite && hasDefaultSite && (
                            <option value="default">Team Documents</option>
                          )}
                          {!hasUserSite && hasDefaultSite && (
                            <option value="default">Documents</option>
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
                      )}
                    </>
                  ) : (
                    <>
                      {locationPrefix === '/workflows' ||
                      locationPrefix === '/queues' ||
                      locationPrefix === '/integrations' ||
                      locationPrefix === '/account' ||
                      locationPrefix === '/schemas' ||
                      locationPrefix === '/object-examine-tool' ||
                      locationPrefix === 'rulesets' ? (
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

                            {pathname.indexOf('/integrations/api') > -1 &&
                              pathname.indexOf('/integrations/apiKeys') ===
                                -1 && (
                                <div className="w-5">
                                  <Api />
                                </div>
                              )}
                            {pathname.indexOf('/integrations/apiKeys') > -1 && (
                              <div className="w-5">
                                <ApiKey />
                              </div>
                            )}
                            {pathname.indexOf('/integrations/webhooks') >
                              -1 && (
                              <div className="w-5">
                                <Webhook />
                              </div>
                            )}
                            {pathname.indexOf('/account/settings') > -1 && (
                              <div className="w-5">
                                <Settings />
                              </div>
                            )}
                            {pathname.indexOf('/rulesets') > -1 && (
                              <span>Rulesets</span>
                            )}
                            {pathname.indexOf('/accessControl') > -1 && (
                              <div className="w-5">
                                <Admin />
                              </div>
                            )}
                          </div>

                          {pathname.indexOf('/rulesets') > -1 &&
                            ((hasUserSite && hasDefaultSite) ||
                              (hasUserSite && hasWorkspaces) ||
                              (hasDefaultSite && hasWorkspaces) ||
                              (hasWorkspaces && workspaceSites.length > 1)) && (
                              <select
                                data-test-id="system-subfolder-select"
                                className="ml-4 text-xs bg-gray-100 px-2 py-1 rounded-md"
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
                                    Team Documents
                                  </option>
                                )}
                                {!hasUserSite && hasDefaultSite && (
                                  <option value="default">Documents</option>
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
                            )}

                          <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 ">
                            {pathname.indexOf('/workflows') > -1 && (
                              <span>Workflows</span>
                            )}
                            {pathname.indexOf('/queues') > -1 && (
                              <span>Queues</span>
                            )}
                            {pathname.indexOf('/integrations/api') > -1 &&
                              pathname.indexOf('/integrations/apiKeys') ===
                                -1 && <span>API Explorer</span>}
                            {pathname.indexOf('/integrations/apiKeys') > -1 && (
                              <span>API Keys</span>
                            )}
                            {pathname.indexOf('/object-examine-tool') > -1 && (
                              <span>Examine PDF</span>
                            )}
                            {pathname.indexOf('/integrations/webhooks') >
                              -1 && <span>Inbound Webhooks</span>}
                            {pathname.indexOf('/account/settings') > -1 && (
                              <span>Settings</span>
                            )}
                            {pathname.indexOf('/account/accessControl') >
                              -1 && <span>Access Control (OPA)</span>}
                            {pathname.indexOf('/schemas') > -1 && (
                              <span>Schemas</span>
                            )}
                          </div>
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
                                <span className="pl-8">
                                  <a
                                    href={
                                      siteDocumentsRootUri +
                                      '/folders/' +
                                      currentDocumentPath.substring(
                                        0,
                                        currentDocumentPath.lastIndexOf('/')
                                      ) +
                                      '#id=' +
                                      documentId
                                    }
                                    className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer whitespace-nowrap"
                                  >
                                    view folder
                                  </a>
                                </span>
                                <span className="pl-6">
                                  <span
                                    className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer whitespace-nowrap"
                                    onClick={DownloadDocument}
                                  >
                                    download
                                  </span>
                                </span>
                                {hasDocumentVersions && (
                                  <span className="pl-6">
                                    <a
                                      href={
                                        siteDocumentsRootUri +
                                        '/folders/' +
                                        currentDocumentPath.substring(
                                          0,
                                          currentDocumentPath.lastIndexOf('/')
                                        ) +
                                        '#history_id=' +
                                        documentId
                                      }
                                      className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer whitespace-nowrap"
                                    >
                                      view versions
                                    </a>
                                  </span>
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
              {!documentId.length && currentSection === 'DocumentsAndFolders' && (
                <div className="flex items-center gap-5 w-1/2">
                  <SearchInput
                    onChange={updateInputValue}
                    onKeyDown={handleKeyDown}
                    siteId={currentSiteId}
                    documentsRootUri={currentDocumentsRootUri}
                    value={inputValue}
                  />
                </div>
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
                      <li onClick={ToggleAccountSettings}>
                        <Link
                          to="/account/settings"
                          className="dropdown-item text-sm py-2 px-5 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 transition"
                        >
                          Settings
                        </Link>
                      </li>
                      <li onClick={ToggleAccountSettings}>
                        <Link
                          to="/account/accessControl"
                          className="dropdown-item text-sm py-2 px-5 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 transition"
                        >
                          Access Control
                        </Link>
                      </li>
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
      </div>
    )
  );
}

export default Navbar;
