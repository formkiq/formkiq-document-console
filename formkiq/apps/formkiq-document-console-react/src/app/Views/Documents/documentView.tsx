import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../Components/Icons/icons';
import { User } from '../../Store/reducers/auth';
import { setCurrentDocumentPath } from '../../Store/reducers/data';
import { RootState, useAppDispatch } from '../../Store/store';
import {
  InlineViewableContentTypes,
  OnlyOfficeContentTypes,
} from '../../helpers/constants/contentTypes';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { IDocument } from '../../helpers/types/document';

export function DocumentView(props: { user: User; formkiqVersion: any }) {
  const { id } = useParams();
  const versionKey = new URLSearchParams(useLocation().search).get(
    'versionKey'
  );
  const { user } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites } =
    getUserSites(user);
  const pathname = useLocation().pathname;
  const {
    siteId,
    siteRedirectUrl,
    siteDocumentsRootUri,
    siteDocumentsRootName,
    isSiteReadOnly,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasSharedFolders,
    sharedFolderSites
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
          dispatch(setCurrentDocumentPath(response.path));
          if (
            props.formkiqVersion.modules.indexOf('onlyoffice') > -1 &&
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
          } else {
            const url =
              currentDocumentsRootUri +
              '/folders/' +
              (response as IDocument).path.substring(
                0,
                (response as IDocument).path.lastIndexOf('/')
              ) +
              '#id=' +
              id;
            navigate(url);
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
      hasSharedFolders,
      sharedFolderSites
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
  const DocumentViewer = () => {
    //return (<></>)
    //return <DocViewer prefetchMethod="GET"  documents={documents} />
    return (
      <div className="w-full h-full">
        {document &&
          InlineViewableContentTypes.indexOf(
            (document as IDocument).contentType
          ) > -1 && (
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
            {documentContent || ooConfig ? (
              <>
                {documentContent && (
                  <div className="w-full h-full">
                    <DocumentViewer />
                  </div>
                )}
                {ooConfig && (
                  <div className="w-full h-full" id="onlyofficeContainer"></div>
                )}
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer;
  const { formkiqVersion } = state.configReducer;
  return { user, formkiqVersion };
};

export default connect(mapStateToProps)(DocumentView as any);
