import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Spinner} from '../../Components/Icons/icons';
import {useAuthenticatedState} from '../../Store/reducers/auth';
import {ConfigState} from '../../Store/reducers/config';
import {setCurrentDocumentPath} from '../../Store/reducers/data';
import {useAppDispatch} from '../../Store/store';
import {
  InlineViewableContentExtensions,
  InlineViewableContentTypes,
  OnlyOfficeContentTypes,
} from '../../helpers/constants/contentTypes';
import {DocumentsService} from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import {IDocument} from '../../helpers/types/document';
import TextFileEditor from '../../Components/DocumentsAndFolders/TextFileEditor/textFileEditor';

export function DocumentView() {
  const {id} = useParams();
  const versionKey = new URLSearchParams(useLocation().search).get(
    'versionKey'
  );
  const {user} = useAuthenticatedState();

  const {formkiqVersion} = useSelector(ConfigState);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {
    siteId,
    siteRedirectUrl,
    siteDocumentsRootUri,
    siteDocumentsRootName,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  if (siteRedirectUrl.length) {
    navigate(
      {
        pathname: `${siteRedirectUrl}/${id}/view`,
      },
      {
        replace: true,
      }
    );
  }
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [currentDocumentsRootName, setCurrentDocumentsRootName] = useState(
    siteDocumentsRootName
  );

  useEffect(() => {
    if (id) {
      let ooConfig: any;
      const handleScript = (e: any) => {
        if (e.type === 'load') {
          const script = window.document.querySelector(`script[id="ooScript"]`);
          (window as any).DocsAPI.DocEditor('onlyofficeContainer', ooConfig);
        }
      };
      DocumentsService.getDocumentById(id, currentSiteId).then(
        (response: IDocument) => {
          setDocument(response);
          setDocumentExtension(response.path.substring(response.path.lastIndexOf('.') + 1).toLowerCase());
          dispatch(setCurrentDocumentPath(response.path));
          if (
            formkiqVersion.modules?.indexOf('onlyoffice') > -1 &&
            OnlyOfficeContentTypes.indexOf(
              (response as IDocument).contentType
            ) > -1
          ) {
            DocumentsService.editDocumentWithOnlyoffice(id, currentSiteId).then(
              (onlyofficeResponse: any) => {
                setOOConfig(onlyofficeResponse.config);
                // console.log(onlyofficeResponse.config);
                ooConfig = onlyofficeResponse.config;
                // setOOConfig(onlyofficeResponse.config)
                const script = window.document.createElement('script');
                (script as HTMLScriptElement).type = 'application/javascript';
                (script as HTMLScriptElement).id = 'ooScript';
                (script as HTMLScriptElement).src =
                  onlyofficeResponse.onlyOfficeUrl +
                  '/web-apps/apps/api/documents/api.js';
                (script as HTMLScriptElement).async = false;
                window.document.body.appendChild(script);
                script.addEventListener('load', handleScript);
              }
            );
          } else if (
            InlineViewableContentTypes.indexOf(
              (response as IDocument).contentType
            ) > -1
          ) {
            let viewVersionKey = '';
            if (versionKey && versionKey.length) {
              viewVersionKey = versionKey;
            }
            DocumentsService.getDocumentUrl(
              id,
              currentSiteId,
              viewVersionKey
            ).then((urlResponse: any) => {
              setDocumentContent(urlResponse.url);
            });
          } else if ((response as IDocument).deepLinkPath.length) {
            setDocumentContent((response as IDocument).deepLinkPath);
          } else if (InlineViewableContentExtensions.indexOf(response.path.substring(response.path.lastIndexOf('.') + 1).toLowerCase()) > -1) {
            let viewVersionKey = '';
            if (versionKey && versionKey.length) {
              viewVersionKey = versionKey;
            }
            DocumentsService.getDocumentContent(
              currentSiteId,
              id,
              viewVersionKey,
              true
            ).then((res: any) => {
              fetch(res.contentUrl).then((response) => response.body)
                .then((body: any) => {
                  const reader = body.getReader();
                  reader.read().then(({value}: any) => {
                    if (value) {
                      setDocumentContent(new TextDecoder().decode(value))
                    } else {
                      setDocumentContent("")
                    }
                  })
                })
            });
          } else {
            let viewVersionKey = '';
            if (versionKey && versionKey.length) {
              viewVersionKey = versionKey;
            }
            DocumentsService.getDocumentUrl(
              id,
              currentSiteId,
              viewVersionKey,
              false
            ).then((urlResponse: any) => {
              const a = window.document.createElement('a');
              a.style.display = 'none';
              a.href = urlResponse.url;
              a.download = response.path.substring(
                response.path.lastIndexOf('/') + 1
              );
              window.document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(urlResponse.url);
              const url =
                currentDocumentsRootUri +
                '/folders/' +
                (response as IDocument).path.substring(
                  0,
                  (response as IDocument).path.lastIndexOf('/')
                ) +
                '#id=' +
                id;
              setTimeout(() => {
                navigate(url);
              }, 200);
            });
          }
        }
      );
    }
  }, [id, versionKey]);

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
          pathname: `${siteRedirectUrl}/${id}/view`,
        },
        {
          replace: true,
        }
      );
    }
    setCurrentSiteId(recheckSiteInfo.siteId);
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
    setCurrentDocumentsRootName(recheckSiteInfo.siteDocumentsRootName);
    // TODO: determine if readonly check required here
    //setIsCurrentSiteReadonly(recheckSiteInfo.isSiteReadOnly)
  }, [pathname]);

  const [document, setDocument]: [IDocument | null, any] = useState(null);
  const [ooConfig, setOOConfig]: [any | null, any] = useState(null);
  const [documentContent, setDocumentContent]: [string | null, any] =
    useState('');
  const [documentExtension, setDocumentExtension] = useState<string>('')

  const DocumentViewer = () => {
    //return (<></>)
    //return <DocViewer prefetchMethod="GET"  documents={documents} />
    return (
      <div className="w-full h-full">
        {document &&
          (InlineViewableContentTypes.indexOf(
              (document as IDocument).contentType
            ) > -1 ||
            (document as IDocument).deepLinkPath.length>0) && (
            <>
              {documentContent && (
                <iframe
                  title="Document Viewer"
                  className="mt-4 w-full h-full"
                  src={documentContent}
                />
              )}
            </>
          )}

        {/*Text File Editor (currently only for .md files) */}
        {document &&
          InlineViewableContentExtensions.indexOf(documentExtension) > -1 &&
          documentContent!==undefined && (
           <TextFileEditor
             currentDocument={ document}
             documentContent={documentContent}
             extension={documentExtension}
             siteId={currentSiteId}/>
          )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Document</title>
      </Helmet>
      {document && (
        <div className="flex flex-col lg:flex-row">
          <div className="-mt-3 h-92/100h flex-1 bg-white inline-block">
            {documentContent!==undefined || ooConfig ? (
              <>
                {documentContent!==undefined && (
                  <div className="w-full h-full">
                    <DocumentViewer/>
                  </div>
                )}
                {ooConfig && (
                  <div className="relative w-full h-full mt-3">
                    <div
                      className="w-full h-full"
                      id="onlyofficeContainer"
                    ></div>
                  </div>
                )}
              </>
            ) : (
              <Spinner/>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentView;
