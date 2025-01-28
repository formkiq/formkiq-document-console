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
import { deleteMapping, updateMapping } from '../../Store/reducers/mappings';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  Mapping as MappingType,
  MappingAttribute,
} from '../../helpers/types/mappings';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import MappingAttributesTable from '../../Components/Mappings/MappingAttributesTable';
import EditMappingAttributeDialog from '../../Components/Mappings/Dialogs/MappingAttributeDialog/EditMappingAttributeDialog';
import CreateMappingAttributeDialog from '../../Components/Mappings/Dialogs/MappingAttributeDialog/CreateMappingAttributeDialog';
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";

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
  const [editingAttribute, setEditingAttribute] =
    useState<MappingAttribute | null>(null);
  const [isEditAttributeDialogOpen, setIsEditAttributeDialogOpen] =
    useState(false);
  const [isCreateAttributeDialogOpen, setIsCreateAttributeDialogOpen] =
    useState(false);

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
      getMapping();
    } catch (error: any) {
      dispatch(openNotificationDialog({ dialogTitle: error.message }));
    }
  }

  function onDeleteAttribute(key: string) {
    function deleteAttribute(key: string) {
      if (!mapping) return;
      const filteredAttributes = mapping.attributes.filter(
        (attr) => attr.attributeKey !== key
      );
      const newMapping: MappingType = {
        ...mapping,
        attributes: filteredAttributes,
      };
      saveChanges(newMapping);
    }

    dispatch(
      openConfirmationDialog({
        dialogTitle:
          'Are you sure you want to delete ' +
          key +
          ' attribute from the mapping?',
        callback: () => {
          deleteAttribute(key);
        },
      })
    );
  }

  function onEditAttribute(attribute: MappingAttribute) {
    setEditingAttribute(attribute);
    setIsEditAttributeDialogOpen(true);
  }

  function saveUpdatedAttribute(attribute: MappingAttribute) {
    if (!mapping||!editingAttribute) return;
    const editedAttributeIndex = mapping.attributes.findIndex(
        (attr) => attr.attributeKey === editingAttribute.attributeKey
    );
    const newAttributes = [...mapping.attributes];
    newAttributes[editedAttributeIndex] = attribute;
    const newMapping = { ...mapping, attributes: newAttributes };
    saveChanges(newMapping);
    setIsEditAttributeDialogOpen(false);
  }

  function saveNewAttribute(attribute: MappingAttribute) {
    if (!mapping) return;
    const newAttributes = mapping.attributes.concat(attribute);
    const newMapping = { ...mapping, attributes: newAttributes };
    saveChanges(newMapping);
    setIsCreateAttributeDialogOpen(false);
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
          <div className="px-6 flex h-9 mb-2 items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">
               Mapping Attributes
            </h1>
            <ButtonPrimaryGradient
              onClick={() => setIsCreateAttributeDialogOpen(true)}>
                + Add Attribute
            </ButtonPrimaryGradient>
          </div>
          <MappingAttributesTable
            attributes={mapping.attributes}
            onDelete={onDeleteAttribute}
            onEdit={(attribute) => {
              onEditAttribute(attribute);
            }}
          />
        </>
      )}
      {editingAttribute && (
        <EditMappingAttributeDialog
          isOpen={isEditAttributeDialogOpen}
          setIsOpen={setIsEditAttributeDialogOpen}
          siteId={currentSiteId}
          attribute={editingAttribute}
          onSave={saveUpdatedAttribute}
        />
      )}

      <CreateMappingAttributeDialog
        isOpen={isCreateAttributeDialogOpen}
        setIsOpen={setIsCreateAttributeDialogOpen}
        siteId={currentSiteId}
        onSave={saveNewAttribute}
      />
    </>
  );
}

export default Mapping;
