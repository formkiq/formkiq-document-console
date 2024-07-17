import {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {fetchDocumentAttributes} from '../../../Store/reducers/attributes';
import {AttributesDataState} from '../../../Store/reducers/attributesData';
import {openDialog as openNotificationDialog} from '../../../Store/reducers/globalNotificationControls';
import {useAppDispatch} from '../../../Store/store';
import {DocumentsService} from '../../../helpers/services/documentsService';
import {Attribute} from '../../../helpers/types/attributes';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import {Close, Plus} from '../../Icons/icons';
import AddAttributeForm from './AddAttributeForm';

function AddDocumentAttributeForm({
                                    onDocumentDataChange,
                                    siteId,
                                    value,
                                    getValue,
                                  }: any) {
  const {allAttributes} = useSelector(AttributesDataState);
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);
  const [attributeKeys, setAttributeKeys] = useState<{ key: string; title: string }[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>('');
  const [isAddAttributeFormOpen, setIsAddAttributeFormOpen] =
    useState<boolean>(false);
  const [stringValues, setStringValues] = useState<string[]>([]);
  const [numberValues, setNumberValues] = useState<any[]>([]);

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({
      key: item.key,
      title: item.key,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

  useEffect(() => {
    if (!selectedAttributeKey) return;
    const attribute = allAttributes.find(
      (item) => item.key === selectedAttributeKey
    );
    if (!attribute) return;
    setSelectedAttribute(attribute);
    setStringValues([]);
    setNumberValues([]);
    setValue('stringValue', undefined);
    setValue('numberValue', undefined);
    setValue('booleanValue', undefined);
  }, [selectedAttributeKey]);

  const {
    register,
    formState: {errors},
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm();

  const addStringValue = () => {
    const currentStringValue = getValues('stringValue');
    if (currentStringValue === '') return;
    if (stringValues.includes(currentStringValue)) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Duplicate attribute value',
        })
      );
      return;
    }
    setValue('stringValue', '');
    setStringValues([...stringValues, currentStringValue]);
  };
  const handleRemoveStringValue = (index: number) => {
    const newStringValues = [...stringValues];
    newStringValues.splice(index, 1);
    setStringValues(newStringValues);
  };

  const addNumberValue = () => {
    const currentNumberValue = getValues('numberValue');
    if (currentNumberValue === '') return;
    const numberValue = Number(currentNumberValue);
    if (numberValues.includes(numberValue)) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Duplicate attribute value',
        })
      );
      return;
    }
    setValue('numberValue', 0);
    setNumberValues([...numberValues, numberValue]);
  };
  const handleRemoveNumberValue = (index: number) => {
    const newNumberValues = [...numberValues];
    newNumberValues.splice(index, 1);
    setNumberValues(newNumberValues);
  };

  const resetValues = () => {
    setSelectedAttribute(null);
    setSelectedAttributeKey('');
    setStringValues([]);
    setNumberValues([]);
    reset();
  };
  const onAddAttributeSubmit = async (data: any) => {
    if (!selectedAttribute) return;
    let documentAttributes = {};
    if (
      data.stringValue &&
      stringValues.length === 0 &&
      selectedAttribute.dataType === 'STRING'
    ) {
      documentAttributes = {
        attributes: [
          {
            key: selectedAttributeKey,
            stringValue: data.stringValue,
          },
        ],
      };
    }
    if (stringValues.length > 0 && selectedAttribute.dataType === 'STRING') {
      if (stringValues.length === 1) {
        documentAttributes = {
          attributes: [
            {
              key: selectedAttributeKey,
              stringValue: stringValues[0],
            },
          ],
        };
      } else {
        documentAttributes = {
          attributes: [
            {
              key: selectedAttributeKey,
              stringValues: stringValues,
            },
          ],
        };
      }
    }

    if (
      data.numberValue !== undefined &&
      numberValues.length === 0 &&
      selectedAttribute.dataType === 'NUMBER'
    ) {
      documentAttributes = {
        attributes: [
          {
            key: selectedAttributeKey,
            numberValue: data.numberValue,
          },
        ],
      };
    }

    if (numberValues.length > 0 && selectedAttribute.dataType === 'NUMBER') {
      if (numberValues.length === 1) {
        documentAttributes = {
          attributes: [
            {
              key: selectedAttributeKey,
              numberValue: Number(numberValues[0]),
            },
          ],
        };
      } else {
        documentAttributes = {
          attributes: [
            {
              key: selectedAttributeKey,
              numberValues: numberValues,
            },
          ],
        };
      }
    }

    if (selectedAttribute?.dataType === 'BOOLEAN') {
      documentAttributes = {
        attributes: [
          {
            key: selectedAttributeKey,
            booleanValue: data.booleanValue,
          },
        ],
      };
    }
    if (selectedAttribute?.dataType === 'KEY_ONLY') {
      documentAttributes = {
        attributes: [
          {
            key: selectedAttributeKey,
          },
        ],
      };
    }

    DocumentsService.addDocumentAttributes(
      siteId,
      'false',
      getValue().documentId,
      documentAttributes
    ).then((res) => {
      if (res.status === 201) {
        setTimeout(() => {
          onDocumentDataChange(value);
          dispatch(
            fetchDocumentAttributes({
              siteId,
              documentId: value?.documentId as string,
            })
          );
        }, 500);
        resetValues();
      } else {
        if (res.errors) {
          dispatch(
            openNotificationDialog({
              dialogTitle: res.errors[0].error,
            })
          );
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error adding attribute',
            })
          );
        }
      }
    });
  };

  const onAddAttributeFormClose = () => {
    setIsAddAttributeFormOpen(false);
  };

  return (
    <>
      <div className="mt-2 flex justify-center items-center w-full">
        <form
          onSubmit={handleSubmit(onAddAttributeSubmit)}
          className="w-full"
          ref={addTagFormRef}
        >
          {allAttributes.length > 0 && <div className="flex items-start mx-2 mb-4 relative w-full h-8 gap-2">
            <div className="flex items-start gap-2">
              <div className="h-8 flex gap-2">
                <RadioCombobox
                  values={attributeKeys}
                  selectedValue={selectedAttributeKey}
                  setSelectedValue={setSelectedAttributeKey}
                  placeholderText="Attribute"
                />
              </div>
              {selectedAttribute && (
                <div className="text-xs bg-neutral-100 rounded-md font-bold h-8 p-2 text-center whitespace-nowrap">
                  {selectedAttribute.dataType}
                </div>
              )}
              <div className="h-8 flex gap-2 items-center">
                {selectedAttribute && selectedAttribute.dataType === 'STRING' && (
                  <div className="flex items-center h-full gap-2">
                    <input
                      type="text"
                      className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                      {...register('stringValue', {
                        required: stringValues.length === 0,
                      })}
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={addStringValue}
                      title="Add"
                      className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                    >
                      <Plus/>
                    </button>
                  </div>
                )}

                {selectedAttribute && selectedAttribute.dataType === 'NUMBER' && (
                  <div className="flex items-center h-full gap-2">
                    <input
                      type="number"
                      className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                      {...register('numberValue', {required: true})}
                      placeholder="Value"
                      step="any"
                    />
                    <button
                      type="button"
                      onClick={addNumberValue}
                      title="Add"
                      className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                    >
                      <Plus/>
                    </button>
                  </div>
                )}
                {selectedAttribute &&
                  selectedAttribute.dataType === 'BOOLEAN' && (
                    <input
                      type="checkbox"
                      className="appearance-none text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 h-4 w-4 border border-neutral-300 text-sm rounded-md "
                      {...register('booleanValue')}
                    />
                  )}
                {selectedAttribute &&
                  selectedAttribute.dataType === 'COMPOSITE_STRING' && (
                    <input
                      type="text"
                      className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                      {...register('compositeStringValue', {required: true})}
                      placeholder="Coma-separated values"
                    />
                  )}
              </div>
            </div>
            <ButtonPrimaryGradient
              type="submit"
              title="Add"
              className="h-8 mr-2"
            >
              Add
            </ButtonPrimaryGradient>
          </div>}
          <div className="flex flex-row justify-start flex-wrap gap-2 items-end ml-2">
            {stringValues.map((val: string, i: number) => (
              <div
                key={'value_' + i}
                title={val}
                className="cursor-pointer py-1 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900 bg-white"
              >
                <span className="truncate overflow-hidden max-w-64 max-w-[256px]">
                  "{val}"
                </span>
                <button
                  title="Remove Value"
                  type="button"
                  className="w-4 h-4 min-w-4 text-neutral-900"
                  onClick={() => handleRemoveStringValue(i)}
                >
                  <Close/>
                </button>
              </div>
            ))}
            {numberValues.map((val: number, i: number) => (
              <div
                key={'value_' + i}
                title={val.toString()}
                className="cursor-pointer py-1 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900 bg-white"
              >
                <span className="truncate overflow-hidden max-w-64 max-w-[256px]">
                  {val}
                </span>
                <button
                  title="Remove Value"
                  type="button"
                  className="w-4 h-4 min-w-4 text-neutral-900"
                  onClick={() => handleRemoveNumberValue(i)}
                >
                  <Close/>
                </button>
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className="flex w-full">
        {!isAddAttributeFormOpen && (
          <button
            onClick={() => {
              setIsAddAttributeFormOpen(true);
            }}
            className="text-neutral-500 font-bold hover:text-primary-500 cursor-pointer ml-2 mt-2"
          >
            {' '}
            + Create New Attribute
          </button>
        )}
        {isAddAttributeFormOpen && (
          <AddAttributeForm
            siteId={siteId}
            onDocumentDataChange={onDocumentDataChange}
            value={value}
            getValue={getValue}
            onClose={onAddAttributeFormClose}
            setSelectedAttributeKey={setSelectedAttributeKey}
          />
        )}
      </div>
    </>
  );
}

export default AddDocumentAttributeForm;
