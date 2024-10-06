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
import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";

function SitesManagement() {
  const { groups } = useSelector(UserManagementState);
  const dispatch = useAppDispatch();

  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [isCreateSiteModalOpen, setIsCreateSiteModalOpen] = useState(false);

  function updateSites() {
    DocumentsService.getSites().then((res) => {
      if (res.status === 200) setSites(res.sites);
    });
  }

  useEffect(() => {
    dispatch(fetchGroups({ limit: 60 }));
    updateSites();
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
              <ButtonPrimaryGradient
              onClick={() => setIsCreateSiteModalOpen(true)}>
                + New Site
              </ButtonPrimaryGradient>
            </div>

            <ul className="flex flex-col gap-4 mt-4">
              {sites.length > 0 ? (
                sites.map((site) => (
                  <SiteListItem
                    key={site.siteId}
                    site={site}
                    isEditing={editingSiteId === site.siteId}
                    onEditToggle={setEditingSiteId}
                    groups={groups}
                    onSitesChange={updateSites}
                  />
                ))
              ) : (
                <h3 className="text-center">There are no sites created yet.</h3>
              )}
            </ul>
          </div>
        </div>
      </div>
      <CreateSiteModal
        isOpen={isCreateSiteModalOpen}
        setIsOpen={setIsCreateSiteModalOpen}
        onSitesChange={updateSites}
      />
    </>
  );
}

export default SitesManagement;
