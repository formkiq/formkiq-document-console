import RadioListbox from "../../Generic/Listboxes/RadioListbox";
import {useRef, useState} from "react";
import {Attribute, AttributeDataType, AttributeType} from "../../../helpers/types/attributes";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";
import {DocumentsService} from "../../../helpers/services/documentsService";
import {useForm} from "react-hook-form";
import {useAppDispatch} from "../../../Store/store";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";

function AddAttributeForm({onDocumentDataChange, siteId, value, onClose}: any) {
  const [selectedAttributeDataType, setSelectedAttributeDataType] = useState<AttributeDataType | "">("")
  const [selectedAttributeType, setSelectedAttributeType] = useState<AttributeType | "">("")

  const {
    register,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm();
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);

  const onAddAttributeSubmit = async (data: any) => {

    if (!selectedAttributeDataType || !selectedAttributeType) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select attribute data type and attribute type',
        })
      );
      return;
    }

    const newAttribute: { attribute: Attribute } = {
      attribute: {
        key: data.key,
        dataType: selectedAttributeDataType,
        type: selectedAttributeType
      }
    }

    DocumentsService.addAttribute(siteId, newAttribute).then(
      (response) => {
        if (response.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Failed to add attribute',
            })
          );
          return;
        }
        onDocumentDataChange(value);
      })
    reset();
    onClose();
  };

  const attributeTypes = ["STRING", "NUMBER", "BOOLEAN", "KEY_ONLY", "COMPOSITE_STRING"];
  const types = ["STANDARD", "OPA"];

  return (
    <>
      <div className="mt-2 flex justify-center items-center w-full">
        <form
          onSubmit={handleSubmit(onAddAttributeSubmit)}
          className="w-full"
          ref={addTagFormRef}
        >
          <div className="flex items-start mx-2 mb-4 relative w-full h-8">
            <div className="mr-2 h-8">
              <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                     {...register('key', {required: true})}
                     placeholder="Key"/>
            </div>

            <div className="mr-2 h-8">
              <RadioListbox values={attributeTypes}
                            titles={attributeTypes}
                            selectedValue={selectedAttributeDataType}
                            setSelectedValue={setSelectedAttributeDataType}
                            placeholderText="Select Data Type"
              />
            </div>

            <div className="mr-2 h-8">
              <RadioListbox values={types}
                            titles={types}
                            selectedValue={selectedAttributeType}
                            setSelectedValue={setSelectedAttributeType}
                            placeholderText="Select Type"
              />
            </div>

            <ButtonPrimaryGradient
              type="submit"
              title="Create"
              className="mr-2">Create</ButtonPrimaryGradient>

            <ButtonGhost onClick={onClose}> Cancel </ButtonGhost>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddAttributeForm;
