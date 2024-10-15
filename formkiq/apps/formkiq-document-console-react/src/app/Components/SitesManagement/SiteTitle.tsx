import { useEffect, useState } from 'react';
import { Pencil } from '../Icons/icons';
import { DocumentsService } from '../../helpers/services/documentsService';
import ButtonTertiary from '../../Components/Generic/Buttons/ButtonTertiary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';

interface SiteTitleEditorProps {
  siteId: string;
  currentTitle: string;
  isEditingSite: boolean;
  onSitesChange: () => void;
  formkiqVersion: any;
}

export const SiteTitle: React.FC<SiteTitleEditorProps> = ({
  siteId,
  currentTitle,
  isEditingSite,
  onSitesChange,
  formkiqVersion,
}) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  const handleSave = () => {
    if (!title) return;

    DocumentsService.updateSite(siteId, {
      site: { title },
    }).then((res) => {
      if (res.status === 200) {
        onSitesChange();
        setIsEditing(false);
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Site title has been saved.',
          })
        );
      } else {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error. Site title has not been saved.',
          })
        );
      }
    });
  };

  useEffect(() => {
    setIsEditing(false);
  }, [siteId, isEditingSite]);

  return (
    <div className="flex flex-col">
      {isEditing &&
      isEditingSite &&
      formkiqVersion.modules?.includes('site_permissions_defined') ? (
        <div className="flex gap-2 items-end h-10">
          <input
            type="text"
            className="w-full max-w-[250px] h-10 mt-4 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ButtonTertiary onClick={() => setIsEditing(false)}>
            Cancel
          </ButtonTertiary>
          <ButtonPrimaryGradient onClick={handleSave}>
            Save
          </ButtonPrimaryGradient>
        </div>
      ) : (
        <h1 className="text-lg font-bold">
          {currentTitle}{' '}
          {isEditingSite &&
            formkiqVersion.modules?.includes('site_permissions_defined') && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-neutral-500 underline hover:text-primary-500 w-4 h-4"
                title="Edit Site Name"
              >
                <Pencil />
              </button>
            )}
        </h1>
      )}
      <span className="text-xs text-neutral-500 font-bold">
        (siteId: {siteId})
      </span>
    </div>
  );
};
