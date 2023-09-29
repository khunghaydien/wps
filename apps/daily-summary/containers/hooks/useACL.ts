import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '../../../domain/models/access-control/Permission';

import { State } from '@apps/daily-summary/modules';

// eslint-disable-next-line import/prefer-default-export
export const useACL = (): {
  editTimeTrack: boolean;
} => {
  const isDelegated = useSelector(
    (state: State) => state.entities.user.isDelegated
  );
  const userPermission: Permission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const editTimeTrack = useMemo(() => {
    const isEmployee = !isDelegated;
    const isDelegatedEmployeeWithRightPermission =
      isDelegated && userPermission.editTimeTrackByDelegate;
    return isEmployee || isDelegatedEmployeeWithRightPermission;
  }, [isDelegated, userPermission.editTimeTrackByDelegate]);

  return { editTimeTrack };
};
