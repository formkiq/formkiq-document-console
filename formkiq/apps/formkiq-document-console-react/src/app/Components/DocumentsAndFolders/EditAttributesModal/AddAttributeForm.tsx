import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchDocumentAttributes } from '../../../Store/reducers/attributes';
import { setAllAttributesData } from '../../../Store/reducers/attributesData';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import {
  Attribute,
  AttributeDataType,
} from '../../../helpers/types/attributes';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonTertiary from '../../Generic/Buttons/ButtonTertiary';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';

function AddAttributeForm({
  onDocumentDataChange,
  siteId,
  value,
  onClose,
  setSelectedAttributeKey,
}: any) {
  const [selectedAttributeDataType, setSelectedAttributeDataType] = useState<
    AttributeDataType | ''
  >('');

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);

  const onAddAttributeSubmit = async (data: any) => {
    if (!selectedAttributeDataType) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select attribute data type.',
        })
      );
      return;
    }

    const newAttribute: { attribute: Attribute } = {
      attribute: {
        key: data.key,
        dataType: selectedAttributeDataType,
        type: 'STANDARD',
      },
    };

    DocumentsService.addAttribute(siteId, newAttribute).then((response) => {
      if (response.status !== 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: response.errors[0].error,
          })
        );
        return;
      }

      // update allAttributes
      DocumentsService.getAttributes(siteId).then((response) => {
        if (response.status === 200) {
          const allAttributeData = {
            allAttributes: response?.attributes,
            attributesLastRefreshed: new Date(),
            attributesSiteId: siteId,
          };
          dispatch(setAllAttributesData(allAttributeData));
        }
      });

      if (selectedAttributeDataType === 'KEY_ONLY') {
        setTimeout(() => {
          const documentAttributes = {
            attributes: [
              {
                key: data.key,
              },
            ],
          };
          DocumentsService.addDocumentAttributes(
            siteId,
            'false',
            value?.documentId as string,
            documentAttributes
          ).then((response) => {
            if (response.status !== 201 && response.status !== 200) {
              dispatch(
                openNotificationDialog({
                  dialogTitle: response.errors[0].error,
                })
              );
            } else {
              onDocumentDataChange(value);
              dispatch(
                fetchDocumentAttributes({
                  siteId,
                  documentId: value?.documentId as string,
                  limit: 50,
                })
              );
            }
          });
        }, 500);
      } else {
        setTimeout(() => {
          onDocumentDataChange(value);
          setSelectedAttributeKey(data.key);
        }, 500);
      }
    });
    reset();
    onClose();
  };

  const attributeTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'KEY_ONLY'];

  return (
    <>
      <div className="mt-2 ml-2 pt-1 flex flex-wrap justify-center items-center w-full bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 rounded-md">
        <div className="flex w-full p-2 pl-4 font-semibold">New Attribute</div>
        <form
          onSubmit={handleSubmit(onAddAttributeSubmit)}
          className="w-full"
          ref={addTagFormRef}
        >
          <div className="flex items-start px-2 mb-4 relative w-full h-8">
            <div className="mr-2 h-8 w-1/2">
              <input
                type="text"
                className="h-8 px-4 border border-neutral-300 w-full text-sm rounded-md"
                {...register('key', { required: true })}
                placeholder="Key"
              />
            </div>

            <div className="mr-2 h-8 w-52">
              <RadioListbox
                values={attributeTypes}
                titles={attributeTypes}
                selectedValue={selectedAttributeDataType}
                setSelectedValue={setSelectedAttributeDataType}
                placeholderText="Data Type"
              />
            </div>

            <ButtonTertiary type="submit" title="Create" className="mr-2">
              Create
            </ButtonTertiary>

            <ButtonGhost type="button" onClick={onClose}> Cancel </ButtonGhost>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddAttributeForm;
