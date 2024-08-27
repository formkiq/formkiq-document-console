import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import {
  MappingsState,
  deleteMapping,
  fetchMappings,
  setMappingsLoadingStatusPending,
} from '../../Store/reducers/mappings';
import { useAppDispatch } from '../../Store/store';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import { Mapping } from '../../helpers/types/mappings';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';

import CreateMappingDialog from '../../Components/Mappings/Dialogs/CreateMappingDialog';
import MappingsTable from './mappingsTable';
import EditMappingDialog from '../../Components/Mappings/Dialogs/EditMappingDialog';

function Mappings() {
  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const {
    mappings,
    nextMappingsToken,
    mappingsLoadingStatus,
    isLastMappingsSearchPageLoaded,
    currentMappingsSearchPage,
  } = useSelector(MappingsState);

  const dispatch = useAppDispatch();
  const [isMappingEditTabVisible, setIsMappingEditTabVisible] = useState(false);
  const [editingMapping, setEditingMapping] = useState<Mapping|null>(null);
  const [isMappingAddTabVisible, setIsMappingAddTabVisible] = useState(false);

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
  }, [pathname]);

  // update mappings when different siteId selected
  useEffect(() => {
    dispatch(fetchMappings({ siteId: currentSiteId }));
  }, [currentSiteId]);

  // load more mappings when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('mappingsScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextMappingsToken &&
      mappingsLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setMappingsLoadingStatusPending());
      if (nextMappingsToken) {
        await dispatch(
          fetchMappings({
            siteId: currentSiteId,
            nextToken: nextMappingsToken,
            page: currentMappingsSearchPage + 1,
          })
        );
      }
    }
  }, [
    nextMappingsToken,
    mappingsLoadingStatus,
    isLastMappingsSearchPageLoaded,
  ]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // Delete mapping
  const onMappingDelete = (mappingId: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this mapping?',
        callback: () => {
          dispatch(
            deleteMapping({ mappingId, siteId: currentSiteId, mappings })
          );
        },
      })
    );
  };

  // Open tab to create/edit mapping
  const showMappingEditTab = (mapping: Mapping) => {
    setEditingMapping(mapping);
    setTimeout(() => setIsMappingEditTabVisible(true),10);
  };

  return (
    <>
      <Helmet>
        <title>Mappings</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="w-full p-2 flex">
          <ButtonPrimaryGradient
            onClick={() => setIsMappingAddTabVisible(true)}
            style={{ height: '36px' }}
          >
            + Create New Mapping
          </ButtonPrimaryGradient>
        </div>
        <div
          className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full"
          id="mappingsScrollPane"
          onScroll={handleScroll}
        >
          <MappingsTable
            mappings={mappings}
            onMappingDelete={onMappingDelete}
            showMappingEditTab={showMappingEditTab}
          />
        </div>
      </div>
      <CreateMappingDialog
        isOpen={isMappingAddTabVisible}
        setIsOpen={setIsMappingAddTabVisible}
        siteId={siteId}
      />
      <EditMappingDialog
        isOpen={isMappingEditTabVisible}
        setIsOpen={setIsMappingEditTabVisible}
        mapping={editingMapping as Mapping}
        siteId={siteId}
      />
    </>
  );
}

export default Mappings;
