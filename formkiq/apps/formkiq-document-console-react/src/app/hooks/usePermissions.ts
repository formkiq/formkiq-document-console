import { useMemo } from 'react';

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'GOVERN';

interface UserSite {
  siteId: string;
  permissions: Permission[];
}

interface User {
  sites?: UserSite[];
}

interface UsePermissionsReturn {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canGovern: boolean;
  can: (permission: Permission) => boolean;
}

interface UsePermissionsParams {
  user: User | null;
  siteId: string;
}

export const usePermissions = ({
  user,
  siteId,
}: UsePermissionsParams): UsePermissionsReturn => {
  return useMemo(() => {
    if (!user || !Array.isArray(user.sites)) {
      return {
        canRead: false,
        canWrite: false,
        canDelete: false,
        canGovern: false,
        can: () => false,
      };
    }

    // find this site's permissions
    const site = user.sites.find((s) => s.siteId === siteId);
    const permissions = site?.permissions || [];

    return {
      canRead: permissions.includes('READ'),
      canWrite: permissions.includes('WRITE'),
      canDelete: permissions.includes('DELETE'),
      canGovern: permissions.includes('GOVERN'),
      can: (perm: Permission) => permissions.includes(perm),
    };
  }, [user, siteId]);
};
