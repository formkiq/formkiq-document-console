import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import RadioListbox from '../../Components/Generic/Listboxes/RadioListbox';
import { Spinner } from '../../Components/Icons/icons';
import CreateSiteModal from '../../Components/SitesManagement/CreateSiteModal';
import { SiteListItem } from '../../Components/SitesManagement/SiteListItem';
import { DocumentsService } from '../../helpers/services/documentsService';
import { login, useAuthenticatedState } from '../../Store/reducers/auth';
import { ConfigState } from '../../Store/reducers/config';
import {
  fetchGroups,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { useAppDispatch } from '../../Store/store';

function SitesManagement() {
  const { user } = useAuthenticatedState();
  const { groups } = useSelector(UserManagementState);
  const { formkiqVersion } = useSelector(ConfigState);
  const dispatch = useAppDispatch();

  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [isCreateSiteModalOpen, setIsCreateSiteModalOpen] = useState(false);
  const [isSitesLoading, setIsSitesLoading] = useState(true);
  const [sitesStatus, setSitesStatus] = useState<'ACTIVE' | 'INACTIVE'>(
    'ACTIVE'
  );

  const statusValues = ['ACTIVE', 'INACTIVE'];
  const statusTitles = ['Active Sites', 'Inactive Sites'];

  function updateUserSites() {
    console.log('updateUserSites', sitesStatus);
    setIsSitesLoading(true);
    DocumentsService.getSites(sitesStatus).then((res) => {
      setIsSitesLoading(false);
      if (res.status === 200) {
        setSites(res.sites);
        if (sitesStatus === 'ACTIVE') {
          dispatch(login({ ...user, sites: res.sites }));
        } else {
          DocumentsService.getSites('ACTIVE').then((res) => {
            dispatch(login({ ...user, sites: res.sites }));
          });
        }
      }
    });
  }

  useEffect(() => {
    if (formkiqVersion.modules.includes('site_permissions_automatic')) return;
    dispatch(fetchGroups({ limit: 60 }));
    updateUserSites();
  }, [sitesStatus]);

  return (
    <>
      <Helmet>
        <title>Sites Management</title>
      </Helmet>

      <div className="flex flex-row">
        <div className="flex-1 inline-block h-full">
          <div className="flex flex-col w-full h-full px-6 mt-6">
            {formkiqVersion.modules.includes('site_permissions_automatic') ? (
              <>
                <p className="text-center">
                  Your sites/workspaces are configured to use Cognito Groups,
                  rather than defined sites.
                </p>
                <p className="text-center">
                  Managing sites and access is done via{' '}
                  <Link
                    to="/admin/groups"
                    className="text-primary-500 underline hover:text-primary-700"
                  >
                    FormKiQ Groups
                  </Link>
                  .
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-between items-center h-10">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">Sites Management</h1>
                    <div className="w-48 h-10">
                      <RadioListbox
                        values={statusValues}
                        titles={statusTitles}
                        selectedValue={sitesStatus}
                        setSelectedValue={setSitesStatus}
                      />
                    </div>
                  </div>
                  {((formkiqVersion.modules.includes(
                    'site_permissions_defined'
                  ) &&
                    user.sites.length === 0) ||
                    user.isAdmin) && (
                    <ButtonPrimaryGradient
                      onClick={() => setIsCreateSiteModalOpen(true)}
                    >
                      + New Site
                    </ButtonPrimaryGradient>
                  )}
                </div>
                {user.isAdmin && (
                  <ul className="flex flex-col gap-4 mt-4">
                    {sites.length > 0 ? (
                      sites.map((site) => (
                        <SiteListItem
                          key={site.siteId}
                          site={site}
                          isEditing={editingSiteId === site.siteId}
                          onEditToggle={setEditingSiteId}
                          groups={groups}
                          onSitesChange={updateUserSites}
                          formkiqVersion={formkiqVersion}
                        />
                      ))
                    ) : isSitesLoading ? (
                      <Spinner />
                    ) : (
                      <h3 className="text-center">
                        There are no sites created yet.
                      </h3>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <CreateSiteModal
        isOpen={isCreateSiteModalOpen}
        setIsOpen={setIsCreateSiteModalOpen}
        onSitesChange={updateUserSites}
      />
    </>
  );
}

export default SitesManagement;
