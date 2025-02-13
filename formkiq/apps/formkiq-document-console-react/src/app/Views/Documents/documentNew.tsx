import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../Components/Icons/icons';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';

export function DocumentNew() {
  const { extension } = useParams();
  const { user } = useAuthenticatedState();
  const navigate = useNavigate();
  const search = useLocation().search;
  const path = new URLSearchParams(search).get('path') || '';

  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
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
        pathname: `${siteRedirectUrl}`,
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
          pathname: `${recheckSiteInfo.siteRedirectUrl}`,
        },
        {
          replace: true,
        }
      );
    }
    setCurrentSiteId(recheckSiteInfo.siteId);
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
    setCurrentDocumentsRootName(recheckSiteInfo.siteDocumentsRootName);
  }, [pathname]);

  const [ooConfig, setOOConfig]: [any | null, any] = useState(null);
  return (
    <>
      <Helmet>
        <title>New Document</title>
      </Helmet>
      {document && (
        <div className="flex flex-col lg:flex-row">
          <div className="-mt-3 h-92/100h flex-1 bg-white inline-block">
            <Spinner />
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentNew;
