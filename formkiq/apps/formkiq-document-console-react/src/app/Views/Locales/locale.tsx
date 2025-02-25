import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

// Shared interfaces
export interface AttributeOption {
  attributeKey: string;
  required: boolean;
  allowedValues?: string[];
}

export interface ClassificationSummary {
  classificationId: string;
  name: string;
}

export interface LocaleResourceItemState {
  resourceItem: LocaleResourceItem;
}

// ==============================
// LocaleResourceItemEditingTab Component
// ==============================
interface LocaleResourceItemEditingTabProps {
  onCancelEdit: () => void;
  localeResourceItemValue: LocaleResourceItemState;
  setLocaleResourceItemValue: (val: LocaleResourceItemState) => void;
  createNewLocaleResourceItem: () => void;
  computeItemKey: (item: any) => string;
  attributeOptions: AttributeOption[];
  classificationOptions: ClassificationSummary[];
  selectedClassificationAttributes: AttributeOption[];
}

const LocaleResourceItemEditingTab = ({
  onCancelEdit,
  localeResourceItemValue,
  setLocaleResourceItemValue,
  createNewLocaleResourceItem,
  computeItemKey,
  attributeOptions,
  classificationOptions,
  selectedClassificationAttributes,
}: LocaleResourceItemEditingTabProps) => {
  const { resourceItem } = localeResourceItemValue;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewLocaleResourceItem();
  };

  // Update a field and recalc itemKey.
  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...resourceItem, [field]: value };
    updated.itemKey = computeItemKey(updated);
    setLocaleResourceItemValue({ resourceItem: updated });
  };

  // Helper to render allowed value select or a message if none.
  const renderAllowedValueField = () => {
    let selectedAttr: AttributeOption | undefined;
    if (resourceItem.itemType === 'SCHEMA') {
      selectedAttr = attributeOptions.find(
        (option) => option.attributeKey === resourceItem.attributeKey
      );
    } else if (resourceItem.itemType === 'CLASSIFICATION') {
      selectedAttr = selectedClassificationAttributes.find(
        (option) => option.attributeKey === resourceItem.attributeKey
      );
    }
    if (
      selectedAttr &&
      selectedAttr.allowedValues &&
      selectedAttr.allowedValues.length > 0
    ) {
      return (
        <select
          name="allowedValue"
          id="allowedValue"
          className="w-64 p-2 border border-neutral-300 rounded"
          value={resourceItem.allowedValue || ''}
          onChange={(e) => handleFieldChange('allowedValue', e.target.value)}
        >
          <option value="">Select allowed value</option>
          {selectedAttr.allowedValues.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <p className="text-sm text-gray-500">
          No allowed values for this attribute.
        </p>
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-h-120 overflow-y-auto p-2">
      <div className="flex flex-col gap-4">
        {/* Computed Item Key */}
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
        {/* Item Type */}
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
        {/* INTERFACE */}
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
        {/* SCHEMA */}
        {resourceItem.itemType === 'SCHEMA' && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-neutral-900">
              Attribute Key
            </label>
            <select
              name="attributeKey"
              id="attributeKey"
              className="w-64 p-2 border border-neutral-300 rounded"
              value={resourceItem.attributeKey || ''}
              onChange={(e) =>
                handleFieldChange('attributeKey', e.target.value)
              }
            >
              <option value="">Select attribute key</option>
              {attributeOptions.map((option: AttributeOption) => (
                <option key={option.attributeKey} value={option.attributeKey}>
                  {option.attributeKey}
                  {option.required ? ' (required)' : ''}
                </option>
              ))}
            </select>
            <label className="block text-sm font-bold text-neutral-900">
              Allowed Value
            </label>
            {renderAllowedValueField()}
          </div>
        )}
        {/* CLASSIFICATION */}
        {resourceItem.itemType === 'CLASSIFICATION' && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-neutral-900">
              Classification ID
            </label>
            <select
              name="classificationId"
              id="classificationId"
              className="w-64 p-2 border border-neutral-300 rounded"
              value={resourceItem.classificationId || ''}
              onChange={(e) => {
                const newClassificationId = e.target.value;
                const updated = {
                  ...resourceItem,
                  classificationId: newClassificationId,
                  attributeKey: '', // reset attribute key on classification change
                };
                updated.itemKey = computeItemKey(updated);
                setLocaleResourceItemValue({ resourceItem: updated });
              }}
            >
              <option value="">Select classification</option>
              {classificationOptions.map((cls: ClassificationSummary) => (
                <option key={cls.classificationId} value={cls.classificationId}>
                  {cls.name}
                </option>
              ))}
            </select>
            <label className="block text-sm font-bold text-neutral-900">
              Attribute Key
            </label>
            <select
              name="attributeKey"
              id="classificationAttributeKey"
              className="w-64 p-2 border border-neutral-300 rounded"
              value={resourceItem.attributeKey || ''}
              onChange={(e) =>
                handleFieldChange('attributeKey', e.target.value)
              }
            >
              <option value="">Select attribute key</option>
              {selectedClassificationAttributes.map((attr: AttributeOption) => (
                <option key={attr.attributeKey} value={attr.attributeKey}>
                  {attr.attributeKey}
                  {attr.required ? ' (required)' : ''}
                </option>
              ))}
            </select>
            <label className="block text-sm font-bold text-neutral-900">
              Allowed Value
            </label>
            {renderAllowedValueField()}
          </div>
        )}
        {/* Localized Value */}
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
      <div className="flex pt-2 flex-row gap-2 h-[42px] ml-2 mb-2">
        <ButtonPrimary type="submit">Save</ButtonPrimary>
        <ButtonGhost type="button" onClick={onCancelEdit}>
          Cancel
        </ButtonGhost>
      </div>
    </form>
  );
};

// ==============================
// Helper to Build a Resource Item from URL Params
// ==============================
const buildResourceItemFromParams = (
  params: URLSearchParams
): LocaleResourceItem => {
  const itemKeyParam = params.get('itemKey');
  const explicitItemType = params.get('itemType');
  const explicitInterfaceKey = params.get('interfaceKey');
  const explicitAttributeKey = params.get('attributeKey');
  const explicitClassificationId = params.get('classificationId');
  const explicitAllowedValue = params.get('allowedValue');

  // Determine itemType: explicit value or parsed from itemKey
  const itemType =
    explicitItemType ||
    (itemKeyParam
      ? (itemKeyParam.split('##')[0] as
          | 'INTERFACE'
          | 'SCHEMA'
          | 'CLASSIFICATION')
      : 'INTERFACE');

  // Build resourceItem conditionally.
  if (itemType === 'INTERFACE') {
    const interfaceKeyFromItemKey = itemKeyParam
      ? itemKeyParam.split('##')[1]
      : '';
    return {
      itemKey: itemKeyParam || '',
      itemType: 'INTERFACE',
      localizedValue: '',
      interfaceKey: explicitInterfaceKey || interfaceKeyFromItemKey || '',
    };
  } else if (itemType === 'SCHEMA') {
    const parts = itemKeyParam ? itemKeyParam.split('##') : [];
    return {
      itemKey: itemKeyParam || '',
      itemType: 'SCHEMA',
      localizedValue: '',
      attributeKey: explicitAttributeKey || parts[1] || '',
      allowedValue: explicitAllowedValue || parts[2] || '',
    };
  } else if (itemType === 'CLASSIFICATION') {
    const parts = itemKeyParam ? itemKeyParam.split('##') : [];
    return {
      itemKey: itemKeyParam || '',
      itemType: 'CLASSIFICATION',
      localizedValue: '',
      classificationId: explicitClassificationId || parts[1] || '',
      attributeKey: explicitAttributeKey || parts[2] || '',
      allowedValue: explicitAllowedValue || parts[3] || '',
    };
  }
  // Fallback
  return {
    itemKey: '',
    itemType: 'INTERFACE',
    localizedValue: '',
    interfaceKey: '',
  };
};

// ==============================
// Main Locale Component
// ==============================
function Locale() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const resourceItemFromParams = buildResourceItemFromParams(params);

  // Define the initial resource item value.
  const initialLocaleResourceItemValue: LocaleResourceItemState = {
    resourceItem: resourceItemFromParams,
  };

  const [newLocaleResourceItemValue, setNewLocaleResourceItemValue] =
    useState<LocaleResourceItemState>(initialLocaleResourceItemValue);

  // When URL params change, rebuild the resource item.
  useEffect(() => {
    const updatedResourceItem = buildResourceItemFromParams(
      new URLSearchParams(location.search)
    );
    setNewLocaleResourceItemValue({ resourceItem: updatedResourceItem });
  }, [location.search]);

  useEffect(() => {
    if (params.get('itemKey')) {
      setIsEditing(true);
      setIsLocaleResourceItemEditTabVisible(true);
    }
  }, [params]);

  // --- Other Locale component code ---
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

  const [isEditing, setIsEditing] = useState(false);

  // Dropdown options
  const [attributeOptions, setAttributeOptions] = useState<AttributeOption[]>(
    []
  );
  const [classificationOptions, setClassificationOptions] = useState<
    ClassificationSummary[]
  >([]);
  const [
    selectedClassificationAttributes,
    setSelectedClassificationAttributes,
  ] = useState<AttributeOption[]>([]);

  useEffect(() => {
    DocumentsService.getSiteSchema(currentSiteId)
      .then((response) => {
        if (response && response.attributes) {
          const schemaAttributes = response.attributes;
          const requiredAttrs = schemaAttributes.required || [];
          const optionalAttrs = schemaAttributes.optional || [];
          const options: AttributeOption[] = [
            ...requiredAttrs.map((attr: any) => ({
              attributeKey: attr.attributeKey,
              required: true,
              allowedValues: attr.allowedValues,
            })),
            ...optionalAttrs.map((attr: any) => ({
              attributeKey: attr.attributeKey,
              required: false,
              allowedValues: attr.allowedValues,
            })),
          ];
          setAttributeOptions(options);
        }
      })
      .catch((err) => console.error('Error loading schema', err));
  }, [currentSiteId]);

  useEffect(() => {
    DocumentsService.getSiteClassifications(currentSiteId)
      .then((response) => {
        if (response && response.classifications) {
          setClassificationOptions(response.classifications);
        }
      })
      .catch((err) => console.error('Error loading classifications', err));
  }, [currentSiteId]);

  useEffect(() => {
    if (newLocaleResourceItemValue.resourceItem.classificationId) {
      DocumentsService.getClassification(
        currentSiteId,
        newLocaleResourceItemValue.resourceItem.classificationId
      )
        .then((response) => {
          if (
            response &&
            response.classification &&
            response.classification.attributes
          ) {
            const schemaAttributes = response.classification.attributes;
            const requiredAttrs = schemaAttributes.required || [];
            const optionalAttrs = schemaAttributes.optional || [];
            const options: AttributeOption[] = [
              ...requiredAttrs.map((attr: any) => ({
                attributeKey: attr.attributeKey,
                required: true,
                allowedValues: attr.allowedValues,
              })),
              ...optionalAttrs.map((attr: any) => ({
                attributeKey: attr.attributeKey,
                required: false,
                allowedValues: attr.allowedValues,
              })),
            ];
            setSelectedClassificationAttributes(options);
          }
        })
        .catch((err) =>
          console.error('Error loading classification details', err)
        );
    }
  }, [newLocaleResourceItemValue.resourceItem.classificationId, currentSiteId]);

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

  const computeItemKey = (item: any) => {
    const {
      itemType,
      interfaceKey,
      classificationId,
      attributeKey,
      allowedValue,
    } = item;
    if (itemType === 'INTERFACE') {
      return `INTERFACE##${interfaceKey || ''}`;
    } else if (itemType === 'SCHEMA') {
      return `SCHEMA##${attributeKey || ''}##${allowedValue || ''}`;
    } else if (itemType === 'CLASSIFICATION') {
      return `CLASSIFICATION##${classificationId || ''}##${
        attributeKey || ''
      }##${allowedValue || ''}`;
    }
    return '';
  };

  // Save handler uses initialLocaleResourceItemValue to reset the form.
  const saveLocaleResourceItem = () => {
    const resourceItem = newLocaleResourceItemValue.resourceItem;
    if (isEditing) {
      DocumentsService.updateLocaleResourceItem(
        localeValue,
        resourceItem.itemKey,
        newLocaleResourceItemValue,
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
        newLocaleResourceItemValue,
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
    navigate(location.pathname);
    setIsLocaleResourceItemEditTabVisible(false);
    setNewLocaleResourceItemValue(initialLocaleResourceItemValue);
    setIsEditing(false);
  }

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
          {!isReadOnlyUser && !isEditing && (
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
            attributeOptions={attributeOptions}
            classificationOptions={classificationOptions}
            selectedClassificationAttributes={selectedClassificationAttributes}
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
