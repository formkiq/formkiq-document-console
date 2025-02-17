import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import ButtonGhost from '../Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../Generic/Buttons/ButtonPrimary';
import RadioListbox from '../Generic/Listboxes/RadioListbox';

import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';

import { ReservedAttributeKeys } from '../../helpers/constants/attributes';
import { DocumentsService } from '../../helpers/services/documentsService';
import { AdditionalFields, Attribute } from '../../helpers/types/attributes';

interface EditAttributeFormProps {
  onClose: any;
  siteId: string;
  updateAllAttributes: any;
  attribute: Attribute;
  isViewAttributeDialogOpen: boolean;
  setIsViewAttributeDialogOpen: (isOpen: boolean) => void;
}

function EditAttributeForm({
  updateAllAttributes,
  siteId,
  attribute,
  onClose,
  isViewAttributeDialogOpen,
  setIsViewAttributeDialogOpen,
}: EditAttributeFormProps) {
  const [selectedAttributeDataType, setSelectedAttributeDataType] = useState(
    attribute?.dataType
  );

  const { register, handleSubmit, reset } = useForm();
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);

  const onUpdateAttributeSubmit = async (data: any) => {
    if (!selectedAttributeDataType) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select attribute data type.',
        })
      );
      return;
    }

    // Validate WATERMARK: ensure at least one watermark field is provided.
    if (selectedAttributeDataType === 'WATERMARK') {
      if (!data.watermarkText && !data.imageDocumentId) {
        dispatch(
          openNotificationDialog({
            dialogTitle:
              'Either watermark text or image document ID must be provided.',
          })
        );
        return;
      }
    }

    // Build the updated attribute object, including watermark values if applicable.
    const newAttribute: { attribute: Attribute } = {
      attribute: {
        key: data?.key,
        dataType: selectedAttributeDataType,
        type: 'STANDARD',
        ...(selectedAttributeDataType === 'WATERMARK' && {
          watermark: {
            text: data.watermarkText || '',
            imageDocumentId: data.imageDocumentId || '',
          },
        }),
      },
    };

    // If the key is unchanged, delete the old attribute then add the updated version.
    if (attribute?.key === data?.key) {
      DocumentsService.deleteAttribute(siteId, attribute.key).then(
        (response) => {
          if (response.status !== 200) {
            dispatch(
              openNotificationDialog({
                dialogTitle: response.errors[0].error,
              })
            );
          } else {
            DocumentsService.addAttribute(siteId, newAttribute).then(
              (response) => {
                if (response.status !== 200) {
                  dispatch(
                    openNotificationDialog({
                      dialogTitle: response.errors[0].error,
                    })
                  );
                } else {
                  updateAllAttributes();
                }
              }
            );
          }
        }
      );
    } else {
      // If the key has been updated, add the new attribute then delete the old one.
      DocumentsService.addAttribute(siteId, newAttribute).then((response) => {
        if (response.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: response.errors[0].error,
            })
          );
        } else {
          DocumentsService.deleteAttribute(siteId, attribute.key).then(
            (response) => {
              if (response.status !== 200) {
                dispatch(
                  openNotificationDialog({
                    dialogTitle: response.errors[0].error,
                  })
                );
              } else {
                updateAllAttributes();
              }
            }
          );
        }
      });
    }

    reset();
    onClose();
  };

  const attributeTypes = [
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'KEY_ONLY',
    'WATERMARK',
  ];

  const attributeAdditionalFieldsValues = (
    attribute as Record<string, AdditionalFields>
  )?.[attribute.key.toLowerCase()];

  return (
    <div className="mt-2 ml-2 pt-1 flex flex-col justify-center items-center w-full bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 rounded-md">
      <div className="flex w-full p-2 pl-4 font-semibold">
        {isViewAttributeDialogOpen ? `View Attribute` : `Edit Attribute`}
      </div>
      <form
        onSubmit={handleSubmit(onUpdateAttributeSubmit)}
        className="w-full"
        ref={addTagFormRef}
      >
        <div className="flex flex-col px-2 mb-4 relative w-full">
          <div className="flex items-center gap-2">
            <div className="mr-2 h-8 w-1/2">
              <input
                disabled={isViewAttributeDialogOpen}
                type="text"
                className="h-8 px-4 border border-neutral-300 w-full text-sm rounded-md"
                defaultValue={attribute?.key}
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
                disabled={isViewAttributeDialogOpen}
                placeholderText="Data Type"
              />
            </div>
          </div>

          {attributeAdditionalFieldsValues?.text &&
            attributeAdditionalFieldsValues?.imageDocumentId && (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  {...register('text')}
                  defaultValue={attributeAdditionalFieldsValues?.text}
                  placeholder="Watermark Text"
                />
                <input
                  type="text"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  {...register('imageDocumentId')}
                  defaultValue={
                    attributeAdditionalFieldsValues?.imageDocumentId
                  }
                  placeholder="Image Document ID"
                />
              </div>
            )}

          {attribute ? (
            <div className="flex items-center mt-2">
              {ReservedAttributeKeys.indexOf(attribute?.key) === -1 && (
                <>
                  {isViewAttributeDialogOpen ? (
                    <div>
                      <ButtonPrimary
                        type="button"
                        onClick={() => setIsViewAttributeDialogOpen(false)}
                        title="Edit Attribute"
                        className="mr-2"
                      >
                        Edit Attribute {attribute.key}
                      </ButtonPrimary>
                    </div>
                  ) : (
                    <ButtonPrimary
                      type="submit"
                      title="Update"
                      className="mr-2"
                    >
                      Update
                    </ButtonPrimary>
                  )}
                </>
              )}

              <ButtonGhost type="button" onClick={onClose}>
                {isViewAttributeDialogOpen ? (
                  <span>Close</span>
                ) : (
                  <span>Cancel</span>
                )}
              </ButtonGhost>
            </div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditAttributeForm;
