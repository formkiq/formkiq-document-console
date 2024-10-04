import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Close, Pencil, Settings } from '../../Components/Icons/icons';
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
  const [selectedStatus, setSelectedStatus] = useState<
    'ACTIVE' | 'INACTIVE' | ''
  >('');
  const [siteGroups, setSiteGroups] = useState<string[]>([]);
  const [siteTitle, setSiteTitle] = useState<string>('');
  const [isEditingSiteTitle, setIsEditingSiteTitle] = useState<boolean>(false);
  const [sites, setSites] = useState<any[]>([]);

  function updateSites() {
    DocumentsService.getSites().then((res) => {
      if (res.status === 200) setSites(res.sites);
    });
  }

  useEffect(() => {
    dispatch(fetchGroups({ limit: 60 }));
    updateSites();
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

  function saveSiteGroupPermissions() {
    if (!editingSiteId || !selectedGroupName) {
      return;
    }
    DocumentsService.setSiteGroupPermissions(editingSiteId, selectedGroupName, {
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
  }

  function saveSiteTitle() {
    if (!editingSiteId || !siteTitle) {
      return;
    }
    DocumentsService.updateSite(editingSiteId, {
      site: { title: siteTitle },
    }).then((res) => {
      if (res.status === 200) {
        setIsEditingSiteTitle(false);
        setSiteTitle('');
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
  }

  console.log(sites);
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
              {sites.length > 0 ? (
                sites.map(
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
                          {editingSiteId === site.siteId &&
                          isEditingSiteTitle ? (
                            <div className="flex gap-2 items-end h-10">
                              <input
                                type="text"
                                className="w-full max-w-[250px] h-10 mt-4 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                value={siteTitle}
                              />
                              <ButtonTertiary
                                onClick={() => setIsEditingSiteTitle(false)}
                              >
                                Cancel
                              </ButtonTertiary>
                              <ButtonPrimaryGradient onClick={saveSiteTitle}>
                                Save
                              </ButtonPrimaryGradient>
                            </div>
                          ) : (
                            <h1 className="text-lg font-bold">
                              {site.title}{' '}
                              {editingSiteId === site.siteId && (
                                <button
                                  onClick={() => {
                                    setIsEditingSiteTitle(true);
                                    setSiteTitle(site.title);
                                  }}
                                  className="text-neutral-500 underline hover:text-primary-500 w-4 h-4"
                                  title="Edit Site Name"
                                >
                                  <Pencil />
                                </button>
                              )}
                            </h1>
                          )}

                          <span className="text-xs text-neutral-500 font-bold">
                            (siteId: {site.siteId})
                          </span>
                        </div>
                        {!editingSiteId && (
                          <button
                            className="w-6 h-6 text-neutral-500 hover:text-neutral-900"
                            onClick={() => setEditingSiteId(site.siteId)}
                            title="Edit Site Permissions"
                          >
                            <Settings />
                          </button>
                        )}
                        {editingSiteId === site.siteId && (
                          <button
                            className="w-6 h-6 text-neutral-500 hover:text-neutral-900"
                            onClick={() => setEditingSiteId(null)}
                            title="Cancel Editing"
                          >
                            <Close />
                          </button>
                        )}
                      </div>
                      {editingSiteId === site.siteId && (
                        <>
                          <h1 className="font-bold text-lg">Status</h1>
                          <div className="flex gap-2 items-end h-10">
                            <div className="w-1/2 max-w-[250px] h-10 mt-4">
                              <RadioListbox
                                selectedValue={selectedStatus}
                                setSelectedValue={setSelectedStatus}
                                values={['ACTIVE', 'INACTIVE']}
                                titles={['Active', 'Inactive']}
                                placeholderText="Status"
                              />
                            </div>
                            <ButtonTertiary
                              onClick={() => setIsEditingSiteTitle(false)}
                            >
                              Cancel
                            </ButtonTertiary>
                            <ButtonPrimaryGradient onClick={saveSiteTitle}>
                              Save
                            </ButtonPrimaryGradient>
                          </div>
                          <h1 className="font-bold text-lg">Site Groups</h1>
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
                                <ButtonTertiary
                                  onClick={() => setSelectedGroupName('')}
                                >
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
                )
              ) : (
                <h3 className="text-center">There are no sites created yet.</h3>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SitesManagement;
