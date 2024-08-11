import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchDocuments } from '../../../Store/reducers/documentsList';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { Attribute } from '../../../helpers/types/attributes';
import { useLocation, useSearchParams } from 'react-router-dom';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import ButtonSecondary from '../../Generic/Buttons/ButtonSecondary';
import CheckboxListbox from '../../Generic/Listboxes/CheckboxListbox';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';
import { ChevronDown, Close, Plus } from '../../Icons/icons';
import SearchLine from './searchLine';
import { AttributesDataState } from '../../../Store/reducers/attributesData';

export default function OpenSearchByAttributes({
  siteId,
  formkiqVersion,
  subfolderUri,
  minimizeAdvancedSearch,
  closeAdvancedSearch,
}: any) {
  const opensearchAttributeCriteria = [
    { key: 'eq', title: 'Equal to' },
    { key: 'eqOr', title: 'One of' },
  ];
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = useLocation().search;
  const searchWord = new URLSearchParams(search).get('searchWord');
  const searchFolder = new URLSearchParams(search).get('searchFolder');
  const filterTag = new URLSearchParams(search).get('filterTag');
  const filterAttribute = new URLSearchParams(search).get('filterAttribute');

  const { allAttributes } = useSelector(AttributesDataState);
  const [attributeKeys, setAttributeKeys] = useState<
    { key: string; title: string }[]
  >([]);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>('');
  const [selectedAttributeCriteria, setSelectedAttributeCriteria] = useState<
    string | null
  >(null);
  const [attributeValue, setAttributeValue] = useState<
    string | number | boolean | null
  >('');
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [selectedAttributesQuery, setSelectedAttributesQuery] = useState<any[]>(
    []
  );
  const [searchInput, setSearchInput] = useState<string>(
    searchWord ? searchWord : ''
  );

  function stringToBoolean(value: string) {
    return value === 'true';
  }

  function stringToNumber(value: string) {
    try {
      return Number(value);
    } catch (e) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Invalid number',
        })
      );
      return;
    }
  }

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
    } else if (attribute.dataType === 'NUMBER') {
      setSelectedAttributeCriteria('eq');
    } else if (attribute.dataType === 'BOOLEAN') {
      setSelectedAttributeCriteria('eq');
    } else {
      setSelectedAttributeCriteria(null);
    }
    resetAttributeValue(attribute);
    setAttributeValues([]);
  }

  const resetValues = () => {
    setSelectedAttribute(null);
    setSelectedAttributeKey('');
    setSelectedAttributeCriteria(null);
    setAttributeValue(null);
    setAttributeValues([]);
  };

  const onSearch = () => {
    let searchAttributes: any = null;
    if (selectedAttributesQuery.length > 0) {
      searchAttributes = selectedAttributesQuery;
    }
    dispatch(
      fetchDocuments({
        siteId,
        formkiqVersion,
        page: 1,
        searchAttributes,
        searchWord: searchInput,
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

    let newAttributeValue: any = attributeValue;
    if (selectedAttribute.dataType === 'NUMBER') {
      if (attributeValue === null) return;
      newAttributeValue = stringToNumber(attributeValue.toString());
    }

    // check if value already exists in list
    if (attributeValues.includes(newAttributeValue)) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Value already exists in list',
        })
      );
      return;
    }
    setAttributeValues([...attributeValues, newAttributeValue]);
    resetAttributeValue(selectedAttribute);
  }

  function removeAttributeValueFromList(value: any) {
    setAttributeValues(attributeValues.filter((item) => item !== value));
  }

  function addAttributeToQuery() {
    if (!selectedAttribute) return;
    // check if value already exists in query
    if (
      selectedAttributesQuery.find((item) => item.key === selectedAttribute.key)
    ) {
      dispatch(
        openNotificationDialog({
          dialogTitle:
            "Attribute '" + selectedAttribute.key + "' already in query",
        })
      );
      return;
    }
    const searchAttribute: any = {
      key: selectedAttribute.key,
    };

    // Handle KEY_ONLY data type
    if (selectedAttribute.dataType === 'KEY_ONLY') {
      searchAttribute['eq'] = {
        booleanValue: true,
      };
      setSelectedAttributesQuery([...selectedAttributesQuery, searchAttribute]);
      resetValues();
      return;
    }
    if (attributeValue === undefined) return;
    // Determine value type based on data type
    let valueType = 'stringValue';
    if (selectedAttribute.dataType === 'NUMBER') valueType = 'numberValue';
    if (selectedAttribute.dataType === 'BOOLEAN') valueType = 'booleanValue';

    // Handle equality criteria ('eq')
    if (selectedAttributeCriteria === 'eq') {
      // Validate value type based on data type
      if (!validateAttributeValue(selectedAttribute.dataType, attributeValue))
        return;

      searchAttribute['eq'] = {
        [valueType]: attributeValue,
      };
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

      if (selectedAttribute.dataType === 'BOOLEAN') {
        searchAttribute['eqOr'] = attributeValues.map((item) => ({
          booleanValue: stringToBoolean(item),
        }));
      } else if (selectedAttribute.dataType === 'NUMBER') {
        searchAttribute['eqOr'] = attributeValues.map((item) => ({
          numberValue: stringToNumber(item),
        }));
      } else {
        searchAttribute['eqOr'] = attributeValues.map((item) => ({
          [valueType]: item,
        }));
      }
    }
    setSelectedAttributesQuery([...selectedAttributesQuery, searchAttribute]);
    resetValues();
  }

  function handleSelectBooleanValues(values: any[]) {
    setAttributeValues(values);
  }

  function handleSelectAttributeCriteria(key: string) {
    setSelectedAttributeCriteria(key);
    setAttributeValues([]);
    resetAttributeValue(selectedAttribute as Attribute);
  }

  function updateInputValue(value: string) {
    setSearchInput(value);
  }

  function onCloseTab() {
    closeAdvancedSearch();
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

  return (
    <div className="w-full h-full">
      <div className="h-full border-gray-400 border p-2">
        <SearchLine
          siteId={siteId}
          searchWord={searchWord}
          onSearch={onSearch}
          updateInputValue={updateInputValue}
          inputValue={searchInput}
        />
        {attributeKeys.length ? (
          <div className="h-8 gap-2 flex items-center">
            <div className="h-full flex items-center gap-2 w-full max-w-[350px]">
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
                    values={opensearchAttributeCriteria.map((item) => item.key)}
                    titles={opensearchAttributeCriteria.map(
                      (item) => item.title
                    )}
                    selectedValue={selectedAttributeCriteria as string}
                    setSelectedValue={handleSelectAttributeCriteria}
                  />
                </div>
              )}

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
                    <Plus />
                  </button>
                </div>
              )}
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
                    <Plus />
                  </button>
                </div>
              )}
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

            {selectedAttribute && (
              <>
                <ButtonSecondary
                  type="button"
                  onClick={addAttributeToQuery}
                  title="Add"
                >
                  Add
                </ButtonSecondary>
                <ButtonGhost type="button" onClick={resetValues} title="Cancel">
                  Cancel
                </ButtonGhost>
              </>
            )}
          </div>
        ) : (
          <div className="text-sm">
            (No attributes have been created in this workspace; create an
            attribute to enable custom metadata for search.)
          </div>
        )}
        <div className="flex flex-row justify-start flex-wrap gap-2 items-end mt-2">
          {attributeValues.map((val: string, i: number) => (
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
                <Close />
              </button>
            </div>
          ))}
        </div>

        {selectedAttributesQuery.length > 0 && (
          <div className="max-h-[35vh] overflow-y-auto w-fit">
          <table
            className=" border-separate border-spacing-0 border-x border-b border-neutral-300 table-fixed text-sm text-left mt-2 bg-white">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="w-52 px-2 border-b border-t border-neutral-300">Key</th>
                <th className="w-32 px-2 border-b border-t border-neutral-300">Criteria</th>
                <th className="w-96 px-2 border-b border-t border-t border-neutral-300">Values</th>
                <th className="w-8 border-b border-t border-neutral-300"></th>
              </tr>
            </thead>
            <tbody>
              {selectedAttributesQuery.map((item: any, i: number) => (
                <tr key={i} className="border-t border-neutral-300">
                  <td className="px-2">{item.key}</td>
                  <td className="px-2">
                    {item.eq && 'Equal to'}
                    {item.eqOr && 'One of'}
                  </td>
                  <td className="px-2">
                    {item.eq &&
                      item.eq.stringValue !== undefined &&
                      '"' + item.eq.stringValue + '"'}
                    {item.eqOr &&
                      item.eqOr
                        .filter((val: any) => val.stringValue)
                        .map((val: any) => '"' + val.stringValue + '"')
                        .join(', ')}
                    {item.eq &&
                      item.eq.numberValue !== undefined &&
                      '"' + item.eq.numberValue + '"'}
                    {item.eqOr &&
                      item.eqOr
                        .filter((val: any) => val.numberValue)
                        .map((val: any) => '"' + val.numberValue + '"')
                        .join(', ')}
                    {item.eq &&
                      item.eq.booleanValue !== undefined &&
                      '"' + item.eq.booleanValue.toString() + '"'}
                    {item.eqOr &&
                      item.eqOr
                        .filter((val: any) => val.booleanValue !== undefined)
                        .map(
                          (val: any) => '"' + val.booleanValue.toString() + '"'
                        )
                        .join(', ')}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="p-1 text-neutral-500 h-6 w-6 hover:text-red-500"
                      onClick={() => {
                        setSelectedAttributesQuery(
                          selectedAttributesQuery.filter(
                            (_: any, j: number) => j !== i
                          )
                        );
                      }}
                      title="Remove"
                    >
                      <Close />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-1">
        <button
          type="button"
          onClick={minimizeAdvancedSearch}
          className="text-sm flex gap-2 items-center font-bold text-gray-500 hover:text-primary-500 cursor-pointer whitespace-nowrap"
        >
          Minimize Search Tab
          <div className="w-4 h-4 -mt-1 rotate-180">
            <ChevronDown />
          </div>
        </button>
        <ButtonGhost type="button" onClick={onCloseTab}>
          Cancel
        </ButtonGhost>
        <ButtonPrimary type="button" onClick={onSearch}>
          Search
        </ButtonPrimary>
      </div>
    </div>
  );
}
