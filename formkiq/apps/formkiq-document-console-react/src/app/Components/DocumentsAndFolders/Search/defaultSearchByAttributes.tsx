import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useLocation, useSearchParams} from 'react-router-dom';
import {DataCacheState} from '../../../Store/reducers/data';
import {fetchDocuments} from '../../../Store/reducers/documentsList';
import {openDialog as openNotificationDialog} from '../../../Store/reducers/globalNotificationControls';
import {useAppDispatch} from '../../../Store/store';
import {Attribute} from '../../../helpers/types/attributes';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import CheckboxListbox from '../../Generic/Listboxes/CheckboxListbox';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';
import {Close, Plus} from '../../Icons/icons';

export default function DefaultSearchByAttributes({
                                                    siteId,
                                                    formkiqVersion,
                                                    subfolderUri,
                                                  }: any) {
  const stringAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'One of'},
    {key: 'beginsWith', title: 'Begins with'},
    {key: 'range', title: 'Range'},
  ];
  const numberAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'One of'},
    {key: 'range', title: 'Range'},
  ];
  const booleanAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'One of'},
  ];

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = useLocation().search;
  const searchWord = new URLSearchParams(search).get('searchWord');
  const searchFolder = new URLSearchParams(search).get('searchFolder');
  const filterTag = new URLSearchParams(search).get('filterTag');
  const filterAttribute = new URLSearchParams(search).get('filterAttribute');

  const {allAttributes} = useSelector(DataCacheState);
  const [attributeKeys, setAttributeKeys] = useState<{ key: string; title: string }[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>('');
  const [attributeCriteria, setAttributeCriteria] = useState<{ key: string; title: string }[]>([]);
  const [selectedAttributeCriteria, setSelectedAttributeCriteria] = useState<string | null>(null);
  const [attributeValue, setAttributeValue] = useState<string | number | boolean | null>('');
  const [attributeValues, setAttributeValues] = useState<any[]>([]);

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({
      key: item.key,
      title: item.key,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

  function resetAttributeValue(attribute: Attribute) {
    if (attribute.dataType === 'STRING') {
      setAttributeValue('');
    } else if (attribute.dataType === 'NUMBER') {
      setAttributeValue(0);
    } else if (attribute.dataType === 'BOOLEAN') {
      setAttributeValue(false);
    } else {
      setAttributeValue(null);
    }
  }

  function onAttributeSelect(key: string) {
    setSelectedAttributeKey(key);
    const attribute = allAttributes.find((item) => item.key === key);
    if (!attribute) return;
    setSelectedAttribute(attribute);

    if (attribute.dataType === 'STRING') {
      setSelectedAttributeCriteria('eq');
      setAttributeCriteria(stringAttributeCriteria);
    } else if (attribute.dataType === 'NUMBER') {
      setSelectedAttributeCriteria('eq');
      setAttributeCriteria(numberAttributeCriteria);
    } else if (attribute.dataType === 'BOOLEAN') {
      setSelectedAttributeCriteria('eq');
      setAttributeCriteria(booleanAttributeCriteria);
    } else {
      setSelectedAttributeCriteria(null);
      setAttributeCriteria([]);
    }
    resetAttributeValue(attribute);
    setAttributeValues([]);
  }

  const onSearch = () => {
    const selectedAttributeQuery = getAttributeQuery();
    if (!selectedAttributeQuery) return;
    dispatch(
      fetchDocuments({
        siteId,
        formkiqVersion,
        page: 1,
        searchAttributes: [selectedAttributeQuery],
        searchWord,
        searchFolder,
        filterTag,
        filterAttribute,
        subfolderUri,
      })
    );
  };

  function validateAttributeValue(dataType: any, value: any) {
    if (dataType === 'STRING' && typeof value !== 'string') return false;
    if (dataType === 'NUMBER' && value === '') return false;
    if (dataType === 'BOOLEAN' && typeof value !== 'boolean') return false;
    return true;
  }

  function addAttributeValueToList() {
    if (attributeValue === undefined || !selectedAttribute) return;
    if (!validateAttributeValue(selectedAttribute.dataType, attributeValue))
      return;

    // check if value already exists in list
    if (attributeValues.includes(attributeValue)) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Value already exists in list',
        })
      );
      return;
    }
    setAttributeValues([...attributeValues, attributeValue]);
    resetAttributeValue(selectedAttribute);
  }

  function removeAttributeValueFromList(value: any) {
    setAttributeValues(attributeValues.filter((item) => item !== value));
  }

  function getAttributeQuery() {
    if (!selectedAttribute) return;
    const searchAttribute: any = {
      key: selectedAttribute.key,
    };

    // Handle KEY_ONLY data type
    if (selectedAttribute.dataType === 'KEY_ONLY') {
      return searchAttribute;
    }
    if (attributeValue === undefined) return;

    // Handle equality criteria ('eq')
    if (selectedAttributeCriteria === 'eq') {
      // Validate value type based on data type
      if (!validateAttributeValue(selectedAttribute.dataType, attributeValue))
        return;
      searchAttribute['eq'] = attributeValue;
    } else if (selectedAttributeCriteria === 'eqOr') {
      // Check for at least one value for 'eqOr' criteria
      if (attributeValues.length === 0) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Please add at least one value',
          })
        );
        return;
      }
      searchAttribute['eqOr'] = attributeValues;
    } else if (selectedAttributeCriteria === 'beginsWith') {
      searchAttribute['beginsWith'] = attributeValue;
    } else if (selectedAttributeCriteria === 'range') {
      if (attributeValues.length !== 2) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Please add two values for range',
          })
        );
        return;
      }
      searchAttribute['range'] = {
        start: attributeValues[0],
        end: attributeValues[1],
        type: selectedAttribute.dataType,
      };
    }
    return searchAttribute;
  }

  function handleSelectBooleanValues(values: any[]) {
    setAttributeValues(values);
  }

  function handleSelectAttributeCriteria(key: string) {
    setSelectedAttributeCriteria(key);
    setAttributeValues([]);
    resetAttributeValue(selectedAttribute as Attribute);
  }

  function handleRangeInput(value: string, position: 'start' | 'end') {
    const newValues = [...attributeValues];
    if (position === 'start') {
      newValues[0] = value;
    } else {
      newValues[1] = value;
    }
    setAttributeValues(newValues);
  }

  function onCloseTab() {
    searchParams.delete('advancedSearch');
    setSearchParams(searchParams);
    // re-fetch documents
    dispatch(
      fetchDocuments({
        siteId,
        formkiqVersion,
        page: 1,
        searchFolder,
        filterTag,
        filterAttribute,
        subfolderUri,
      })
    );
  }

  const resetSearch = () => {
    setSelectedAttributeKey('');
    setSelectedAttribute(null);
    setSelectedAttributeCriteria(null);
    setAttributeCriteria([]);
    setAttributeValue('');
    setAttributeValues([]);
  };

  return (
    <div className="w-full h-full">
      <div className="h-full border-gray-400 border overflow-y-auto p-2">
        <div className="h-8 gap-2 flex items-center">
          <div className="h-8 flex items-center gap-2">
            <RadioCombobox
              values={attributeKeys}
              selectedValue={selectedAttributeKey}
              setSelectedValue={onAttributeSelect}
              placeholderText="Attribute"
            />
            {selectedAttribute && (
              <div className="text-xs bg-neutral-100 rounded-md font-bold h-8 p-2 text-center whitespace-nowrap">
                {selectedAttribute.dataType}
              </div>
            )}
          </div>
          {selectedAttribute &&
            (selectedAttribute.dataType === 'NUMBER' ||
              selectedAttribute.dataType === 'STRING' ||
              selectedAttribute.dataType === 'BOOLEAN') && (
              <div className="h-8">
                <RadioListbox
                  values={attributeCriteria.map((item) => item.key)}
                  titles={attributeCriteria.map((item) => item.title)}
                  selectedValue={selectedAttributeCriteria as string}
                  setSelectedValue={handleSelectAttributeCriteria}
                />
              </div>
            )}

          {/*STRING*/}
          {selectedAttribute &&
            selectedAttribute.dataType === 'STRING' &&
            selectedAttributeCriteria === 'eq' && (
              <input
                type="text"
                className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                required
                value={attributeValue as string}
                onChange={(e: any) => setAttributeValue(e.target.value)}
              />
            )}
          {selectedAttribute &&
            selectedAttribute.dataType === 'STRING' &&
            selectedAttributeCriteria === 'eqOr' && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required={attributeValues.length === 0} // check if added at least one attribute
                  value={attributeValue as string}
                  onChange={(e: any) => setAttributeValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addAttributeValueToList}
                  title="Add"
                  className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                >
                  <Plus/>
                </button>
              </div>
            )}
          {selectedAttribute &&
            selectedAttribute.dataType === 'STRING' &&
            selectedAttributeCriteria === 'beginsWith' && (
              <input
                type="text"
                className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                required
                value={attributeValue as string}
                onChange={(e: any) => setAttributeValue(e.target.value)}
              />
            )}
          {selectedAttribute &&
            selectedAttribute.dataType === 'STRING' &&
            selectedAttributeCriteria === 'range' && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required
                  value={attributeValues[0] || ''}
                  onChange={(e: any) =>
                    handleRangeInput(e.target.value, 'start')
                  }
                />
                <span className="text-neutral-500">-</span>
                <input
                  type="text"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required
                  value={attributeValues[1] || ''}
                  onChange={(e: any) => handleRangeInput(e.target.value, 'end')}
                />
              </div>
            )}

          {/*NUMBER*/}
          {selectedAttribute &&
            selectedAttribute.dataType === 'NUMBER' &&
            selectedAttributeCriteria === 'eq' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required
                  value={attributeValue as number}
                  onChange={(e: any) => setAttributeValue(e.target.value)}
                />
              </div>
            )}
          {selectedAttribute &&
            selectedAttribute.dataType === 'NUMBER' &&
            selectedAttributeCriteria === 'eqOr' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required={attributeValues.length === 0} // check if added at least one attribute
                  value={attributeValue as number}
                  onChange={(e: any) => setAttributeValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addAttributeValueToList}
                  title="Add"
                  className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                >
                  <Plus/>
                </button>
              </div>
            )}
          {selectedAttribute &&
            selectedAttribute.dataType === 'NUMBER' &&
            selectedAttributeCriteria === 'range' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required
                  value={attributeValues[0] || ''}
                  onChange={(e: any) =>
                    handleRangeInput(e.target.value, 'start')
                  }
                />
                <span className="text-neutral-500">-</span>
                <input
                  type="number"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  required
                  value={attributeValues[1] || ''}
                  onChange={(e: any) => handleRangeInput(e.target.value, 'end')}
                />
              </div>
            )}

          {/*BOOLEAN*/}
          {selectedAttribute &&
            selectedAttribute.dataType === 'BOOLEAN' &&
            selectedAttributeCriteria === 'eq' && (
              <div className="flex items-center gap-2 h-full">
                <RadioListbox
                  values={['true', 'false']}
                  titles={['True', 'False']}
                  selectedValue={(attributeValue as string).toString()}
                  setSelectedValue={(val: string) => {
                    setAttributeValue(val === 'true');
                  }}
                />
              </div>
            )}
          {selectedAttribute &&
            selectedAttribute.dataType === 'BOOLEAN' &&
            selectedAttributeCriteria === 'eqOr' && (
              <CheckboxListbox
                values={['true', 'false']}
                selectedValues={attributeValues}
                handleSelectValues={handleSelectBooleanValues}
              />
            )}

          <ButtonGhost
            type="button"
            onClick={resetSearch}
            title="Cancel"
          >
            Cancel
          </ButtonGhost>

        </div>

        <div className="flex flex-row justify-start flex-wrap gap-2 items-end mt-2">
          {selectedAttributeCriteria !== 'range' &&
            attributeValues.map((val: string, i: number) => (
              <div
                key={'value_' + i}
                title={val}
                className="cursor-pointer py-1 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900 bg-white"
              >
                <span className="truncate overflow-hidden max-w-64 max-w-[256px]">
                  "{val}"
                </span>
                <button
                  title="Remove Value"
                  type="button"
                  className="w-4 h-4 min-w-4 text-neutral-900"
                  onClick={() => removeAttributeValueFromList(val)}
                >
                  <Close/>
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <ButtonGhost type="button" onClick={onCloseTab}>Cancel</ButtonGhost>
        <ButtonPrimary type="button" onClick={onSearch}>
          Search
        </ButtonPrimary>
      </div>
    </div>
  );
}
