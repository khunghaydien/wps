import {
  isPermissionSatisfied as $isPermissionSatisfied,
  Permission,
  TotalTestConditions,
} from '@apps/domain/models/access-control/Permission';

import Collection from '@attendance/libraries/Collection';

const collection = Collection<Permission>('Permission');

export type { Permission };

export const setPermission = collection.register;

export const getPermission = (): Permission => collection();

export const isPermissionSatisfied = (
  conditions: Omit<TotalTestConditions, 'userPermission'>
): boolean => {
  const userPermission = getPermission();
  return $isPermissionSatisfied({
    ...conditions,
    userPermission,
  });
};
