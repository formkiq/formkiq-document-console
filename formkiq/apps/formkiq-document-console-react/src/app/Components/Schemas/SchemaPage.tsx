import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
// Update these import paths to match your project structure
import { DocumentsService } from '../../helpers/services/documentsService';
import { Schema } from '../../helpers/types/schemas';
import {
  AttributesDataState,
  fetchAttributesData,
} from '../../Store/reducers/attributesData';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  fetchClassificationSchema,
  fetchSiteSchema,
} from '../../Store/reducers/schemas';
import { useAppDispatch } from '../../Store/store';

import { useEditSchemaAttribute } from '../../hooks/edit-schema-attribute';
import ButtonGhost from '../Generic/Buttons/ButtonGhost';
import ButtonPrimaryGradient from '../Generic/Buttons/ButtonPrimaryGradient';
import ButtonSecondary from '../Generic/Buttons/ButtonSecondary';
import { CopyButton } from '../Generic/Buttons/CopyButton';
import RadioCombobox from '../Generic/Listboxes/RadioCombobox';
import { Close } from '../Icons/icons';
import AddAttributesTab from './createSchemaDialog/addAttributesTab';
import LocaleLinkBuilder from './createSchemaDialog/LocaleLinkBuilder';

type SchemaPagePropsType = {
  isEditing: boolean;
  siteId: string;
  schemaType: 'site' | 'classification';
  initialSchemaValue: Schema;
  classificationId?: string;
};

function SchemaPage({
  isEditing,
  siteId,
  schemaType,
  initialSchemaValue,
  classificationId,
}: SchemaPagePropsType) {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schema, setSchema] = useState<Schema>(initialSchemaValue);
  const { allAttributes } = useSelector(AttributesDataState);

  const [compositeKey, setCompositeKey] = useState<string>('');
  const [compositeKeys, setCompositeKeys] = useState<string[]>([]);

  const [requiredKey, setRequiredKey] = useState<string>('');
  const [requiredDefaultValues, setRequiredDefaultValues] = useState<string[]>(
    []
  );
  const [requiredAllowedValue, setRequiredAllowedValue] = useState<string>('');
  const [requiredAllowedValues, setRequiredAllowedValues] = useState<string[]>(
    []
  );

  const [optionalKey, setOptionalKey] = useState<string>('');
  const [optionalDefaultValues, setOptionalDefaultValues] = useState<string[]>(
    []
  );
  const [optionalAllowedValue, setOptionalAllowedValue] = useState<string>('');
  const [optionalAllowedValues, setOptionalAllowedValues] = useState<string[]>(
    []
  );

  const [attributeKeys, setAttributeKeys] = useState<
    { key: string; title: string }[]
  >([]);
  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item: any) => ({
      key: item.key,
      title: item.key,
      dataType: item.dataType,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

  useEffect(() => {
    dispatch(fetchAttributesData({ siteId, limit: 100 }));
  }, [siteId]);

  const schemaNameRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const newSchema: Schema = {
      name: schema.name,
      attributes: schema.attributes,
    };
    // remove empty attributes
    if (
      newSchema.attributes.compositeKeys &&
      newSchema.attributes.compositeKeys.length === 0
    ) {
      delete newSchema.attributes.compositeKeys;
    }
    if (
      newSchema.attributes.required &&
      newSchema.attributes.required.length === 0
    ) {
      delete newSchema.attributes.required;
    }
    if (
      newSchema.attributes.optional &&
      newSchema.attributes.optional.length === 0
    ) {
      delete newSchema.attributes.optional;
    }
    // if defaultValues has a single item, set defaultValue
    if (newSchema.attributes.required) {
      const newRequired = newSchema.attributes.required.map((item: any) => {
        const newItem = { ...item };
        if (item.defaultValues && item.defaultValues.length === 1) {
          newItem.defaultValue = item.defaultValues[0];
          newItem.defaultValues = undefined;
          return newItem;
        } else if (item.defaultValue === '') {
          newItem.defaultValue = undefined;
          return newItem;
        } else if (item.defaultValues && item.defaultValues.length === 0) {
          newItem.defaultValues = undefined;
          return newItem;
        }
        return newItem;
      });
      newSchema.attributes = { ...newSchema.attributes, required: newRequired };
    }
    // delete empty optional attributes
    if (newSchema.attributes.optional) {
      const newOptional: any = newSchema.attributes.optional.map(
        (item: any) => {
          if (item.allowedValues && item.allowedValues.length === 0) {
            item.allowedValues = undefined;
          }
          return item;
        }
      );
      newSchema.attributes = { ...newSchema.attributes, optional: newOptional };
    }

    if (schemaType === 'classification') {
      if (!classificationId) return;
      DocumentsService.setClassification(siteId, classificationId, {
        classification: newSchema,
      }).then((response: any) => {
        if (response.status === 200) {
          dispatch(fetchClassificationSchema({ siteId, classificationId }));
          searchParams.delete('editing');
          setSearchParams(searchParams);
          resetValues();
        } else {
          if (response.errors) {
            dispatch(
              openNotificationDialog({ dialogTitle: response.errors[0].error })
            );
          }
        }
      });
    } else if (schemaType === 'site') {
      DocumentsService.setSiteSchema(siteId, newSchema).then(
        (response: any) => {
          if (response.status === 200) {
            dispatch(fetchSiteSchema({ siteId }));
            searchParams.delete('editing');
            setSearchParams(searchParams);
            resetValues();
          } else {
            if (response.errors) {
              dispatch(
                openNotificationDialog({
                  dialogTitle: response.errors[0].error,
                })
              );
            }
          }
        }
      );
    }
  };

  const resetValues = () => {
    setRequiredKey('');
    setRequiredDefaultValues([]);
    setRequiredAllowedValue('');
    setRequiredAllowedValues([]);
    setOptionalKey('');
    setOptionalAllowedValue('');
    setOptionalAllowedValues([]);
    setCompositeKey('');
    setCompositeKeys([]);
  };

  const cancelEditing = () => {
    resetValues();
    setSchema(initialSchemaValue);
    searchParams.delete('editing');
    setSearchParams(searchParams);
  };

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // methods for composite keys
  const addCompositeKey = () => {
    if (compositeKey.length === 0) {
      return;
    }
    if (compositeKeys.includes(compositeKey)) {
      dispatch(
        openNotificationDialog({ dialogTitle: 'Key was already added' })
      );
      return;
    }
    setCompositeKeys([...compositeKeys, compositeKey]);
    setCompositeKey('');
  };

  const addCompositeKeyToSchema = () => {
    const newSchema: Schema = {
      name: schema.name,
      attributes: { ...schema.attributes },
    };
    if (newSchema.attributes.compositeKeys) {
      newSchema.attributes.compositeKeys = [
        ...newSchema.attributes.compositeKeys,
        { attributeKeys: compositeKeys },
      ];
    } else {
      newSchema.attributes.compositeKeys = [{ attributeKeys: compositeKeys }];
    }
    setSchema(newSchema);
    setCompositeKeys([]);
    setCompositeKey('');
  };

  const deleteCompositeKeyFromSchema = (index: number) => {
    let newCompositeKeys: any[] = [];
    if (schema.attributes.compositeKeys) {
      newCompositeKeys = [...schema.attributes.compositeKeys];
    }
    newCompositeKeys.splice(index, 1);
    setSchema({
      ...schema,
      attributes: { ...schema.attributes, compositeKeys: newCompositeKeys },
    });
  };

  // Methods for required values
  const addRequiredAllowedValue = () => {
    if (requiredAllowedValue.length === 0) return;
    if (requiredAllowedValues.includes(requiredAllowedValue)) {
      dispatch(openNotificationDialog({ dialogTitle: 'Value already exists' }));
      return;
    }
    setRequiredAllowedValues([...requiredAllowedValues, requiredAllowedValue]);
    setRequiredAllowedValue('');
  };

  // Updated to accept an optional config with minNumberOfValues & maxNumberOfValues.
  const addRequiredToSchema = (config?: {
    minNumberOfValues: number;
    maxNumberOfValues: number;
  }) => {
    if (requiredKey.length === 0) {
      return;
    }
    const newSchema: Schema = {
      name: schema.name,
      attributes: { ...schema.attributes },
    };
    const newRequiredAttributes = {
      attributeKey: requiredKey,
      defaultValue: requiredDefaultValues[0] || '',
      defaultValues: requiredDefaultValues,
      allowedValues: requiredAllowedValues,
      ...config,
    };
    if (newSchema.attributes.required !== undefined) {
      newSchema.attributes.required = [
        ...newSchema.attributes.required,
        newRequiredAttributes,
      ];
    } else {
      newSchema.attributes.required = [newRequiredAttributes];
    }
    setSchema(newSchema);
    setRequiredKey('');
    setRequiredDefaultValues([]);
    setRequiredAllowedValues([]);
    setRequiredAllowedValue('');
  };

  const deleteRequiredFromSchema = (index: number) => {
    let newRequired: any[] = [];
    if (schema.attributes.required) {
      newRequired = [...schema.attributes.required];
    }
    newRequired.splice(index, 1);
    setSchema({
      ...schema,
      attributes: { ...schema.attributes, required: newRequired },
    });
  };

  // Methods for optional values
  const addOptionalAllowedValue = () => {
    if (optionalAllowedValue.length === 0) return;
    if (optionalAllowedValues.includes(optionalAllowedValue)) {
      dispatch(openNotificationDialog({ dialogTitle: 'Value already exists' }));
      return;
    }
    setOptionalAllowedValues([...optionalAllowedValues, optionalAllowedValue]);
    setOptionalAllowedValue('');
  };

  const addOptionalToSchema = (config?: {
    minNumberOfValues: number;
    maxNumberOfValues: number;
  }) => {
    if (optionalKey.length === 0) {
      return;
    }
    const newSchema: Schema = {
      name: schema.name,
      attributes: { ...schema.attributes },
    };
    const newOptionalAttribute = {
      attributeKey: optionalKey,
      allowedValues: optionalAllowedValues,
      ...config,
    };
    if (newSchema.attributes.optional) {
      newSchema.attributes.optional = [
        ...newSchema.attributes.optional,
        newOptionalAttribute,
      ];
    } else {
      newSchema.attributes.optional = [newOptionalAttribute];
    }
    setSchema(newSchema);
    setOptionalKey('');
    setOptionalAllowedValues([]);
    setOptionalAllowedValue('');
  };

  const deleteOptionalFromSchema = (index: number) => {
    let newOptional: any[] = [];
    if (schema.attributes.optional) {
      newOptional = [...schema.attributes.optional];
    }
    newOptional.splice(index, 1);
    setSchema({
      ...schema,
      attributes: { ...schema.attributes, optional: newOptional },
    });
  };

  const {
    editRequiredAttribute,
    editOptionalAttribute,
    requiredMinValues,
    setRequiredMinValues,
    requiredMaxValues,
    setRequiredMaxValues,
    optionalMinValues,
    setOptionalMinValues,
    optionalMaxValues,
    setOptionalMaxValues,
  } = useEditSchemaAttribute({
    schema,
    requiredKey,
    requiredDefaultValues,
    requiredAllowedValues,
    setSchema,
    optionalKey,
    optionalDefaultValues,
    optionalAllowedValues,
  });

  useEffect(() => {
    if (allAttributes && schema.attributes) {
      // Create a lookup keyed by attribute key
      const attributeMap = allAttributes.reduce(
        (acc: Record<string, any>, attr: any) => {
          acc[attr.key] = attr;
          return acc;
        },
        {} as Record<string, any>
      );

      // If you have required attributes, add dataType to each
      if (schema.attributes.required) {
        const updatedRequired = schema.attributes.required.map((req: any) => ({
          ...req,
          dataType: attributeMap[req.attributeKey]?.dataType || '',
        }));
        setSchema((prev) => ({
          ...prev,
          attributes: { ...prev.attributes, required: updatedRequired },
        }));
      }

      // Do the same for optional attributes
      if (schema.attributes.optional) {
        const updatedOptional = schema.attributes.optional.map((opt: any) => ({
          ...opt,
          dataType: attributeMap[opt.attributeKey]?.dataType || '',
        }));
        setSchema((prev) => ({
          ...prev,
          attributes: { ...prev.attributes, optional: updatedOptional },
        }));
      }
    }
  }, [allAttributes, schema.attributes]);

  return (
    <>
      <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
        <div className="flex flex-col">
          {isEditing && schemaType === 'classification' ? (
            <input
              type="text"
              className="h-12 px-4 border border-neutral-300 text-sm rounded-md xl:w-[550px]"
              placeholder="Add schema name"
              required
              value={schema.name}
              onChange={(e) => setSchema({ ...schema, name: e.target.value })}
              ref={schemaNameRef}
              onKeyDown={(e) => preventDialogClose(e)}
            />
          ) : (
            <h2 className="text-xl font-bold">
              {schemaType === 'classification'
                ? schema.name
                : `Site Schema: ${siteId}`}
            </h2>
          )}
          {classificationId && (
            <span className="block text-xs font-semibold">
              ID: <span className=" text-neutral-500">{classificationId}</span>
              <span className="pl-2">
                <CopyButton value={classificationId} />
              </span>
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center">
            <input
              id="allowAdditionalAttributes"
              type="checkbox"
              checked={schema.attributes.allowAdditionalAttributes}
              onChange={() =>
                setSchema({
                  ...schema,
                  attributes: {
                    ...schema.attributes,
                    allowAdditionalAttributes:
                      !schema.attributes.allowAdditionalAttributes,
                  },
                })
              }
              name="allowAdditionalAttributes"
              className="rounded-md w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-neutral-500 focus:ring-2 text-neutral-900"
            />
            <label
              htmlFor="allowAdditionalAttributes"
              className="ml-2 text-sm font-medium text-neutral-900"
            >
              Allow Additional Attributes
            </label>
          </div>
        ) : (
          <div className="flex items-center">
            <input
              id="allowAdditionalAttributes"
              type="checkbox"
              checked={schema.attributes.allowAdditionalAttributes}
              disabled
              name="allowAdditionalAttributes"
              className="rounded-md w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-neutral-500 focus:ring-2 text-neutral-900 disabled:text-neutral-500 disabled:border-neutral-500"
            />
            <label
              htmlFor="allowAdditionalAttributes"
              className="ml-2 text-sm font-medium text-neutral-500"
            >
              Allow Additional Attributes
            </label>
          </div>
        )}
        <h3 className="font-bold text-md">Composite Keys</h3>
        {isEditing && (
          <>
            <div className="flex h-10 flex-row justify-between items-center gap-4 text-base xl:w-[550px]">
              <RadioCombobox
                values={attributeKeys}
                selectedValue={compositeKey}
                setSelectedValue={setCompositeKey}
                placeholderText="Composite Key"
              />

              <button
                type="button"
                className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
                onClick={addCompositeKey}
              >
                + Add to Key
              </button>
            </div>

            {compositeKeys.length > 0 && (
              <div className="flex flex-col gap-2 items-start">
                <div className="flex flex-row justify-start flex-wrap gap-2 ">
                  {compositeKeys.map((key: string) => (
                    <div
                      key={key}
                      className="bg-neutral-300 py-1.5 px-3 text-xs font-bold text-neutral-900 rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2"
                    >
                      <span className="text-ellipsis overflow-hidden">
                        {key}
                      </span>
                      <button
                        title="Remove Composite Key"
                        type="button"
                        className="w-4 h-4 min-w-4 text-neutral-900"
                        onClick={() =>
                          setCompositeKeys(
                            compositeKeys.filter((k: string) => k !== key)
                          )
                        }
                      >
                        <Close />
                      </button>
                    </div>
                  ))}
                </div>
                <ButtonSecondary onClick={addCompositeKeyToSchema}>
                  ADD COMPOSITE KEY
                </ButtonSecondary>
              </div>
            )}
          </>
        )}

        <table className="border border-neutral-300 w-full max-w-full table-fixed text-left">
          <thead className="bg-neutral-100 text-sm border border-neutral-300 ">
            <tr className="border border-neutral-300 px-4 text-neutral-900">
              <th className="w-4 px-4"> #</th>
              <th>Composite Keys</th>
              {isEditing && <th className="w-[30px]"></th>}
            </tr>
          </thead>
          <tbody>
            {schema.attributes.compositeKeys &&
            schema.attributes.compositeKeys.length > 0 ? (
              schema.attributes.compositeKeys.map((item: any, i: number) => (
                <tr
                  key={'compositeKey_' + i}
                  className="border border-neutral-300 px-4 h-12 text-neutral-900"
                >
                  <td className="text-sm text-slate-500 px-4">
                    <span className="text-gray-900 font-medium">{i + 1}</span>
                  </td>
                  <td className="text-sm text-ellipsis overflow-hidden">
                    {item?.attributeKeys.join(', ')}
                  </td>
                  {isEditing && (
                    <td className="w-[30px]">
                      <button
                        type="button"
                        className="w-4 h-4"
                        onClick={() => deleteCompositeKeyFromSchema(i)}
                      >
                        <Close />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="border border-neutral-300 px-4 h-12 text-neutral-900">
                <td
                  colSpan={2}
                  className="text-sm text-slate-500 px-4 text-center"
                >
                  No Composite Keys
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <hr className="border border-neutral-300 w-full max-w-full mt-4" />
        <h3 className="font-bold text-md">Required Attributes</h3>
        {isEditing ? (
          <AddAttributesTab
            attributeKeys={attributeKeys}
            tagsKey={requiredKey}
            setTagsKey={setRequiredKey}
            preventDialogClose={preventDialogClose}
            defaultValues={requiredDefaultValues}
            setDefaultValues={setRequiredDefaultValues}
            allowedValue={requiredAllowedValue}
            setAllowedValue={setRequiredAllowedValue}
            addAllowedValue={addRequiredAllowedValue}
            allowedValues={requiredAllowedValues}
            setAllowedValues={setRequiredAllowedValues}
            addAttributesToSchema={addRequiredToSchema}
            deleteTagsFromSchema={deleteRequiredFromSchema}
            attributes={
              schema.attributes.required ? schema.attributes.required : null
            }
            allAttributes={allAttributes}
            attributeType="required"
            minNumberOfValues={requiredMinValues}
            setMinNumberOfValues={setRequiredMinValues}
            maxNumberOfValues={requiredMaxValues}
            setMaxNumberOfValues={setRequiredMaxValues}
            editAttribute={editRequiredAttribute}
          />
        ) : (
          <table className="border border-neutral-300 w-full max-w-full table-fixed text-left">
            <thead className="sticky top-0 bg-neutral-100 text-sm border border-neutral-300 ">
              <tr className="border border-neutral-300 px-4 text-neutral-900">
                <th className="w-4 px-4"> #</th>
                <th> Key</th>
                <th> Default Value(s)</th>
                <th> Min / Max Num Values</th>
                <th> Allowed Values</th>
                <th> Localization </th>
                <th className="w-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {schema.attributes.required ? (
                schema.attributes.required.map((value: any, i: number) => (
                  <tr
                    key={'tag_' + i}
                    className="border border-neutral-300 px-4 h-12 text-neutral-900"
                  >
                    <td className="text-sm text-slate-500 px-4">
                      <span className="text-gray-900 font-medium">{i + 1}</span>
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.attributeKey}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.dataType === 'STRING' ||
                      value.dataType === 'NUMBER' ||
                      value.dataType === 'BOOLEAN' ? (
                        <>
                          {value.defaultValues &&
                            value.defaultValues.join(', ')}
                          {value.defaultValue}
                        </>
                      ) : (
                        'n/a'
                      )}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.dataType === 'STRING' ||
                      value.dataType === 'NUMBER' ? (
                        <>
                          MIN: {value.minNumberOfValues} / MAX:{' '}
                          {value.maxNumberOfValues}
                        </>
                      ) : (
                        'n/a'
                      )}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.allowedValues && value.allowedValues.length > 0
                        ? value.allowedValues.join(', ')
                        : value.dataType === 'STRING' ||
                          value.dataType === 'NUMBER'
                        ? '(any)'
                        : 'n/a'}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.dataType === 'STRING' && (
                        <>
                          {schemaType === 'classification' ? (
                            <LocaleLinkBuilder
                              siteId={siteId}
                              itemType="CLASSIFICATION"
                              attributeKey={value.attributeKey}
                              classificationId={classificationId}
                            />
                          ) : (
                            <LocaleLinkBuilder
                              siteId={siteId}
                              itemType="SCHEMA"
                              attributeKey={value.attributeKey}
                            />
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border border-neutral-300 px-4 h-12 text-neutral-900">
                  <td
                    colSpan={5}
                    className="text-sm text-slate-500 px-4 text-center"
                  >
                    No Required Attributes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <hr className="border border-neutral-300 w-full max-w-full mt-4" />

        <h3 className="font-bold text-md">Optional Attributes</h3>
        {isEditing ? (
          <AddAttributesTab
            attributeKeys={attributeKeys}
            tagsKey={optionalKey}
            setTagsKey={setOptionalKey}
            preventDialogClose={preventDialogClose}
            defaultValues={optionalDefaultValues}
            setDefaultValues={setOptionalDefaultValues}
            allowedValue={optionalAllowedValue}
            setAllowedValue={setOptionalAllowedValue}
            addAllowedValue={addOptionalAllowedValue}
            allowedValues={optionalAllowedValues}
            setAllowedValues={setOptionalAllowedValues}
            addAttributesToSchema={addOptionalToSchema}
            deleteTagsFromSchema={deleteOptionalFromSchema}
            attributes={schema.attributes.optional}
            allAttributes={allAttributes}
            attributeType="optional"
            minNumberOfValues={optionalMinValues}
            setMinNumberOfValues={setOptionalMinValues}
            maxNumberOfValues={optionalMaxValues}
            setMaxNumberOfValues={setOptionalMaxValues}
            editAttribute={editOptionalAttribute}
          />
        ) : (
          <table className="border border-neutral-300 w-full max-w-full table-fixed text-left">
            <thead className="sticky top-0 bg-neutral-100 text-sm border border-neutral-300 ">
              <tr className="border border-neutral-300 px-4 text-neutral-900">
                <th className="w-4 px-4"> #</th>
                <th> Key</th>
                <th> Default Value(s)</th>
                <th> Min / Max Num Values</th>
                <th> Allowed Values</th>
                <th> Localization</th>
                <th className="w-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {schema.attributes.optional ? (
                schema.attributes.optional.map((value: any, i: number) => (
                  <tr
                    key={'tag_' + i}
                    className="border border-neutral-300 px-4 h-12 text-neutral-900"
                  >
                    <td className="text-sm text-slate-500 px-4">
                      <span className="text-gray-900 font-medium">{i + 1}</span>
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.attributeKey}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.dataType === 'STRING' ||
                      value.dataType === 'NUMBER' ||
                      value.dataType === 'BOOLEAN' ? (
                        <>
                          {value.defaultValues &&
                            value.defaultValues.join(', ')}
                          {value.defaultValue}
                        </>
                      ) : (
                        'n/a'
                      )}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.dataType === 'STRING' ||
                      value.dataType === 'NUMBER' ? (
                        <>
                          MIN: {value.minNumberOfValues} / MAX:{' '}
                          {value.maxNumberOfValues}
                        </>
                      ) : (
                        'n/a'
                      )}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.allowedValues && value.allowedValues.length > 0
                        ? value.allowedValues.join(', ')
                        : value.dataType === 'STRING' ||
                          value.dataType === 'NUMBER'
                        ? '(any)'
                        : 'n/a'}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.dataType === 'STRING' && (
                        <>
                          {schemaType === 'classification' ? (
                            <LocaleLinkBuilder
                              siteId={siteId}
                              itemType="CLASSIFICATION"
                              attributeKey={value.attributeKey}
                              classificationId={classificationId}
                            />
                          ) : (
                            <LocaleLinkBuilder
                              siteId={siteId}
                              itemType="SCHEMA"
                              attributeKey={value.attributeKey}
                            />
                          )}
                        </>
                      )}
                    </td>
                    <td></td>
                  </tr>
                ))
              ) : (
                <tr className="border border-neutral-300 px-4 h-12 text-neutral-900">
                  <td
                    colSpan={4}
                    className="text-sm text-slate-500 px-4 text-center"
                  >
                    No Optional Attributes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {isEditing && (
          <div className="flex flex-row justify-end gap-4 text-base font-bold mt-4">
            <ButtonGhost
              type="button"
              onClick={cancelEditing}
              className="h-10 border border-neutral-900 px-4 rounded-md"
            >
              CANCEL
            </ButtonGhost>
            <ButtonPrimaryGradient
              type="submit"
              className="h-10 bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 rounded-md"
            >
              Save
            </ButtonPrimaryGradient>
          </div>
        )}
      </form>
    </>
  );
}

export default SchemaPage;
