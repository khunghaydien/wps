import {
  // @ts-ignore
  __get__,
} from '@apps/domain/models/access-control/Permission';

const defaultPermission = __get__('defaultPermission');

let $permission = defaultPermission;

export const setPermission = jest.fn((permission) => {
  $permission = permission;
});

export const getPermission = jest.fn(() => $permission);

export const isPermissionSatisfied = jest.fn();
