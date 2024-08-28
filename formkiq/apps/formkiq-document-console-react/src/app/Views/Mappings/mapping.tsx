import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { useAppDispatch } from '../../Store/store';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import MappingMenu from '../../Components/Mappings/MappingMenu';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import {
  addMapping,
  deleteMapping,
  updateMapping,
} from '../../Store/reducers/mappings';
import { DocumentsService } from '../../helpers/services/documentsService';
import { Mapping as MappingType } from '../../helpers/types/mappings';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';

function Mapping() {
  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { mappingId } = useParams();
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [mapping, setMapping] = useState<MappingType | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  function getMapping() {
    if (!mappingId) return;
    DocumentsService.getMapping(currentSiteId, mappingId).then((res) => {
      if (res.mapping) {
        setMapping(res.mapping);
      }
    });
  }

  useEffect(() => {
    getMapping();
  }, [mappingId]);

  // Delete mapping
  const onMappingDelete = () => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this mapping?',
        callback: async () => {
          try {
            await dispatch(deleteMapping({ mappingId, siteId: currentSiteId }));
            navigate(pathname.substring(0, pathname.lastIndexOf('/')));
          } catch (err) {
            console.log(err);
          }
        },
      })
    );
  };

  async function saveChanges(mapping: MappingType) {
    if (!mappingId) return;
    if (mapping.name.length === 0) {
      dispatch(
        openNotificationDialog({ dialogTitle: 'Please enter the name.' })
      );
      return;
    }
    try {
      await dispatch(
        updateMapping({
          mapping: { mapping },
          siteId,
          mappingId: mapping.mappingId,
        })
      ).unwrap();
      getMapping()
    } catch (error: any) {
      dispatch(openNotificationDialog({ dialogTitle: error.message }));
    }
  }

  return (
    <>
      <Helmet>
        <title>Mappings</title>
      </Helmet>
      {mapping && (
        <>
          <MappingMenu
            mapping={mapping}
            onMappingDelete={onMappingDelete}
            saveChanges={saveChanges}
          />
        </>
      )}
    </>
  );
}

export default Mapping;
