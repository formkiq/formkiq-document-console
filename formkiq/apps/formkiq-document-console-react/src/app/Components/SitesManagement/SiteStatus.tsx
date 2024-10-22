import { useState } from 'react';
import { DocumentsService } from '../../helpers/services/documentsService';
import RadioListbox from '../../Components/Generic/Listboxes/RadioListbox';
import ButtonTertiary from '../../Components/Generic/Buttons/ButtonTertiary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';

type SiteStatusType = 'ACTIVE' | 'INACTIVE' | '';

export const SiteStatus = ({ siteId }:{siteId: string}) => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<SiteStatusType>('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!selectedStatus) return;

    DocumentsService.updateSite(siteId, {
      site: { status: selectedStatus },
    }).then((res) => {
      if (res.status === 200) {
        setIsEditing(false);
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Site status has been saved.',
          })
        );
      } else {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error. Site status has not been saved.',
          })
        );
      }
    });
  };

  return (
    <div className="mt-4">
      <h1 className="font-bold text-lg">Status</h1>
      <div className="flex gap-2 items-end h-10">
        <div className="w-1/2 max-w-[250px] h-10 mt-4">
          <RadioListbox
            selectedValue={selectedStatus}
            setSelectedValue={(value: 'ACTIVE' | 'INACTIVE') => {
              setSelectedStatus(value);
              setIsEditing(true);
            }}
            values={['ACTIVE', 'INACTIVE']}
            titles={['Active', 'Inactive']}
            placeholderText="Status"
          />
        </div>
        {isEditing && (
          <>
            <ButtonTertiary
              onClick={() => {
                setSelectedStatus('');
                setIsEditing(false);
              }}
            >
              Cancel
            </ButtonTertiary>
            <ButtonPrimaryGradient onClick={handleSave}>
              Save
            </ButtonPrimaryGradient>
          </>
        )}
      </div>
    </div>
  );
};
