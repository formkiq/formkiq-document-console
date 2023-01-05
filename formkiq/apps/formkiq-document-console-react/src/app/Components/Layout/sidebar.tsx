import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from "react-redux";
import { Section, User } from '../../Store/reducers/auth';
import { RootState } from '../../Store/store';
import { DoubleChevronLeft, DoubleChevronRight, Documents, FolderOutline, ShareHand, Workflow, Api, Webhook, UserIcon, Star, Trash, Settings, ArrowRight, ArrowBottom, ComingSoon, DoublePerson, Recent, Help, Collection, CollectionAdd } from '../Icons/icons';
import FolderDropWrapper from '../DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import SharedFoldersModal from './sharedFoldersModal';
import { getUserSites, getCurrentSiteInfo } from '../../helpers/services/toolService'
import { DocumentsAndFoldersPrefixes, WorkflowsAndIntegrationsPrefixes, AccountAndSettingsPrefixes } from '../../helpers/constants/pagePrefixes';
import { setIsSidebarExpanded, setIsSharedFoldersExpanded } from '../../Store/reducers/config'

export function Sidebar(props: {
  user: User;
  section: Section;
  isSidebarExpanded: boolean;
  isSharedFoldersExpanded: boolean;
  brand: string;
  formkiqVersion: any;
  useAccountAndSettings: boolean;
  useSoftDelete: boolean;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites } =
    getUserSites(props.user);
  const pathname = useLocation().pathname;
  const {
    siteId,
    siteRedirectUrl,
    siteDocumentsRootUri,
    siteDocumentsRootName,
  } = getCurrentSiteInfo(
    pathname,
    props.user,
    hasUserSite,
    hasDefaultSite,
    hasSharedFolders,
    sharedFolderSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [currentDocumentsRootName, setCurrentDocumentsRootName] = useState(
    siteDocumentsRootName
  );
  const [sidebarExpanded, setSidebarExpanded] = useState(
    props.isSidebarExpanded
  );
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  let expandSharedFoldersInitially = props.isSharedFoldersExpanded;
  if (currentDocumentsRootUri.indexOf('/shared-folders') === 0) {
    expandSharedFoldersInitially = true;
  }
  const [sharedFoldersExpanded, setSharedFoldersExpanded] = useState(
    expandSharedFoldersInitially
  );
  const [integrationsExpanded, setIntegrationsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [isSharedFoldersModalOpened, setSharedFoldersModalOpened] =
    useState(false);

  const locationPrefix = window.location.pathname.substring(
    0,
    window.location.pathname.indexOf('/', 1)
  );
  useEffect(() => {
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
      props.user,
      hasUserSite,
      hasDefaultSite,
      hasSharedFolders,
      sharedFolderSites
    );
    setCurrentSiteId(recheckSiteInfo.siteId);
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
    setCurrentDocumentsRootName(recheckSiteInfo.siteDocumentsRootName);
  }, [pathname]);

  const toggleSidebarExpand = () => {
    dispatch(setIsSidebarExpanded(!sidebarExpanded));
    setSidebarExpanded(!sidebarExpanded);
  };
  const toggleDocumentsExpand = () => {
    setDocumentsExpanded(!documentsExpanded);
  };
  const toggleSharedFoldersExpand = () => {
    if (!sharedFoldersExpanded) {
      setDocumentsExpanded(true);
    }
    dispatch(setIsSharedFoldersExpanded(!sharedFoldersExpanded))
    setSharedFoldersExpanded(!sharedFoldersExpanded);
  };
  const toggleIntegrationsExpand = () => {
    setIntegrationsExpanded(!integrationsExpanded);
  };
  const toggleSettingsExpand = () => {
    setSettingsExpanded(!settingsExpanded);
  };
  const onSharedFoldersClick = (event: any) => {
    setSharedFoldersModalOpened(true);
  };
  const onSharedFoldersModalClose = () => {
    setSharedFoldersModalOpened(false);
  };

  const SidebarItems = () => {
    return (
      <div>
        {props.formkiqVersion &&
          props.formkiqVersion.type &&
          props.isSidebarExpanded && (
            <li className="text-xxs flex justify-center -mt-1 mb-4">
              {props.formkiqVersion.type.toUpperCase()} v
              {props.formkiqVersion.version}
            </li>
          )}
        {props.isSidebarExpanded ? (
          <>
            <li
              className="w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
              onClick={toggleDocumentsExpand}
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
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to="/my-documents"
                      end
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-coreOrange-500 bg-gray-100 '
                          : 'text-gray-500') +
                        ' w-full text-sm font-medium flex bg-white'
                      }
                    >
                      <FolderDropWrapper
                        folder={''}
                        sourceSiteId={currentSiteId}
                        targetSiteId={props.user.email}
                        className={
                          'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                        }
                      >
                        <div className="w-4 flex items-center mr-2">
                          <Documents />
                        </div>
                        <div>My Documents</div>
                      </FolderDropWrapper>
                    </NavLink>
                  </li>
                )}
                {hasDefaultSite && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to={hasUserSite ? '/shared-documents' : '/documents'}
                      end
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-coreOrange-500 bg-gray-100 '
                          : 'text-gray-500') +
                        ' w-full text-sm font-medium flex bg-white'
                      }
                    >
                      <FolderDropWrapper
                        folder={''}
                        sourceSiteId={currentSiteId}
                        targetSiteId={'default'}
                        className={
                          'w-full text-sm font-medium flex pl-5 py-4 bg-white'
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
                            <span>Shared Documents</span>
                          ) : (
                            <span>Documents</span>
                          )}
                        </div>
                      </FolderDropWrapper>
                    </NavLink>
                  </li>
                )}
                {hasSharedFolders && (
                  <>
                    <li
                      className="w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
                      onClick={toggleSharedFoldersExpand}
                    >
                      <div className="flex justify-end mt-2 mr-1">
                        {sharedFoldersExpanded ? (
                          <ArrowBottom />
                        ) : (
                          <ArrowRight />
                        )}
                      </div>
                      <div className="pl-1 uppercase text-xs">
                        Shared Folders
                      </div>
                    </li>
                    {sharedFoldersExpanded &&
                      sharedFolderSites.map((site: any, i: number) => {
                        return (
                          <li
                            key={i}
                            className="pl-3 w-full flex self-start justify-center lg:justify-start whitespace-nowrap"
                          >
                            <NavLink
                              to={'/shared-folders/' + site.siteId}
                              end
                              className={({ isActive }) =>
                                (isActive
                                  ? 'text-coreOrange-500 bg-gray-100 '
                                  : 'text-gray-500') +
                                ' w-full text-sm font-medium flex bg-white'
                              }
                            >
                              <FolderDropWrapper
                                folder={''}
                                sourceSiteId={currentSiteId}
                                targetSiteId={site.siteId}
                                className={
                                  'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                                }
                              >
                                <div className="w-4 flex flex-wrap items-center mr-2">
                                  <div>
                                    <FolderOutline />
                                  </div>
                                  <div className="-mt-3 -ml-0.5">
                                    <ShareHand />
                                  </div>
                                </div>
                                <div>
                                  <span>{site.siteId.replace('_', ' ')}</span>
                                </div>
                              </FolderDropWrapper>
                            </NavLink>
                          </li>
                        );
                      })}
                  </>
                )}
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to={`${currentDocumentsRootUri}/folders/favorites`}
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-500 bg-gray-100 '
                        : 'text-gray-500') +
                      ' w-full text-sm font-medium flex bg-white'
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Star />
                      </div>
                      <div>Favorites</div>
                    </div>
                  </NavLink>
                </li>
                {props.useSoftDelete && (
                  <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                    <NavLink
                      to={`${currentDocumentsRootUri}/folders/deleted`}
                      className={({ isActive }) =>
                        (isActive
                          ? 'text-coreOrange-500 bg-gray-100 '
                          : 'text-gray-500') +
                        ' w-full text-sm font-medium flex bg-white'
                      }
                    >
                      <div
                        className={
                          'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                        }
                      >
                        <div className="w-4 h-4 flex items-center mr-2">
                          <Trash />
                        </div>
                        <div>Deleted Documents</div>
                      </div>
                    </NavLink>
                  </li>
                )}
                <div className="flex w-full">
                  <div className="w-full mt-2 mx-6 border-b"></div>
                </div>
              </>
            )}
            <li
              className="mt-4 w-full flex self-start text-gray-600 hover:text-gray-700 justify-center lg:justify-start whitespace-nowrap px-4 pt-4 pb-2 cursor-pointer"
              onClick={toggleIntegrationsExpand}
            >
              <div className="flex justify-end mt-2 mr-1">
                {integrationsExpanded ? <ArrowBottom /> : <ArrowRight />}
              </div>
              <div className="uppercase font-semibold text-xs">
                Workflows & Integrations
              </div>
            </li>
            {integrationsExpanded && (
              <>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/workflows"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-500 bg-gray-100 '
                        : 'text-gray-500') +
                      ' w-full text-sm font-medium flex bg-white'
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex items-center pl-5 py-4 bg-white'
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Workflow />
                      </div>
                      <div>Workflows</div>
                      <div className="flex ml-2 grow justify-start">
                        <div className="w-10">
                          <ComingSoon />
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/integrations/api"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-500 bg-gray-100 '
                        : 'text-gray-500') +
                      ' w-full text-sm font-medium flex bg-white'
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Api />
                      </div>
                      <div>API Explorer</div>
                    </div>
                  </NavLink>
                </li>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/integrations/webhooks"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-500 bg-gray-100 '
                        : 'text-gray-500') +
                      ' w-full text-sm font-medium flex bg-white'
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                      }
                    >
                      <div className="w-4 flex items-center mr-2">
                        <Webhook />
                      </div>
                      <div>Inbound Webhooks</div>
                    </div>
                  </NavLink>
                </li>
                <div className="flex w-full">
                  <div className="w-full mt-2 mx-6 border-b"></div>
                </div>
              </>
            )}
            {props.useAccountAndSettings && (
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
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/account"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-coreOrange-500 bg-gray-100 '
                            : 'text-gray-500') +
                          ' w-full text-sm font-medium flex bg-white'
                        }
                      >
                        <div
                          className={
                            'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                          }
                        >
                          <div className="w-4 flex items-center mr-2">
                            <UserIcon />
                          </div>
                          <div>Account</div>
                        </div>
                      </NavLink>
                    </li>
                    <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                      <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                          (isActive
                            ? 'text-coreOrange-500 bg-gray-100 '
                            : 'text-gray-500') +
                          ' w-full text-sm font-medium flex bg-white'
                        }
                      >
                        <div
                          className={
                            'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                          }
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
                      ? 'text-coreOrange-500 bg-gray-100 '
                      : 'text-gray-500') +
                    ' w-full text-sm font-medium flex bg-white'
                  }
                >
                  <FolderDropWrapper
                    folder={''}
                    sourceSiteId={currentSiteId}
                    targetSiteId={props.user.email}
                    className={
                      'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                    }
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
                  to={hasUserSite ? '/shared-documents' : '/documents'}
                  end
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-coreOrange-500 bg-gray-100 '
                      : 'text-gray-500') +
                    ' w-full text-sm font-medium flex bg-white'
                  }
                >
                  <FolderDropWrapper
                    folder={''}
                    sourceSiteId={currentSiteId}
                    targetSiteId={'default'}
                    className={
                      'w-full text-sm font-medium flex pl-5 py-3 bg-white'
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
                  </FolderDropWrapper>
                </NavLink>
              </li>
            )}
            {hasSharedFolders && (
              <div className="w-full text-sm font-medium flex pl-5 py-3 bg-white mb-4">
                <div
                  className="w-4 flex flex-wrap items-center mr-2 cursor-pointer"
                  onClick={onSharedFoldersClick}
                >
                  <div>
                    <FolderOutline />
                  </div>
                  <div className="-mt-3 -ml-0.5">
                    <ShareHand />
                  </div>
                </div>
              </div>
            )}
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={`${currentDocumentsRootUri}/folders/favorites`}
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-500 bg-gray-100 '
                    : 'text-gray-500') +
                  ' w-full text-sm font-medium flex bg-white'
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Star />
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to={`${currentDocumentsRootUri}/folders/deleted`}
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-500 bg-gray-100 '
                    : 'text-gray-500') +
                  ' w-full text-sm font-medium flex bg-white'
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                  }
                >
                  <div className="w-4 h-4 flex items-center mr-2">
                    <Trash />
                  </div>
                </div>
              </NavLink>
            </li>
            <div className="flex w-full">
              <div className="w-full mt-2 mx-2 border-b"></div>
            </div>
            <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
              <NavLink
                to="/workflows"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-500 bg-gray-100 '
                    : 'text-gray-500') +
                  ' w-full text-sm font-medium flex bg-white'
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex items-center pl-5 py-4 bg-white'
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
                to="/integrations/api"
                className={({ isActive }) =>
                  (isActive
                    ? 'text-coreOrange-500 bg-gray-100 '
                    : 'text-gray-500') +
                  ' w-full text-sm font-medium flex bg-white'
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                  }
                >
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
                    ? 'text-coreOrange-500 bg-gray-100 '
                    : 'text-gray-500') +
                  ' w-full text-sm font-medium flex bg-white'
                }
              >
                <div
                  className={
                    'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                  }
                >
                  <div className="w-4 flex items-center mr-2">
                    <Webhook />
                  </div>
                </div>
              </NavLink>
            </li>
            {props.useAccountAndSettings && (
              <>
                <div className="flex w-full">
                  <div className="w-full mt-2 mx-2 border-b"></div>
                </div>
                <li className="w-full flex self-start justify-center lg:justify-start whitespace-nowrap">
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-coreOrange-500 bg-gray-100 '
                        : 'text-gray-500') +
                      ' w-full text-sm font-medium flex bg-white'
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                      }
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
                        ? 'text-coreOrange-500 bg-gray-100 '
                        : 'text-gray-500') +
                      ' w-full text-sm font-medium flex bg-white'
                    }
                  >
                    <div
                      className={
                        'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                      }
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
            (sidebarExpanded ? 'w-62' : 'w-10') +
            ' flex fixed z-30 justify-between mt-2'
          }
        >
          <Link to="/">
            {sidebarExpanded ? (
              // eslint-disable-next-line react/jsx-no-useless-fragment
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
              (sidebarExpanded ? 'justify-end mr-6 ' : 'justify-end') +
              ' text-gray-400 flex mt-2 cursor-pointer '
            }
            onClick={toggleSidebarExpand}
          >
            <div className={(!sidebarExpanded ? '' : '-mt-1.5') + ' w-5'}>
              {sidebarExpanded ? <DoubleChevronRight /> : <DoubleChevronLeft />}
            </div>
          </div>
        </div>
        <div
          className={
            (sidebarExpanded ? 'w-62' : 'w-12') +
            ' flex flex-wrap fixed bg-white '
          }
        >
          <div
            className={
              (sidebarExpanded ? 'w-52 mx-6' : 'w-12 ml-2') +
              ' pt-10.5 mt-3 border-b '
            }
          ></div>
        </div>
        {props.user && (
          <nav className="grow mt-16">
            <ul className="flex lg:flex-col gap-1">
              <SidebarItems />
            </ul>
          </nav>
        )}
      </div>
      <SharedFoldersModal
        isOpened={isSharedFoldersModalOpened}
        onClose={onSharedFoldersModalClose}
        sharedFolderSites={sharedFolderSites}
      />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user, section } = state.authReducer;
  const { isSidebarExpanded, isSharedFoldersExpanded, brand, formkiqVersion, useAccountAndSettings, useSoftDelete } = state.configReducer
  return { user, section, isSidebarExpanded, isSharedFoldersExpanded, brand, formkiqVersion, useAccountAndSettings, useSoftDelete }
};

  
export default connect(mapStateToProps)(Sidebar as any);