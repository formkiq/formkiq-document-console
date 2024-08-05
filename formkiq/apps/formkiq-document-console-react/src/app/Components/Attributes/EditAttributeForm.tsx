import {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import {useAppDispatch} from '../../Store/store';
import {DocumentsService} from '../../helpers/services/documentsService';
import {
  Attribute,
  AttributeDataType,
} from '../../helpers/types/attributes';
import ButtonGhost from '../Generic/Buttons/ButtonGhost';
import ButtonTertiary from '../Generic/Buttons/ButtonTertiary';
import RadioListbox from '../Generic/Listboxes/RadioListbox';

function EditAttributeForm({
                             updateAllAttributes,
                             siteId,
                             attribute,
                             onClose,
                           }: any) {
  const [selectedAttributeDataType, setSelectedAttributeDataType] = useState<AttributeDataType | ''>(attribute?.dataType);

  const {
    register,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm();
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

    const newAttribute: { attribute: Attribute } = {
      attribute: {
        key: data?.key,
        dataType: selectedAttributeDataType,
        type: 'STANDARD',
      },
    };

    if (attribute?.key === data?.key) { // key has not been updated
      // delete old attribute
      DocumentsService.deleteAttribute(siteId, attribute.key).then((response) => {
        if (response.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: response.errors[0].error,
            })
          );
        } else {
          // add new attribute
          DocumentsService.addAttribute(siteId, newAttribute).then((response) => {
            if (response.status !== 200) {
              dispatch(
                openNotificationDialog({
                  dialogTitle: response.errors[0].error,
                })
              );
            } else {
              updateAllAttributes();
            }
          });
        }
      });
    } else {
      // add new attribute
      DocumentsService.addAttribute(siteId, newAttribute).then((response) => {
        if (response.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: response.errors[0].error,
            })
          );
        } else {
          // delete old attribute
          DocumentsService.deleteAttribute(siteId, attribute.key).then((response) => {
            if (response.status !== 200) {
              dispatch(
                openNotificationDialog({
                  dialogTitle: response.errors[0].error,
                })
              );
            } else {
              updateAllAttributes();
            }
          });
        }
      });
    }

    reset();
    onClose();
  };

  const attributeTypes = ['STRING', 'NUMBER', 'BOOLEAN', 'KEY_ONLY'];

  return (
    <>
      <div
        className="mt-2 ml-2 pt-1 flex flex-wrap justify-center items-center w-full bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 rounded-md">
        <div className="flex w-full p-2 pl-4 font-semibold">New Attribute Value</div>
        <form
          onSubmit={handleSubmit(onUpdateAttributeSubmit)}
          className="w-full"
          ref={addTagFormRef}
        >
          <div className="flex items-start px-2 mb-4 relative w-full h-8">
            <div className="mr-2 h-8 w-1/2">
              <input
                type="text"
                className="h-8 px-4 border border-neutral-300 w-full text-sm rounded-md"
                defaultValue={attribute?.key}
                {...register('key', {required: true})}
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

            <ButtonTertiary type="submit" title="Update" className="mr-2">
              Update
            </ButtonTertiary>

            <ButtonGhost type="button" onClick={onClose}> Cancel </ButtonGhost>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditAttributeForm;
