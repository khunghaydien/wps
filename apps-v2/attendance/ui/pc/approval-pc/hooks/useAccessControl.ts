import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  DynamicTestConditions,
  isPermissionSatisfied,
} from '@apps/domain/models/access-control/Permission';

import { State } from '@attendance/timesheet-pc/modules';

const useAccessControl = (conditions: DynamicTestConditions): boolean => {
  const userPermission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const isByDelegate = useSelector(
    (state: State) => state.common.proxyEmployeeInfo?.isProxyMode || false
  );

  const result = useMemo(
    () =>
      isPermissionSatisfied({
        ...conditions,
        userPermission,
        isByDelegate,
      }),
    [userPermission, isByDelegate, conditions]
  );

  return result;
};

export default useAccessControl;
