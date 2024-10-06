import { useEffect, useState } from 'react';
import { Close, Settings } from '../Icons/icons';
import { DocumentsService } from '../../helpers/services/documentsService';
import { SiteTitle } from './SiteTitle';
import { SiteStatus } from './SiteStatus';
import { SiteGroupPermissions } from './SiteGroupPermissions';

interface SiteListItemProps {
  site: {
    title: string;
    siteId: string;
    permissions: string[];
  };
  isEditing: boolean;
  onEditToggle: (siteId: string | null) => void;
  groups: any[];
}

export function SiteListItem({
  site,
  isEditing,
  onEditToggle,
  groups,
}: SiteListItemProps) {
  const [siteGroups, setSiteGroups] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) {
      setSiteGroups([]);
      return;
    }
    DocumentsService.getSiteGroups(site.siteId).then((res) => {
      if (res.groupNames) {
        setSiteGroups(res.groupNames);
      }
    });
  }, [isEditing, site.siteId]);

  return (
    <li className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-row gap-8 justify-between items-center">
        <SiteTitle
          siteId={site.siteId}
          currentTitle={site.title}
          isEditingSite={isEditing}
        />

        {!isEditing ? (
          <button
            className="w-6 h-6 text-neutral-500 hover:text-neutral-900"
            onClick={() => onEditToggle(site.siteId)}
            title="Edit Site Permissions"
          >
            <Settings />
          </button>
        ) : (
          <button
            className="w-6 h-6 text-neutral-500 hover:text-neutral-900"
            onClick={() => onEditToggle(null)}
            title="Cancel Editing"
          >
            <Close />
          </button>
        )}
      </div>
      {isEditing && (
        <>
          <hr className="my-4" />
          <SiteStatus siteId={site.siteId} />
          <hr className="my-4" />
          <SiteGroupPermissions
            siteId={site.siteId}
            groups={groups}
            siteGroups={siteGroups}
          />
        </>
      )}
    </li>
  );
}
