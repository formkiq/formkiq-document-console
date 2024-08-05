import {useCallback, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import {AuthState} from '../../Store/reducers/auth';
import {useAppDispatch} from '../../Store/store';
import {
  AttributesDataState,
  fetchAttributesData,
  setAllAttributesData,
  setAllTagsData
} from "../../Store/reducers/attributesData";
import AttributesList from "./AttributesList";
import {getAllAttributes, setAllAttributes, setAllTags} from "../../helpers/tools/useCacheStorage";
import {DocumentsService} from "../../helpers/services/documentsService";
import {ConfigState} from "../../Store/reducers/config";

export function Attributes() {
  const dispatch = useAppDispatch();
  const {user} = useSelector(AuthState);

  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {siteId, siteDocumentsRootUri} = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const navigate = useNavigate();
  const {formkiqVersion} = useSelector(ConfigState);
  const {allAttributes} = useSelector(AttributesDataState);

  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [isAttributesInUse, setIsAttributesInUse] = useState<Record<string, boolean>>({});

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
  }, [pathname]);

  const handleScroll = (e: any) => {
    const element = e.target;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      // Handle scroll to bottom
    }
  };

  const getAttributes = async () => {
    const allAttributesCache = await getAllAttributes();
    if (allAttributesCache) {
      const dateDiff =
        new Date().getTime() -
        new Date(allAttributesCache.attributesLastRefreshed).getTime();
      const isCachedDataValid =
        dateDiff / 1000 < 30 &&
        allAttributesCache.attributesSiteId === currentSiteId;
      if (isCachedDataValid) {
        // use data from cache and update state
        dispatch(setAllAttributesData(allAttributesCache));
      } else {
        // load the data and save it in cache and in state
        dispatch(fetchAttributesData({siteId: currentSiteId, limit: 100}));
      }
    }
  }
  useEffect(() => {
    getAttributes();
  }, []);

  useEffect(() => {
    dispatch(fetchAttributesData({siteId: currentSiteId, limit: 100}));
    setIsAttributesInUse({});
  }, [currentSiteId]);

  const onAttributeInView = (attributeKey: string) => {
    // Use a function to get the current state
    setIsAttributesInUse((currentState) => {
      if (currentState[attributeKey] !== undefined) return currentState;  // No change

      DocumentsService.getDocumentsInFolder(
        "",
        currentSiteId,
        null,
        null,
        null,
        1,
        [],
        attributeKey
      ).then((response: any) => {
        if (response.status === 200) {
          const isInUse = response.documents.length > 0;
          setIsAttributesInUse((prevState) => ({...prevState, [attributeKey]: isInUse}));
        }
      });
      return currentState;  // No immediate change
    });
  };


  return (
    <>
      <Helmet>
        <title>Attributes</title>
      </Helmet>

      <div
        className="flex"
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="grow flex flex-col justify-stretch">
          <div className="relative overflow-hidden h-full">
            <AttributesList
              attributes={allAttributes}
              siteId={currentSiteId}
              onDelete={(attributeKey: string) => {
              }}
              onAttributeInView={onAttributeInView}
              isAttributesInUse={isAttributesInUse}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Attributes;
