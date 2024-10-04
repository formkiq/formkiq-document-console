import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Settings } from '../../Components/Icons/icons';
import { DocumentsService } from '../../helpers/services/documentsService';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  fetchGroups,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { useAppDispatch } from '../../Store/store';
import RadioListbox from '../../Components/Generic/Listboxes/RadioListbox';
import ButtonTertiary from '../../Components/Generic/Buttons/ButtonTertiary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';

type SiteGroupPermissions = 'ADMIN' | 'DELETE' | 'READ' | 'WRITE' | 'GOVERN';

interface PermissionCheckboxProps {
  permission: SiteGroupPermissions;
  checked: boolean;
  onChange: (permission: SiteGroupPermissions, checked: boolean) => void;
}

const PermissionCheckbox = ({
  permission,
  checked,
  onChange,
}: PermissionCheckboxProps) => (
  <input
    type="checkbox"
    className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
    checked={checked}
    onChange={(e) => onChange(permission, e.target.checked)}
  />
);

function SitesManagement() {
  const { groups } = useSelector(UserManagementState);
  const { user } = useAuthenticatedState();
  const dispatch = useAppDispatch();

  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<
    SiteGroupPermissions[]
  >([]);
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [siteGroups, setSiteGroups] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchGroups({ limit: 60 }));
  }, []);

  const handlePermissionChange = (
    permission: SiteGroupPermissions,
    checked: boolean
  ) => {
    if (checked) {
      setEditingPermissions([...editingPermissions, permission]);
    } else {
      setEditingPermissions(editingPermissions.filter((p) => p !== permission));
    }
  };

  const permissions: SiteGroupPermissions[] = [
    'ADMIN',
    'DELETE',
    'READ',
    'WRITE',
    'GOVERN',
  ];

  useEffect(() => {
    if (selectedGroupName === '' || !editingSiteId) {
      setEditingPermissions([]);
      return;
    }
    DocumentsService.getSiteGroupPermissions(
      editingSiteId,
      selectedGroupName
    ).then((res) => {
      if (res.group) {
        setEditingPermissions(res.group.permissions);
      }
    });
  }, [selectedGroupName, editingSiteId]);

  useEffect(() => {
    setSelectedGroupName('');
    if (!editingSiteId) {
      setSiteGroups([]);
      return;
    }
    DocumentsService.getSiteGroups(editingSiteId).then((res) => {
      if (res.groupNames) {
        setSiteGroups(res.groupNames);
      }
    });
  }, [editingSiteId]);

  function cancelSiteEditing() {
    setEditingSiteId(null);
  }

  function saveSiteGroupPermissions() {
    if (!editingSiteId || !selectedGroupName) {
      return;
    }
    DocumentsService.setSiteGroupPermissions(editingSiteId, selectedGroupName, {
      permissions: editingPermissions,
    }).then((res) => {
      if (res.status === 200) {
        setEditingSiteId(null);
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
  }

  return (
    <>
      <Helmet>
        <title>Sites Management</title>
      </Helmet>
      <div
        className="flex flex-row "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="flex-1 inline-block h-full">
          <div className=" flex flex-col w-full h-full px-6 mt-6">
            <h1 className="text-xl font-bold">Sites Management</h1>
            <ul className="flex flex-col gap-4 mt-4">
              {user.sites.length > 0 &&
                user.sites.map(
                  (site: {
                    title: string;
                    siteId: string;
                    permissions: string[];
                  }) => (
                    <li
                      className="border border-gray-200 rounded-lg p-4"
                      key={site.siteId}
                    >
                      <div className="flex flex-row gap-8 justify-between items-center">
                        <div className="flex flex-col">
                          <h1 className="text-lg font-bold">{site.title}</h1>
                          <span className="text-xs text-gray-500 font-bold">
                            (siteId: {site.siteId})
                          </span>
                        </div>
                        {!editingSiteId && (
                          <button
                            className="w-6 h-6 text-neutral-500 hover:text-neutral-900"
                            onClick={() => setEditingSiteId(site.siteId)}
                          >
                            <Settings />
                          </button>
                        )}
                      </div>
                      {editingSiteId === site.siteId && (
                        <>
                          <div className="w-1/2 max-w-[250px] h-10 mt-4">
                            <RadioListbox
                              selectedValue={selectedGroupName}
                              setSelectedValue={setSelectedGroupName}
                              values={siteGroups}
                              titles={siteGroups}
                              placeholderText="Select a group"
                            />
                          </div>
                          {selectedGroupName !== '' && (
                            <div className="flex flex-col gap-2 mt-4">
                              {permissions.map((permission) => (
                                <label
                                  key={permission}
                                  className="flex items-center gap-2"
                                >
                                  <PermissionCheckbox
                                    permission={permission}
                                    checked={editingPermissions.includes(
                                      permission
                                    )}
                                    onChange={handlePermissionChange}
                                  />
                                  <span>{permission}</span>
                                </label>
                              ))}
                              <div className="flex justify-end h-10 gap-2">
                                <ButtonTertiary onClick={cancelSiteEditing}>
                                  Cancel
                                </ButtonTertiary>
                                <ButtonPrimaryGradient
                                  onClick={saveSiteGroupPermissions}
                                >
                                  Save
                                </ButtonPrimaryGradient>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  )
                )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SitesManagement;
