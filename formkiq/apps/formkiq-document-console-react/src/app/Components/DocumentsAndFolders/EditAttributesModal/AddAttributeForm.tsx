import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchDocumentAttributes } from '../../../Store/reducers/attributes';
import { setAllAttributesData } from '../../../Store/reducers/attributesData';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { isUUIDv4orV5 } from '../../../helpers/services/toolService';
import {
  Attribute,
  AttributeDataType,
} from '../../../helpers/types/attributes';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';

function AddAttributeForm({
  onDocumentDataChange,
  siteId,
  value,
  onClose,
  setSelectedAttributeKey,
  isAddingDocumentAttribute,
}: any) {
  const [selectedAttributeDataType, setSelectedAttributeDataType] = useState<
    AttributeDataType | ''
  >('');

  // For adding a new attribute, set static default values.
  const defaultValues = {
    key: '',
    watermarkText: '',
    imageDocumentId: '',
    rotation: 0,
    scale: 'BEST_FIT',
    'position.xAnchor': 'CENTER',
    'position.yAnchor': 'CENTER',
    'position.xOffset': 0,
    'position.yOffset': 0,
  };

  const { register, handleSubmit, reset, watch } = useForm({ defaultValues });
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);

  const imageDocId = watch('imageDocumentId');
  const isValidImageDocId = isUUIDv4orV5(imageDocId);

  const onAddAttributeSubmit = async (data: any) => {
    if (!selectedAttributeDataType) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select attribute data type.',
        })
      );
      return;
    }

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
      if (data.imageDocumentId) {
        if (!isUUIDv4orV5(data.imageDocumentId)) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Invalid image document ID format.',
            })
          );
          return;
        }
        const documentResponse = await DocumentsService.getDocumentById(
          data.imageDocumentId,
          siteId
        );
        if (documentResponse.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle:
                'Image document not found. Please provide a valid document ID.',
            })
          );
          return;
        }
      }
    }

    const newAttribute: { attribute: Attribute } = {
      attribute: {
        key: data.key,
        dataType: selectedAttributeDataType,
        type: 'STANDARD',
        ...(selectedAttributeDataType === 'WATERMARK' && {
          watermark: {
            text: data.watermarkText || '',
            imageDocumentId: data.imageDocumentId || '',
            rotation: Number(data.rotation) || 0,
            scale: data.scale || 'BEST_FIT',
            position: {
              xAnchor: data.position?.xAnchor || 'CENTER',
              yAnchor: data.position?.yAnchor || 'CENTER',
              xOffset:
                data['position.xOffset'] !== undefined
                  ? Number(data.position?.xOffset)
                  : 0,
              yOffset:
                data['position.yOffset'] !== undefined
                  ? Number(data.position?.yOffset)
                  : 0,
            },
          },
        }),
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

      if (
        selectedAttributeDataType === 'KEY_ONLY' &&
        isAddingDocumentAttribute
      ) {
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
              onDocumentDataChange(null, value);
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
          onDocumentDataChange(null, value);
          setSelectedAttributeKey(data.key);
        }, 500);
      }
    });
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

  return (
    <>
      <div className="mt-2 ml-2 pt-1 flex flex-wrap justify-center items-center w-full bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 rounded-md">
        <div className="flex w-full p-2 pl-4 font-semibold">New Attribute</div>
        <form
          onSubmit={handleSubmit(onAddAttributeSubmit)}
          className="w-full"
          ref={addTagFormRef}
        >
          <div className="flex flex-col px-2 mb-4 relative w-full">
            <div className="flex items-center gap-2">
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
            </div>
            {selectedAttributeDataType === 'WATERMARK' && (
              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  className="px-4 py-2 border border-neutral-300 text-sm rounded-md"
                  {...register('watermarkText')}
                  placeholder="Watermark Text"
                  rows={3}
                />
                <input
                  type="text"
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  {...register('imageDocumentId')}
                  placeholder="Image Document ID"
                />
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-1 w-1/2">
                    <label className={isValidImageDocId ? `italic` : ``}>
                      Rotation
                    </label>
                    <input
                      type="number"
                      className={`h-8 px-4 border border-neutral-300 text-sm rounded-md ${
                        isValidImageDocId ? `bg-gray-100` : ''
                      }`}
                      {...register('rotation')}
                      placeholder="Rotation"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-1/2">
                    <label>Scale</label>
                    <select
                      className="h-8 px-4 border border-neutral-300 text-xs rounded-md"
                      {...register('scale')}
                    >
                      <option value="BEST_FIT">BEST_FIT</option>
                      <option value="ORIGINAL" disabled={!isValidImageDocId}>
                        ORIGINAL
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-1 w-1/2">
                    <label className={!isValidImageDocId ? `italic` : ``}>
                      X Anchor
                    </label>
                    <select
                      className="h-8 px-4 border border-neutral-300 text-xs rounded-md"
                      {...register('position.xAnchor')}
                      disabled={!isValidImageDocId}
                    >
                      <option value="LEFT">LEFT</option>
                      <option value="CENTER">CENTER</option>
                      <option value="RIGHT">RIGHT</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 w-1/2">
                    <label className={!isValidImageDocId ? `italic` : ``}>
                      Y Anchor
                    </label>
                    <select
                      className="h-8 px-4 border border-neutral-300 text-xs rounded-md"
                      {...register('position.yAnchor')}
                      disabled={!isValidImageDocId}
                    >
                      <option value="TOP">TOP</option>
                      <option value="CENTER">CENTER</option>
                      <option value="BOTTOM">BOTTOM</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-1 w-1/2">
                    <label className={!isValidImageDocId ? `italic` : ``}>
                      X Offset
                    </label>
                    <input
                      type="number"
                      className={`h-8 px-4 border border-neutral-300 text-sm rounded-md ${
                        !isValidImageDocId ? `bg-gray-100` : ''
                      }`}
                      {...register('position.xOffset')}
                      placeholder="X Offset"
                      disabled={!isValidImageDocId}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-1/2">
                    <label className={!isValidImageDocId ? `italic` : ``}>
                      Y Offset
                    </label>
                    <input
                      type="number"
                      className={`h-8 px-4 border border-neutral-300 text-sm rounded-md ${
                        !isValidImageDocId ? `bg-gray-100` : ''
                      }`}
                      {...register('position.yOffset')}
                      placeholder="Y Offset"
                      disabled={!isValidImageDocId}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center mt-2">
              <ButtonPrimary type="submit" title="Create" className="mr-2">
                Create
              </ButtonPrimary>
              <ButtonGhost type="button" onClick={onClose}>
                Cancel
              </ButtonGhost>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddAttributeForm;
