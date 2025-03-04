import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { isUUIDv4orV5 } from '../../helpers/services/toolService';
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
  allowEdit: boolean;
}

function EditAttributeForm({
  updateAllAttributes,
  siteId,
  attribute,
  onClose,
  isViewAttributeDialogOpen,
  setIsViewAttributeDialogOpen,
  allowEdit,
}: EditAttributeFormProps) {
  const [selectedAttributeDataType, setSelectedAttributeDataType] = useState(
    attribute?.dataType
  );

  // Build default values using any existing watermark data
  const watermarkFields =
    (attribute as Record<string, AdditionalFields>)?.[
      attribute.dataType.toLowerCase()
    ] || {};
  const defaultValues = {
    key: attribute?.key || '',
    text: watermarkFields?.text || '',
    imageDocumentId: watermarkFields?.imageDocumentId || '',
    rotation: watermarkFields?.rotation ?? 0,
    scale: watermarkFields?.scale || 'BEST_FIT',
    'position.xAnchor': watermarkFields?.position?.xAnchor || 'CENTER',
    'position.yAnchor': watermarkFields?.position?.yAnchor || 'CENTER',
    'position.xOffset': watermarkFields?.position?.xOffset ?? 0,
    'position.yOffset': watermarkFields?.position?.yOffset ?? 0,
  };

  const { register, handleSubmit, reset, watch } = useForm({ defaultValues });
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);

  // Watch imageDocumentId for scale option
  const imageDocId = watch('imageDocumentId');
  const isValidImageDocId = isUUIDv4orV5(imageDocId);

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
      if (!data.text && !data.imageDocumentId) {
        dispatch(
          openNotificationDialog({
            dialogTitle:
              'Either watermark text or image document ID must be provided.',
          })
        );
        return;
      }
      if (data.imageDocumentId && !isUUIDv4orV5(data.imageDocumentId)) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Invalid image document ID.',
          })
        );
        return;
      }
      if (data.imageDocumentId) {
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
        key: data?.key,
        dataType: selectedAttributeDataType,
        type: 'STANDARD',
        ...(selectedAttributeDataType === 'WATERMARK' && {
          watermark: {
            text: data.text || '',
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
          {selectedAttributeDataType === 'WATERMARK' && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex flex-col gap-1">
                <label>Watermark Text</label>
                <textarea
                  disabled={isViewAttributeDialogOpen}
                  className="px-4 py-2 border border-neutral-300 text-sm rounded-md"
                  {...register('text')}
                  placeholder="Watermark Text"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Image Document ID</label>
                <input
                  type="text"
                  disabled={isViewAttributeDialogOpen}
                  className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                  {...register('imageDocumentId')}
                  placeholder="Image Document ID"
                />
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className={isValidImageDocId ? `italic` : ``}>
                    Rotation
                  </label>
                  <input
                    type="number"
                    disabled={isViewAttributeDialogOpen || isValidImageDocId}
                    className={`h-8 px-4 border border-neutral-300 text-sm rounded-md ${
                      isViewAttributeDialogOpen || isValidImageDocId
                        ? `bg-gray-100`
                        : ''
                    }`}
                    {...register('rotation')}
                    placeholder="Rotation"
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label>Scale</label>
                  <select
                    disabled={isViewAttributeDialogOpen || !isValidImageDocId}
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
                    disabled={isViewAttributeDialogOpen || !isValidImageDocId}
                    className="h-8 px-4 border border-neutral-300 text-xs rounded-md"
                    {...register('position.xAnchor')}
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
                    disabled={isViewAttributeDialogOpen || !isValidImageDocId}
                    className="h-8 px-4 border border-neutral-300 text-xs rounded-md"
                    {...register('position.yAnchor')}
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
                    disabled={isViewAttributeDialogOpen || !isValidImageDocId}
                    className={`h-8 px-4 border border-neutral-300 text-sm rounded-md ${
                      isViewAttributeDialogOpen || !isValidImageDocId
                        ? `bg-gray-100`
                        : ''
                    }`}
                    {...register('position.xOffset')}
                    placeholder="X Offset"
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className={!isValidImageDocId ? `italic` : ``}>
                    Y Offset
                  </label>
                  <input
                    type="number"
                    disabled={isViewAttributeDialogOpen || !isValidImageDocId}
                    className={`h-8 px-4 border border-neutral-300 text-sm rounded-md ${
                      isViewAttributeDialogOpen || !isValidImageDocId
                        ? `bg-gray-100`
                        : ''
                    }`}
                    {...register('position.yOffset')}
                    placeholder="Y Offset"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center mt-2">
            {ReservedAttributeKeys.indexOf(attribute?.key) === -1 &&
              allowEdit && (
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
        </div>
      </form>
    </div>
  );
}

export default EditAttributeForm;
