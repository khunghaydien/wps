import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  DynamicTestConditions,
  isPermissionSatisfied,
} from '@apps/domain/models/access-control/Permission';

import { State } from '@mobile/modules';

const useAccessControl = (
  conditions: DynamicTestConditions | void
): boolean => {
  const userPermission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const isByDelegate = false;

  const result = useMemo(
    () =>
      conditions &&
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
