import { useMemo } from 'react';

import { User } from '../Store/reducers/auth';

type useIsReadOnlyUserParams = {
  user: User | null;
  siteId: string;
};

export const useIsReadOnlyUser = ({
  user,
  siteId,
}: useIsReadOnlyUserParams) => {
  return useMemo(() => {
    if (!user || !user.sites || !Array.isArray(user.sites)) return false;

    const site = user.sites.find((s) => s.siteId === siteId);
    if (!site) return false;

    return site.permissions.length === 1 && site.permissions.includes('READ');
  }, [user, siteId]);
};
