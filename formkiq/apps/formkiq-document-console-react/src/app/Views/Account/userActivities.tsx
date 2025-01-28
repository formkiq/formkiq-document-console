import {useCallback, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {useAuthenticatedState} from '../../Store/reducers/auth';
import {useAppDispatch} from '../../Store/store';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import {RequestStatus} from '../../helpers/types/document';
import {
  fetchUserActivities,
  setUserActivitiesLoadingStatusPending,
  UserActivitiesState
} from "../../Store/reducers/userActivities";
import UserActivitiesTable from "../../Components/UserActivities/userActivitiesTable";

function UserActivities() {
  const {user} = useAuthenticatedState();
  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {siteId} = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [siteDocumentsRootUri, setSiteDocumentsRootUri] = useState<string>("")
  const {
    userActivities,
    nextUserActivitiesToken,
    isLastUserActivitiesSearchPageLoaded,
    currentUserActivitiesSearchPage,
    userActivitiesLoadingStatus
  } =
    useSelector(UserActivitiesState);

  const dispatch = useAppDispatch();

  // update siteId
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
    setSiteDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
  }, [pathname]);

  // update User Activities when different siteId selected
  useEffect(() => {
    dispatch(fetchUserActivities({siteId: currentSiteId, page: 1, limit: 20}))
  }, [currentSiteId]);

  // load more schemas when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('userActivitiesScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextUserActivitiesToken &&
      userActivitiesLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setUserActivitiesLoadingStatusPending());
      if (nextUserActivitiesToken) {
        await dispatch(
          fetchUserActivities({
            siteId: currentSiteId,
            nextUserActivitiesToken,
            page: currentUserActivitiesSearchPage + 1,
          })
        );
      }
    }
  }, [nextUserActivitiesToken, userActivitiesLoadingStatus, isLastUserActivitiesSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };


  return (
    <>
      <Helmet>
        <title>User Activities</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div
          className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full mt-2"
          id="userActivitiesScrollPane"
          onScroll={handleScroll}
        >
          <UserActivitiesTable
            userActivities={userActivities}
            siteId={currentSiteId}
            documentsRootUri={siteDocumentsRootUri}
          />
        </div>
      </div>
    </>
  );
}

export default UserActivities;
