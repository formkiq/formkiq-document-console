import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateNewAttributeModal from '../../Components/Attributes/CreateNewAttributeModal';
import EditAttributeModal from '../../Components/Attributes/EditAttributeModal';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { getAllAttributes } from '../../helpers/tools/useCacheStorage';
import {
  AttributesDataState,
  fetchAttributesData,
  setAllAttributesData,
} from '../../Store/reducers/attributesData';
import { AuthState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import AttributesList from './AttributesList';

export function Attributes() {
  const dispatch = useAppDispatch();
  const { user } = useSelector(AuthState);

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
  const navigate = useNavigate();
  const { allAttributes } = useSelector(AttributesDataState);

  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [isAttributesInUse, setIsAttributesInUse] = useState<
    Record<string, boolean>
  >({});
  const [isNewAttributeDialogOpen, setIsNewAttributeDialogOpen] =
    useState(false);
  const [isEditAttributeDialogOpen, setIsEditAttributeDialogOpen] =
    useState(false);
  const [attributeToEdit, setAttributeToEdit] = useState<any>(null);

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
  }, [pathname]);

  const updateAttributes = () => {
    dispatch(fetchAttributesData({ siteId: currentSiteId, limit: 100 }));
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
        updateAttributes();
      }
    }
  };
  useEffect(() => {
    getAttributes();
  }, []);

  useEffect(() => {
    updateAttributes();
    setIsAttributesInUse({});
  }, [currentSiteId]);

  const onAttributeInView = (attributeKey: string) => {
    // Use a function to get the current state
    setIsAttributesInUse((currentState) => {
      if (currentState[attributeKey] !== undefined) return currentState; // No change
      DocumentsService.getDocumentsInFolder(
        '',
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
          setIsAttributesInUse((prevState) => ({
            ...prevState,
            [attributeKey]: isInUse,
          }));
        }
      });
      return currentState; // No immediate change
    });
  };

  const onDeleteAttribute = (attributeKey: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this attribute?',
        callback: () => {
          DocumentsService.deleteAttribute(currentSiteId, attributeKey).then(
            (response: any) => {
              if (response.status === 200) {
                updateAttributes();
              } else {
                dispatch(
                  openNotificationDialog({
                    dialogTitle: response.errors
                      ? response.errors[0].error
                      : 'Error deleting attribute.',
                  })
                );
              }
            }
          );
        },
      })
    );
  };

  const onCreateAttribute = () => {
    setIsNewAttributeDialogOpen(true);
  };

  const onCreateAttributeFormClose = () => {
    setIsNewAttributeDialogOpen(false);
  };

  const onEditAttribute = (attributeKey: string) => {
    const attribute = allAttributes.find(
      (attribute) => attribute.key === attributeKey
    );
    if (!attribute) return;
    setAttributeToEdit(attribute);
    setIsEditAttributeDialogOpen(true);
  };
  const onEditAttributeModalClose = () => {
    setIsEditAttributeDialogOpen(false);
    setAttributeToEdit(null);
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
          <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-300">
            <div className="pt-4 max-w-screen-lg font-semibold mb-4">
              <div className="text-xl font-bold mb-4">
                Attributes (site: {siteId})
              </div>
              <p>
                Attributes must be created at the site-level before they are
                available for use by documents
              </p>
            </div>
            <div className="flex gap-2 p-2">
              <ButtonPrimaryGradient
                type="button"
                className="h-9"
                onClick={onCreateAttribute}
              >
                Create Attribute
              </ButtonPrimaryGradient>
            </div>
          </div>
          <div className="relative overflow-hidden h-full">
            <AttributesList
              attributes={allAttributes}
              onDelete={onDeleteAttribute}
              onAttributeInView={onAttributeInView}
              isAttributesInUse={isAttributesInUse}
              onEdit={onEditAttribute}
            />
          </div>
        </div>
      </div>
      <CreateNewAttributeModal
        isOpened={isNewAttributeDialogOpen}
        onClose={onCreateAttributeFormClose}
        siteId={currentSiteId}
        updateAllAttributes={updateAttributes}
      />
      <EditAttributeModal
        attribute={attributeToEdit}
        isOpened={isEditAttributeDialogOpen}
        onClose={onEditAttributeModalClose}
        siteId={currentSiteId}
        updateAllAttributes={updateAttributes}
      />
    </>
  );
}

export default Attributes;
