import React, { useEffect, useState } from 'react';
import { matchPath } from "react-router"
import { connect, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, User } from '../../Store/reducers/auth';
import { RootState } from '../../Store/store';
import { Bell, FolderOutline } from '../Icons/icons';
import { getFileIcon, getUserSites, getCurrentSiteInfo, parseSubfoldersFromUrl } from "../../helpers/services/toolService"
import { DocumentsService } from '../../helpers/services/documentsService'
import Notifications from './notifications';
import SearchInput from '../DocumentsAndFolders/Search/searchInput';
import FolderDropWrapper from '../DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import { IDocument } from "../../helpers/types/document"
import { IDocumentTag } from "../../helpers/types/documentTag"
import { DocumentsAndFoldersPrefixes, WorkflowsAndIntegrationsPrefixes, AccountAndSettingsPrefixes } from '../../helpers/constants/pagePrefixes';
import { TopLevelFolders } from '../../helpers/constants/folders';
import moment from "moment"

function Navbar(props: { user: User, isSidebarExpanded: boolean, brand: string, formkiqVersion: any, useAdvancedSearch: boolean, useNotifications: boolean, allTags: any[] }) {
  const search = useLocation().search
  const searchWord = new URLSearchParams(search).get('searchWord')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites } = getUserSites(props.user);
  const pathname = useLocation().pathname
  const { siteId, siteDocumentsRootUri, siteDocumentsRootName } = getCurrentSiteInfo(pathname, props.user, hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites)
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] = useState(siteDocumentsRootUri);
  const [currentDocumentsRootName, setCurrentDocumentsRootName] = useState(siteDocumentsRootName);
  
  let subfolderLevelPath = matchPath(
    {
      path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04/:subfolderLevel05/:subfolderLevel06/:subfolderLevel07/:subfolderLevel08/:subfolderLevel09/:subfolderLevel10`,
    },
    window.location.pathname
  ) as any;
  if (!subfolderLevelPath) {
    subfolderLevelPath = matchPath(
      {
        path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04/:subfolderLevel05/:subfolderLevel06/:subfolderLevel07/:subfolderLevel08/:subfolderLevel09`,
      },
      window.location.pathname
    ) as any;
    if (!subfolderLevelPath) {
      subfolderLevelPath = matchPath(
        {
          path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04/:subfolderLevel05/:subfolderLevel06/:subfolderLevel07/:subfolderLevel08`,
        },
        window.location.pathname
      ) as any;
      if (!subfolderLevelPath) {
        subfolderLevelPath = matchPath(
          {
            path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04/:subfolderLevel05/:subfolderLevel06/:subfolderLevel07`,
          },
          window.location.pathname
        ) as any;
        if (!subfolderLevelPath) {
          subfolderLevelPath = matchPath(
            {
              path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04/:subfolderLevel05/:subfolderLevel06`,
            },
            window.location.pathname
          ) as any;
          if (!subfolderLevelPath) {
            subfolderLevelPath = matchPath(
              {
                path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04/:subfolderLevel05`,
              },
              window.location.pathname
            ) as any;
            if (!subfolderLevelPath) {
              subfolderLevelPath = matchPath(
                {
                  path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03/:subfolderLevel04`,
                },
                window.location.pathname
              ) as any;
              if (!subfolderLevelPath) {
                subfolderLevelPath = matchPath(
                  {
                    path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02/:subfolderLevel03`,
                  },
                  window.location.pathname
                ) as any;
                if (!subfolderLevelPath) {
                  subfolderLevelPath = matchPath(
                    {
                      path: `${currentDocumentsRootUri}/folders/:subfolderLevel01/:subfolderLevel02`,
                    },
                    window.location.pathname
                  ) as any;
                  if (!subfolderLevelPath) {
                    subfolderLevelPath = matchPath(
                      {
                        path: `${currentDocumentsRootUri}/folders/:subfolderLevel01`,
                      },
                      window.location.pathname
                    ) as any;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  let subfolderUri = ''
  if (subfolderLevelPath) {
    subfolderUri = parseSubfoldersFromUrl(
      subfolderLevelPath.params.subfolderLevel01,
      subfolderLevelPath.params.subfolderLevel02,
      subfolderLevelPath.params.subfolderLevel03,
      subfolderLevelPath.params.subfolderLevel04,
      subfolderLevelPath.params.subfolderLevel05,
      subfolderLevelPath.params.subfolderLevel06,
      subfolderLevelPath.params.subfolderLevel07,
      subfolderLevelPath.params.subfolderLevel08,
      subfolderLevelPath.params.subfolderLevel09,
      subfolderLevelPath.params.subfolderLevel10
    )
  }

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(pathname, props.user, hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites)
    setCurrentSiteId(recheckSiteInfo.siteId)
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri)
    setCurrentDocumentsRootName(recheckSiteInfo.siteDocumentsRootName)
  }, [pathname])

  const foldersPath = (uri: string, isDocument = false) => {
    if (uri) {
      const folderLevels = uri.split('/');
      if (folderLevels.length > 3) {
        const previousFolderLevel = uri.substring(0, uri.lastIndexOf('/'))
        return (
          <span className={'text-sm font-medium flex pr-1 py-4.1 text-gray-500 bg-whitetext-gray-500'}>
            <p className={'text-sm font-medium flex px-1'}> / </p>
              <FolderDropWrapper folder={folderLevels[0]} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                <Link to={`${currentDocumentsRootUri}/folders/` + folderLevels[0]}>{folderLevels[0]}</Link>
              </FolderDropWrapper>
            <p className={'text-sm font-medium flex px-1'}> / </p>
            <span>..</span>
            <p className={'text-sm font-medium flex px-1'}> / </p>
            <FolderDropWrapper folder={previousFolderLevel} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
              <Link to={`${currentDocumentsRootUri}/folders/` + uri.replace("/" + folderLevels[folderLevels.length - 1], "/") }>{folderLevels[folderLevels.length - 2]}</Link>
            </FolderDropWrapper>
            { !isDocument && (
              <>
                <p className={'text-sm font-medium flex px-1'}> / </p>
                <span className={'flex items-center mr-1.5'}>
                  <FolderOutline /> 
                </span>
                <span>{folderLevels[folderLevels.length - 1]}</span>
              </>
            )}
          </span>
        )
      } else {
        return(
          <span className={'text-sm font-medium flex pr-2 py-4.1 text-gray-500 bg-whitetext-gray-500'}>
            { folderLevels.length > 1 && (
              <>
                <p className={'text-sm font-medium flex px-1'}> / </p>
                <FolderDropWrapper folder={folderLevels[0]} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                  <Link to={`${currentDocumentsRootUri}/folders/` + folderLevels[0]}>{folderLevels[0]}</Link>
                </FolderDropWrapper>
              </>
            )}
            { folderLevels.length > 2 && (
              <>
                <p className={'text-sm font-medium flex px-1'}> / </p>
                <FolderDropWrapper folder={folderLevels[0] + '/' + folderLevels[1]} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                  <Link to={`${currentDocumentsRootUri}/folders/` + folderLevels[0] + "/" + folderLevels[folderLevels.length - 2]}>{folderLevels[folderLevels.length - 2]}</Link>
                </FolderDropWrapper>
              </>
            )}
            { !isDocument && (
              <>
                <p className={'text-sm font-medium flex px-1'}> / </p>
                <FolderDropWrapper folder={uri} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                  <span className={'flex items-center mt-1 mr-1.5'}>
                    <FolderOutline /> 
                  </span>
                  <span>{folderLevels[folderLevels.length - 1]}</span>
                </FolderDropWrapper>
              </>
            )}  
          </span>
        )
      }
    }
    return <></>
  }
  const documentPath = (document: IDocument | null, showSlash = true) => {
    if (document) {
      return (
        <span className={'w-full text-sm font-medium flex pr-2 py-4 text-gray-500 bg-whitetext-gray-500'}>
          { showSlash && (
            <p className={'text-sm font-medium flex pr-2'}> / </p>
          )}
          <span className={'flex items-center mr-2'}>
            <img src={getFileIcon((document as IDocument).path)} alt="File Icon" className="mr-0.5 inline-block h-6" />
          </span>
          <span>{document.filename ? document.filename : document.path}</span>
        </span>
      )
    }
    return <></>
  }

  const documentSubpaths: string[] = [
    'folders',
    'settings',
    'help',
    'new'
  ];
  
  const documentSettingsPath = (matchPath({ path: '/documents/settings' }, window.location.pathname) as any )
  const documentHelpPath = (matchPath({ path: '/documents/help' }, window.location.pathname) as any )
  const [showAccountDropdown, setShowAccountDropdown] = React.useState(false)
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false)
  const [currentSection, setCurrentSection] = useState('DocumentsAndFolders')
  const [inputValue, setInput] = useState('')
  const [document, setDocument] : [IDocument | null, any] = useState(null)
  const [documentTags, setDocumentTags] : [IDocumentTag[] | null, any] = useState([])
  
  let documentId = '';
  const documentViewPath = (matchPath({ path: `${siteDocumentsRootUri}/:id/*` }, window.location.pathname) as any )
  if (documentViewPath && documentViewPath.params && documentViewPath.params.id) {
    if (documentSubpaths.indexOf(documentViewPath.params.id) === -1) {
      documentId = documentViewPath.params.id;
    }
  }

  let locationPrefix = useLocation().pathname
  if (locationPrefix.indexOf('/', 1) > -1) {
    locationPrefix = locationPrefix.substring(0, locationPrefix.indexOf('/', 1))
  }
  useEffect(() => {
    if (DocumentsAndFoldersPrefixes.indexOf(locationPrefix) > -1) {
      setCurrentSection('DocumentsAndFolders')
    } else if (WorkflowsAndIntegrationsPrefixes.indexOf(locationPrefix) > -1) {
      setCurrentSection('WorkflowsAndIntegrations')
    } else if (AccountAndSettingsPrefixes.indexOf(locationPrefix) > -1) {
      setCurrentSection('AccountAndSettings')
    }
  }, [locationPrefix])

  useEffect(() => {
    setInput(searchWord ? searchWord : '')
  }, [search])

  useEffect(() => {
    if (documentId.length) {
      
      // TODO: use Redux / LocalStorage to keep track of the currently selected document (from doc info or doc view pages)
      // NOTE: this is instead of making a redundant API call here
  
      if ((document && documentId !== (document as IDocument).documentId) || !document) {
        DocumentsService.getDocumentById(documentId, currentSiteId).then((response: any) => {
          let filename = response.path
          if (filename.lastIndexOf('/') > -1) {
            filename = filename.substring(filename.lastIndexOf('/') + 1)
          }
          response.filename = filename
          setDocument(response);
          DocumentsService.getDocumentTags(documentId, currentSiteId).then((response:any) => {
            if (response) {  
              setDocumentTags(response.tags?.map((el: IDocumentTag) => {
                if (el.key === 'folder') {
                  if (el.value === '') {
                    el.value = '/';
                  }
                }
                el.insertedDate = moment(el.insertedDate).format('YYYY-MM-DD HH:mm')
                return el
              }))
            }
          });
        })
      }
    }
  }, [documentId])

  const redirectToSearchPage = () => {
    if (inputValue) {
      navigate(`documents?searchWord=${inputValue}`)
    }
  }
  const handleKeyDown = (ev: any) => {
    if (inputValue) {
      if (ev.key === 'Enter') {
        redirectToSearchPage()
      }
    }
  }

  const ToggleAccountSettings = () => setShowAccountDropdown(!showAccountDropdown);
  const ToggleNotifications = () => setShowNotificationsDropdown(!showNotificationsDropdown);
  const signOut = () => {
    dispatch(logout())
    ToggleAccountSettings()
  }
  
  const updateInputValue = (event: any) => {
    const val: string = event.target.value
    setInput(val)
  }

  const ParseEmailInitials = () => {
    const { user } = props
    if(user) {
      const emailUsername = user.email.substring(
        0,
        user.email.indexOf('@')
      );
      const emailParts = emailUsername.split('.');
      let initials = '';
      emailParts.forEach((part: string) => {
        initials += part[0];
      });
      initials = initials.substring(0, 3).toUpperCase();
      return <>{initials}</>;
    }
    return <></>
    
  };

  const getTopLevelFolderName = (folder: string) => {
    switch (folder) {
      case 'shared':
        return 'Shared with me'
      case 'favorites':
        return 'Favorites'
      case 'recent':
        return 'Recent'
      case 'deleted':
        return 'Trash'
      default:
        return ''
    }
  }

  const renderCurrentPage = () => {
    switch (window.location.pathname) {
      case '/workflows':
        return 'Workflows'
      case '/integrations/webhooks':
        return 'Inbound Webhooks'
      case '/integrations/api':
        return 'API Explorer'
    }
    return currentDocumentsRootName
  }

  const changeSystemSubfolder = (event: any, systemSubfolderUri: string) => {
    const newSiteId = event.target.options[event.target.selectedIndex].value
    let newDocumentsRootUri = '/documents'
    if (newSiteId === props.user.email) {
      newDocumentsRootUri = '/my-documents'
    } else if (newSiteId === 'default' && hasUserSite) {
      newDocumentsRootUri = '/team-documents'
    } else {
      newDocumentsRootUri = '/shared-folders/' + newSiteId
    }
    navigate(
      {
        pathname: `${newDocumentsRootUri}/folders/${systemSubfolderUri}`
      },
      {
        replace: true,
      }
    );
  }

  return (
    props.user && 
      <div className="flex w-full h-14.5">
        {props.useNotifications && showNotificationsDropdown && (
          <>
            {Notifications(ToggleNotifications)}
          </>
        )}
        <div className="flex grow relative flex-wrap items-center">
          <div className={ (props.isSidebarExpanded ? 'left-64' : 'left-16') + ' flex fixed top-0 right-0 z-20 h-14.5 items-center justify-between bg-white' }>
            <div className="w-7/8 flex">
              <div className={'flex ' + (documentId.length ? 'w-full' : 'w-2/3') }>
                { !props.isSidebarExpanded && (
                  <div className="w-40 pt-3">
                    <picture>
                      <source srcSet="/assets/img/png/formkiq-wordmark.webp" type="image/webp" />
                      <source srcSet="/assets/img/png/formkiq-wordmark.png" type="image/png" /> 
                      <img src="/assets/img/png/formkiq-wordmark.png" className="ml-6 mt-2 w-28 mb-2.5" alt="FormKiQ" />
                    </picture>
                  </div>
                )}
                <div className={ (props.isSidebarExpanded ? 'w-full' : 'grow') + ' flex items-center tracking-tight'}>
                  { documentSettingsPath || documentHelpPath ? (
                    <>
                      {documentSettingsPath && (
                        <Link to={`${currentDocumentsRootUri}`} className="flex font-semibold text-base cursor-pointer hover:text-coreOrange-500 pl-4">
                          <FolderDropWrapper folder={''} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'pt-3 px-2'}>
                            Documents
                          </FolderDropWrapper>
                          <span className="font-normal text-base pt-3">
                            - Settings
                          </span>
                        </Link>
                      )}
                      {documentHelpPath && (
                        <div className="flex font-semibold text-base cursor-pointer hover:text-coreOrange-500 pl-6 pt-3">
                          Help Center
                        </div>
                      )}
                    </>                      
                  ) : (
                    <>
                      { subfolderUri && TopLevelFolders.indexOf(subfolderUri) === -1 &&
                        <div className="flex w-full items-top">
                          <div className="flex items-top pt-0.5">
                            <Link to={currentDocumentsRootUri} className="font-semibold text-base cursor-pointer hover:text-coreOrange-500 pl-4">
                              <FolderDropWrapper folder={''} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'pt-3 pl-1'}>
                                { currentDocumentsRootName }
                              </FolderDropWrapper>
                            </Link>
                          </div>
                          <div className="grow flex items-top">
                            { foldersPath(subfolderUri) }
                          </div>
                        </div>
                      }
                      { subfolderUri && TopLevelFolders.indexOf(subfolderUri) !== -1 &&
                        <div className="font-semibold text-base pl-6 pt-3">
                          { getTopLevelFolderName(subfolderUri) }
                          { ((hasUserSite && hasDefaultSite) || (hasUserSite && hasSharedFolders) || (hasDefaultSite && hasSharedFolders) || (hasSharedFolders && sharedFolderSites.length > 1)) && (
                            <select
                              className="ml-4 text-xs bg-gray-100 px-2 py-1 rounded-md"
                              value={currentSiteId}
                              onChange={event => {changeSystemSubfolder(event, subfolderUri)}}
                              >
                              { hasUserSite && (
                                <option value={props.user.email}>
                                  My Documents
                                </option>
                              )}
                              { hasUserSite && hasDefaultSite && (
                                <option value='default'>
                                  Team Documents
                                </option>
                              )}
                              { !hasUserSite && hasDefaultSite && (
                                <option value='default'>
                                  Documents
                                </option>
                              )}
                              { hasSharedFolders && sharedFolderSites.length > 0 && (
                                <>
                                  { sharedFolderSites.map((sharedFolderSite, i: number) => {
                                    return (
                                      <option key={i} value={sharedFolderSite.siteId}>
                                        {sharedFolderSite.siteId}
                                      </option>
                                    )
                                  })}
                                </>
                              )}
                            </select>
                          )}
                        </div>
                      }
                      { !subfolderUri && documentId.length > 0 && (
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        <>
                          { document && (
                            <>
                              <Link to={currentDocumentsRootUri} className="font-semibold text-base cursor-pointer hover:text-coreOrange-500 pl-6 -mt-1 pr-1">
                                { currentDocumentsRootName }
                              </Link>
                              { (document as IDocument).filename !== (document as IDocument).path && (
                                <>
                                  { foldersPath((document as IDocument).path.replace((document as IDocument).filename, ''), true) }
                                </>
                              )}
                              <span>
                                { documentPath(document) }
                              </span>
                            </>
                          )}
                        </>
                      )}
                      { !subfolderUri && searchWord &&
                        <>
                          <Link to={currentDocumentsRootUri} className="font-semibold text-base cursor-pointer hover:text-coreOrange-500 pl-6 pt-3 pr-1">
                            { currentDocumentsRootName }
                          </Link>
                          <span className="font-normal text-base pt-3">
                            - Search Results
                          </span>
                        </>
                      }
                      { !subfolderUri && !documentId.length && !searchWord && (
                        <span className="font-semibold pt-3 pl-6 text-base">
                          { renderCurrentPage() }
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              { !documentId.length && currentSection === 'DocumentsAndFolders' && (
                <div className="flex items-center gap-5 w-1/2">
                
                  <SearchInput
                    onChange={updateInputValue} 
                    onKeyDown={handleKeyDown}
                    siteId={currentSiteId}
                    formkiqVersion={props.formkiqVersion}
                    documentsRootUri={currentDocumentsRootUri}
                    brand={props.brand}
                    useAdvancedSearch={props.useAdvancedSearch}
                    value={inputValue}
                    allTags={props.allTags}
                  />
                </div>
              )}
            </div>
            <div className="w-1/4 flex justify-end mr-16">
              { props.useNotifications && (
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
                    className="w-8 h-8 rounded-full aspect-square bg-gray-400 text-white font-bold focus:ring-2 focus:ring-coreOrange-500 transition"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={ToggleAccountSettings}
                  >
                    <ParseEmailInitials />
                  </button>
                  {showAccountDropdown &&
                    <ul
                      className="dropdown-menu min-w-max absolute bg-white right-0 text-base z-50 float-right list-none text-left rounded-lg border mt-2.5"
                    >
                      <li className="hidden">
                        <Link to="/account/settings"
                          className="dropdown-item text-sm py-2 px-5 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 transition"
                          >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link onClick={signOut} to="/sign-out"
                          className="dropdown-item text-sm py-2 px-5 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 transition"
                          >
                          Sign out
                        </Link>
                      </li>
                    </ul>
                  }
                </div>
              </div>
              <button className="lg:hidden">
                <div className="w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div className={ (props.isSidebarExpanded ? 'left-64' : 'left-16') + ' flex fixed top-43px left-64 right-0 z-20 h-4 items-center justify-between'}>
            <div className="w-full mt-2 mx-6 border-b"></div>
          </div>
        </div>
      </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer;
  const { isSidebarExpanded, brand, formkiqVersion, useNotifications, useAdvancedSearch } = state.configReducer
  const { allTags } = state.dataCacheReducer
  return { user, isSidebarExpanded, brand, formkiqVersion, useNotifications, useAdvancedSearch, allTags }
};

export default connect(mapStateToProps)(Navbar as any);