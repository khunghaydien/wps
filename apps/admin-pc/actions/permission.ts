import { Permission } from '../models/permission/Permission';

import * as base from './base';

export const FUNC_NAME = 'permission';

export type SearchPermissionAction = {
  type: 'SEARCH_PERMISSION';
  payload: Permission[];
};

export type CreatePermissionAction = {
  type: 'CREATE_PERMISSION';
  payload: Permission;
};

export type UpdatePermissionAction = {
  type: 'UPDATE_PERMISSION';
  payload: Permission;
};

export type DeletePermissionAction = {
  type: 'DELETE_PERMISSION';
  payload: { id: string };
};

export type Action =
  | SearchPermissionAction
  | CreatePermissionAction
  | UpdatePermissionAction
  | DeletePermissionAction;

export const SEARCH_PERMISSION: SearchPermissionAction['type'] =
  'SEARCH_PERMISSION';

export const CREATE_PERMISSION: CreatePermissionAction['type'] =
  'CREATE_PERMISSION';

export const UPDATE_PERMISSION: UpdatePermissionAction['type'] =
  'UPDATE_PERMISSION';

export const DELETE_PERMISSION: DeletePermissionAction['type'] =
  'DELETE_PERMISSION';

export const SEARCH_PERMISSION_ERROR = 'SEARCH_PERMISSION_ERROR';
export const CREATE_PERMISSION_ERROR = 'CREATE_PERMISSION_ERROR';
export const UPDATE_PERMISSION_ERROR = 'UPDATE_PERMISSION_ERROR';
export const DELETE_PERMISSION_ERROR = 'DELETE_PERMISSION_ERROR';

export const searchPermission = (param: any = {}) =>
  base.search(FUNC_NAME, param, SEARCH_PERMISSION, SEARCH_PERMISSION_ERROR);

export const createPermission = (param: Permission) =>
  base.create(FUNC_NAME, param, CREATE_PERMISSION, CREATE_PERMISSION_ERROR);

export const updatePermission = (param: Permission) =>
  base.update(FUNC_NAME, param, UPDATE_PERMISSION, UPDATE_PERMISSION_ERROR);

export const deletePermission = (param: { id: string }) =>
  base.del(FUNC_NAME, param, DELETE_PERMISSION, DELETE_PERMISSION_ERROR);
