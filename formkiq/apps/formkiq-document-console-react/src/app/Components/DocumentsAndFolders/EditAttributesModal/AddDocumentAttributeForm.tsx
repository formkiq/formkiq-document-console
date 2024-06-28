import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { fetchDocumentAttributes } from '../../../Store/reducers/attributes';
import { DataCacheState } from '../../../Store/reducers/data';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Attribute } from '../../../helpers/types/attributes';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import AddAttributeForm from './AddAttributeForm';

function AddDocumentAttributeForm({
  onDocumentDataChange,
  siteId,
  value,
  getValue,
}: any) {
  const { allAttributes } = useSelector(DataCacheState);
  const [attributeKeys, setAttributeKeys] = useState<
    { key: string; title: string }[]
  >([]);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>('');
  const [isAddAttributeFormOpen, setIsAddAttributeFormOpen] =
    useState<boolean>(false);

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
  }, [selectedAttributeKey]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);

  const resetValues = () => {
    setSelectedAttribute(null);
    setSelectedAttributeKey('');
    reset();
  };
  const onAddAttributeSubmit = async (data: any) => {
    let documentAttributes = {};
    if (data.stringValue) {
      if (data.stringValue.indexOf('/') > -1) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Attributes cannot contain forward slashes.',
          })
        );
        return;
      }
      documentAttributes = {
        attributes: [
          {
            key: selectedAttributeKey,
            stringValue: data.stringValue,
          },
        ],
      };
    }

    if (data.numberValue) {
      documentAttributes = {
        attributes: [
          {
            key: selectedAttributeKey,
            numberValue: data.numberValue,
          },
        ],
      };
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
        dispatch(
          openNotificationDialog({
            dialogTitle: res.errors[0].error,
          })
        );
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
          <div className="flex items-start mx-2 mb-4 relative w-full h-8">
            <div className="flex items-start">
              <div className="mr-2 h-8">
                <RadioCombobox
                  values={attributeKeys}
                  selectedValue={selectedAttributeKey}
                  setSelectedValue={setSelectedAttributeKey}
                  placeholderText="Attribute"
                />
                {selectedAttribute && selectedAttribute.dataType && (
                  <h6 className="text-xs absolute top-8 left-0 whitespace-nowrap">
                    <span className="font-bold">Data type: </span>
                    {selectedAttribute.dataType}
                  </h6>
                )}
              </div>
              <div className="mr-2 h-8">
                {selectedAttribute &&
                  selectedAttribute.dataType === 'STRING' && (
                    <input
                      type="text"
                      className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                      {...register('stringValue', { required: true })}
                      placeholder="Value"
                    />
                  )}
                {selectedAttribute &&
                  selectedAttribute.dataType === 'NUMBER' && (
                    <input
                      type="number"
                      className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                      {...register('numberValue', { required: true })}
                      placeholder="Value"
                    />
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
                      {...register('compositeStringValue', { required: true })}
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
