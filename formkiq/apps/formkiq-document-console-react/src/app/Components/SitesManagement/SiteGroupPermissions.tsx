import { useEffect, useState } from 'react';
import { DocumentsService } from '../../helpers/services/documentsService';
import RadioListbox from '../../Components/Generic/Listboxes/RadioListbox';
import ButtonTertiary from '../../Components/Generic/Buttons/ButtonTertiary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { Link } from 'react-router-dom';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import { Trash } from '../Icons/icons';

type SiteGroupPermissionsType =
  | 'ADMIN'
  | 'DELETE'
  | 'READ'
  | 'WRITE'
  | 'GOVERN';

interface SiteGroupPermissionsEditorProps {
  siteId: string;
  groups: any[];
  siteGroups: string[];
}

interface PermissionCheckboxProps {
  permission: SiteGroupPermissionsType;
  checked: boolean;
  onChange: (permission: SiteGroupPermissionsType, checked: boolean) => void;
}

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  permission,
  checked,
  onChange,
}) => (
  <input
    type="checkbox"
    className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
    checked={checked}
    onChange={(e) => onChange(permission, e.target.checked)}
  />
);

export const SiteGroupPermissions: React.FC<
  SiteGroupPermissionsEditorProps
> = ({ siteId, groups, siteGroups }) => {
  const dispatch = useAppDispatch();
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [editingPermissions, setEditingPermissions] = useState<
    SiteGroupPermissionsType[]
  >([]);
  const [newGroupEditingSitePermissions, setNewGroupEditingSitePermissions] =
    useState<SiteGroupPermissionsType[]>([]);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [isAddingNewGroupPermissions, setIsAddingNewGroupPermissions] =
    useState(false);
  const [selectedNewGroupName, setSelectedNewGroupName] = useState('');

  const permissions: SiteGroupPermissionsType[] = [
    'ADMIN',
    'DELETE',
    'READ',
    'WRITE',
    'GOVERN',
  ];

  useEffect(() => {
    const unassignedGroups = groups.filter(
      (group) => !siteGroups.includes(group.name)
    );
    setGroupNames(unassignedGroups.map((group) => group.name));
  }, []);

  // Reset permissions when selected group changes
  useEffect(() => {
    if (selectedGroupName === '') {
      setEditingPermissions([]);
      return;
    }

    // Fetch permissions for the selected group
    DocumentsService.getSiteGroupPermissions(siteId, selectedGroupName)
      .then((res) => {
        if (res.group) {
          setEditingPermissions(res.group.permissions);
        }
      })
      .catch((error) => {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error fetching group permissions.',
          })
        );
      });
  }, [selectedGroupName, siteId]);

  const handlePermissionChange = (
    permission: SiteGroupPermissionsType,
    checked: boolean
  ) => {
    if (checked) {
      setEditingPermissions([...editingPermissions, permission]);
    } else {
      setEditingPermissions(editingPermissions.filter((p) => p !== permission));
    }
  };

  const handleNewGroupPermissionChange = (
    permission: SiteGroupPermissionsType,
    checked: boolean
  ) => {
    if (checked) {
      setNewGroupEditingSitePermissions([
        ...newGroupEditingSitePermissions,
        permission,
      ]);
    } else {
      setNewGroupEditingSitePermissions(
        newGroupEditingSitePermissions.filter((p) => p !== permission)
      );
    }
  };

  const handleAddNewGroup = () => {
    setIsAddingNewGroupPermissions(true);
    setNewGroupEditingSitePermissions([]);
    setSelectedNewGroupName('');
  };

  const handleSaveGroupPermissions = (groupName: string) => {
    if (!groupName) return;

    DocumentsService.setSiteGroupPermissions(siteId, groupName, {
      permissions: editingPermissions,
    }).then((res) => {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Site group permissions have been saved.',
          })
        );
      } else {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error. Site group permissions have not been saved.',
          })
        );
      }
    });
  };

  const deleteGroupPermissions = (groupName: string) => {
    DocumentsService.setSiteGroupPermissions(siteId, groupName, {
      permissions: [],
    }).then((res) => {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Site group permissions have been deleted.',
          })
        );
      } else {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Error. Site group permissions have not been deleted.',
          })
        );
      }
    });
  };
  return (
    <div className="mt-4">
      <h1 className="font-bold text-lg">Site Groups</h1>
      {siteGroups.length === 0 ? (
        <h3 className="text-center">
          No group permissions are currently assigned to this site.
        </h3>
      ) : (
        <div className="flex gap-4 items-center">
          <div className="w-1/2 max-w-[250px] h-10">
            <RadioListbox
              selectedValue={selectedGroupName}
              setSelectedValue={setSelectedGroupName}
              values={siteGroups}
              titles={siteGroups}
              placeholderText="Select a group"
            />
          </div>
          {selectedGroupName !== '' && (
            <button
              className="w-5 h-5 text-neutral-500 hover:text-red-500"
              onClick={() => deleteGroupPermissions(selectedGroupName)}
              title="Delete Group Permissions"
            >
              <Trash />
            </button>
          )}
        </div>
      )}
      {selectedGroupName !== '' && (
        <div className="flex gap-4 items-end">
          <div className="w-[250px]">
            <h3 className=" font-bold text-md text-neutral-500 mt-4">
              Group permissions
            </h3>
            <div className="flex flex-col gap-2 my-2 pl-4">
              {permissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2">
                  <PermissionCheckbox
                    permission={permission}
                    checked={editingPermissions.includes(permission)}
                    onChange={handlePermissionChange}
                  />
                  <span>{permission}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-start h-8 gap-2">
            <ButtonTertiary onClick={() => setSelectedGroupName('')}>
              Cancel
            </ButtonTertiary>
            <ButtonPrimaryGradient
              onClick={() => handleSaveGroupPermissions(selectedGroupName)}
            >
              Save
            </ButtonPrimaryGradient>
          </div>
        </div>
      )}

      {isAddingNewGroupPermissions ? (
        <>
          {groupNames.length === 0 ? (
            <h3 className="text-center">
              There are no groups to add. To create a new group, please go to{' '}
              <Link
                to="/admin/groups"
                className="text-primary-500 underline hover:text-primary-600 font-bold"
              >
                Groups
              </Link>{' '}
              page
            </h3>
          ) : (
            <>
              <h3 className=" font-bold text-md text-neutral-500 mt-4">
                Adding a new group permissions to the site
              </h3>
              <div className="w-1/2 max-w-[250px] h-10">
                <RadioListbox
                  values={groupNames}
                  titles={groupNames}
                  selectedValue={selectedNewGroupName}
                  setSelectedValue={setSelectedNewGroupName}
                  placeholderText="Select a group to add"
                />
              </div>
              {selectedNewGroupName && (
                <div className="flex gap-4 items-end">
                  <div className="w-[250px]">
                    <h3 className=" font-bold text-md text-neutral-500 mt-4">
                      Group permissions
                    </h3>
                    <div className="flex flex-col gap-2 my-2 pl-4">
                      {permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2"
                        >
                          <PermissionCheckbox
                            permission={permission}
                            checked={newGroupEditingSitePermissions.includes(
                              permission
                            )}
                            onChange={handleNewGroupPermissionChange}
                          />
                          <span>{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end h-10 gap-2">
                    <ButtonTertiary onClick={() => setSelectedNewGroupName('')}>
                      Cancel
                    </ButtonTertiary>
                    <ButtonPrimaryGradient
                      onClick={() =>
                        handleSaveGroupPermissions(selectedNewGroupName)
                      }
                    >
                      Save
                    </ButtonPrimaryGradient>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <button
          className="text-neutral-500 underline hover:text-primary-500 mt-4"
          onClick={handleAddNewGroup}
        >
          + Add new site group permissions
        </button>
      )}
    </div>
  );
};
