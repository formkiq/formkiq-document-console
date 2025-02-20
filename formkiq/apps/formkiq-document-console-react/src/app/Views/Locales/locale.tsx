import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import ButtonGhost from '../../Components/Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Components/Generic/Buttons/ButtonPrimary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  deleteLocaleResourceItem,
  fetchLocaleResourceItems,
  LocalesState,
} from '../../Store/reducers/locales';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { LocaleResourceItem } from '../../helpers/types/locales';
import { useIsReadOnlyUser } from '../../hooks/is-read-only-user.hook';
import ResourceItemsTable from './resourceItemsTable';

interface LocaleResourceItemState {
  resourceItem: LocaleResourceItem;
}

function Locale() {
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
  const [currentSiteId] = useState(siteId);
  const { locale: localeValueParam } = useParams();
  const [localeValue, setLocaleValue] = useState(localeValueParam || '');

  const {
    resourceItems,
    nextLocalesToken,
    localesLoadingStatus,
    currentLocalesSearchPage,
  } = useSelector(LocalesState);
  const dispatch = useAppDispatch();
  const isReadOnlyUser = useIsReadOnlyUser({ user, siteId });

  useEffect(() => {
    dispatch(
      fetchLocaleResourceItems({ locale: localeValue, siteId: currentSiteId })
    );
  }, []);

  useEffect(() => {
    if (localeValueParam) {
      setLocaleValue(localeValueParam);
    }
  }, [localeValueParam]);

  // Use "resourceItem" as the property name.
  const initialLocaleResourceItemValue: LocaleResourceItemState = {
    resourceItem: {
      itemKey: '',
      itemType: 'INTERFACE',
      localizedValue: '',
      interfaceKey: undefined,
      classificationId: undefined,
      attributeKey: undefined,
      allowedValue: undefined,
    },
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newLocaleResourceItemValue, setNewLocaleResourceItemValue] =
    useState<LocaleResourceItemState>(initialLocaleResourceItemValue);

  const onLocaleResourceItemDelete = (itemKey: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this resource item?',
        callback: () => {
          dispatch(
            deleteLocaleResourceItem({
              locale: localeValue,
              itemKey,
              siteId: currentSiteId,
              resourceItems,
            })
          );
        },
      })
    );
  };

  // Save handler: if editing, update; otherwise, add.
  const saveLocaleResourceItem = () => {
    const resourceItem = newLocaleResourceItemValue.resourceItem;
    if (isEditing) {
      DocumentsService.updateLocaleResourceItem(
        localeValue,
        resourceItem.itemKey,
        newLocaleResourceItemValue, // JSON body
        currentSiteId
      ).then((res) => {
        if (res.status === 200) {
          dispatch(
            fetchLocaleResourceItems({
              siteId: currentSiteId,
              locale: localeValue,
            })
          );
          setIsEditing(false);
          setNewLocaleResourceItemValue(initialLocaleResourceItemValue);
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error saving resource item. Please try again later',
            })
          );
        }
      });
    } else {
      DocumentsService.addLocaleResourceItem(
        localeValue,
        newLocaleResourceItemValue, // JSON body
        currentSiteId
      ).then((res) => {
        if (res.status === 201) {
          dispatch(
            fetchLocaleResourceItems({
              siteId: currentSiteId,
              locale: localeValue,
            })
          );
          setNewLocaleResourceItemValue(initialLocaleResourceItemValue);
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error adding resource item. Please try again later',
            })
          );
        }
      });
    }
    setIsLocaleResourceItemEditTabVisible(false);
  };

  const [
    isLocaleResourceItemEditTabVisible,
    setIsLocaleResourceItemEditTabVisible,
  ] = useState(false);

  const showLocaleResourceItemEditTab = (itemKey: string) => {
    const existingItem = resourceItems.find((item) => item.itemKey === itemKey);
    if (!existingItem) return;
    setNewLocaleResourceItemValue({ resourceItem: existingItem });
    setIsEditing(true);
    setIsLocaleResourceItemEditTabVisible(true);
  };

  const openNewResourceItemForm = () => {
    setNewLocaleResourceItemValue(initialLocaleResourceItemValue);
    setIsEditing(false);
    setIsLocaleResourceItemEditTabVisible(true);
  };

  function onCancelEdit() {
    setIsLocaleResourceItemEditTabVisible(false);
    setNewLocaleResourceItemValue(initialLocaleResourceItemValue);
    setIsEditing(false);
  }

  const computeItemKey = (item: any) => {
    const {
      itemType,
      interfaceKey,
      classificationId,
      attributeKey,
      allowedValue,
    } = item;
    if (itemType === 'INTERFACE') {
      return `INTERFACE#${interfaceKey || ''}`;
    } else if (itemType === 'SCHEMA') {
      return `SCHEMA#${attributeKey || ''}#${allowedValue || ''}`;
    } else if (itemType === 'CLASSIFICATION') {
      return `CLASSIFICATION#${classificationId || ''}#${attributeKey || ''}#${
        allowedValue || ''
      }`;
    }
    return '';
  };

  return (
    <>
      <Helmet>
        <title>Locale</title>
      </Helmet>
      <div
        className="flex flex-col"
        style={{ height: `calc(100vh - 3.68rem)` }}
      >
        <div className="w-full p-2 flex items-center">
          <h3 className="text-lg font-bold mr-2">{localeValue}</h3>
          <a
            href="/locales"
            className="text-sm text-primary-500 hover:text-primary-600"
          >
            back to locales
          </a>
        </div>
        <div className="w-full p-2 flex">
          {!isReadOnlyUser && (
            <ButtonPrimaryGradient
              onClick={openNewResourceItemForm}
              style={{ height: '36px' }}
            >
              + Create New Resource Item
            </ButtonPrimaryGradient>
          )}
        </div>
        {isLocaleResourceItemEditTabVisible && (
          <LocaleResourceItemEditingTab
            onCancelEdit={onCancelEdit}
            localeResourceItemValue={newLocaleResourceItemValue}
            setLocaleResourceItemValue={setNewLocaleResourceItemValue}
            createNewLocaleResourceItem={saveLocaleResourceItem}
            computeItemKey={computeItemKey}
          />
        )}
        <div
          className="flex-1 overflow-y-scroll overflow-x-auto h-full"
          id="localeResourceItemsScrollPane"
        >
          <ResourceItemsTable
            resourceItems={resourceItems}
            user={user}
            siteId={siteId}
            onLocaleResourceItemDelete={onLocaleResourceItemDelete}
            showLocaleResourceItemEditTab={showLocaleResourceItemEditTab}
            setNewLocaleResourceItemValue={setNewLocaleResourceItemValue}
          />
        </div>
      </div>
    </>
  );
}

export default Locale;

interface LocaleResourceItemEditingTabProps {
  onCancelEdit: () => void;
  localeResourceItemValue: LocaleResourceItemState;
  setLocaleResourceItemValue: (val: LocaleResourceItemState) => void;
  createNewLocaleResourceItem: () => void;
  computeItemKey: (item: any) => string;
}

const LocaleResourceItemEditingTab = ({
  onCancelEdit,
  localeResourceItemValue,
  setLocaleResourceItemValue,
  createNewLocaleResourceItem,
  computeItemKey,
}: LocaleResourceItemEditingTabProps) => {
  const { resourceItem } = localeResourceItemValue;
  const onSubmit = (e: any) => {
    e.preventDefault();
    createNewLocaleResourceItem();
  };

  // Update a field and recalc itemKey.
  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...resourceItem, [field]: value };
    updated.itemKey = computeItemKey(updated);
    setLocaleResourceItemValue({ resourceItem: updated });
  };

  return (
    <form onSubmit={onSubmit} className="max-h-120 overflow-y-auto p-2">
      <div className="flex flex-col gap-4">
        {/* Computed Item Key Row (read-only) */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-bold text-neutral-900">
            Computed Item Key
          </label>
          <input
            type="text"
            value={resourceItem.itemKey}
            disabled
            className="w-64 p-2 border border-neutral-300 rounded bg-gray-100"
          />
        </div>
        {/* Item Type Selector Row */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="itemType"
            className="block text-sm font-bold text-neutral-900"
          >
            Item Type
          </label>
          <select
            name="itemType"
            id="itemType"
            className="w-48 p-2 border border-neutral-300 rounded"
            value={resourceItem.itemType}
            onChange={(e) => handleFieldChange('itemType', e.target.value)}
          >
            <option value="INTERFACE">INTERFACE</option>
            <option value="SCHEMA">SCHEMA</option>
            <option value="CLASSIFICATION">CLASSIFICATION</option>
          </select>
        </div>
        {resourceItem.itemType === 'INTERFACE' && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-neutral-900">
              Interface Key
            </label>
            <input
              type="text"
              value={resourceItem.interfaceKey || ''}
              onChange={(e) =>
                handleFieldChange('interfaceKey', e.target.value)
              }
              placeholder="Interface Key"
              className="w-64 p-2 border border-neutral-300 rounded"
            />
          </div>
        )}
        {resourceItem.itemType === 'SCHEMA' && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-neutral-900">
              Attribute Key
            </label>
            <input
              type="text"
              value={resourceItem.attributeKey || ''}
              onChange={(e) =>
                handleFieldChange('attributeKey', e.target.value)
              }
              placeholder="Attribute Key"
              className="w-64 p-2 border border-neutral-300 rounded"
            />
            <label className="block text-sm font-bold text-neutral-900">
              Allowed Value
            </label>
            <input
              type="text"
              value={resourceItem.allowedValue || ''}
              onChange={(e) =>
                handleFieldChange('allowedValue', e.target.value)
              }
              placeholder="Allowed Value"
              className="w-64 p-2 border border-neutral-300 rounded"
            />
          </div>
        )}
        {resourceItem.itemType === 'CLASSIFICATION' && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-neutral-900">
              Classification ID
            </label>
            <input
              type="text"
              value={resourceItem.classificationId || ''}
              onChange={(e) =>
                handleFieldChange('classificationId', e.target.value)
              }
              placeholder="Classification ID"
              className="w-64 p-2 border border-neutral-300 rounded"
            />
            <label className="block text-sm font-bold text-neutral-900">
              Attribute Key
            </label>
            <input
              type="text"
              value={resourceItem.attributeKey || ''}
              onChange={(e) =>
                handleFieldChange('attributeKey', e.target.value)
              }
              placeholder="Attribute Key"
              className="w-64 p-2 border border-neutral-300 rounded"
            />
            <label className="block text-sm font-bold text-neutral-900">
              Allowed Value
            </label>
            <input
              type="text"
              value={resourceItem.allowedValue || ''}
              onChange={(e) =>
                handleFieldChange('allowedValue', e.target.value)
              }
              placeholder="Allowed Value"
              className="w-64 p-2 border border-neutral-300 rounded"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-bold text-neutral-900">
            Localized Value
          </label>
          <input
            type="text"
            value={resourceItem.localizedValue}
            onChange={(e) =>
              handleFieldChange('localizedValue', e.target.value)
            }
            placeholder="Localized Value"
            className="w-64 p-2 border border-neutral-300 rounded"
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 h-[42px] ml-2 mb-2">
        <ButtonPrimary type="submit">Save</ButtonPrimary>
        <ButtonGhost type="button" onClick={onCancelEdit}>
          Cancel
        </ButtonGhost>
      </div>
    </form>
  );
};

export { Locale };
