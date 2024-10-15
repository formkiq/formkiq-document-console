import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  fetchGroups,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { useAppDispatch } from '../../Store/store';
import { SiteListItem } from '../../Components/SitesManagement/SiteListItem';
import CreateSiteModal from '../../Components/SitesManagement/CreateSiteModal';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { login, useAuthenticatedState } from '../../Store/reducers/auth';
import { ConfigState } from '../../Store/reducers/config';

function SitesManagement() {
  const { user } = useAuthenticatedState();
  const { groups } = useSelector(UserManagementState);
  const { formkiqVersion } = useSelector(ConfigState);
  const dispatch = useAppDispatch();

  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [isCreateSiteModalOpen, setIsCreateSiteModalOpen] = useState(false);

  function updateUserSites() {
    DocumentsService.getSites().then((res) => {
      if (res.status === 200) {
        setSites(res.sites);
        dispatch(login({ ...user, sites: res.sites }));
      }
    });
  }

  useEffect(() => {
    dispatch(fetchGroups({ limit: 60 }));
    DocumentsService.getSites().then((res) => {
      if (res.status === 200) {
        setSites(res.sites);
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Sites Management</title>
      </Helmet>

      <div className="flex flex-row">
        <div className="flex-1 inline-block h-full">
          <div className="flex flex-col w-full h-full px-6 mt-6">
            <div className="flex flex-row justify-between items-center h-10">
              <h1 className="text-xl font-bold">Sites Management</h1>
              {((formkiqVersion.modules.includes('site_permissions_defined') &&
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
                ) : (
                  <h3 className="text-center">
                    There are no sites created yet.
                  </h3>
                )}
              </ul>
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
