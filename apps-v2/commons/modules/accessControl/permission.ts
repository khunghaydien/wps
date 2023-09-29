import { createSelector } from 'reselect';

import defaultPermission, {
  buildCheckerByUserPermission,
  Permission,
} from '../../../domain/models/access-control/Permission';

import { State as ReducerState } from '../../../admin-pc/reducers';

// State

type State = Permission;

// Action

type SetUserPermissionAction = {
  type: 'COMMONS/ACCESS_CONTROL/SET_USER_PERMISSION';
  payload: Permission;
};

type Action = SetUserPermissionAction;

/**
 * 権限を設定します
 * @param permission 権限
 * @return アクション
 */
export const setUserPermission = (
  permission: Permission = defaultPermission
): SetUserPermissionAction => ({
  type: 'COMMONS/ACCESS_CONTROL/SET_USER_PERMISSION',
  payload: permission,
});

// Selector
const selectUserPermission = (state: ReducerState) =>
  state.common.accessControl.permission;

export const buildPermissionChecker = createSelector(
  selectUserPermission,
  buildCheckerByUserPermission
);

// Reducer

const initialState: State = { ...defaultPermission };

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'COMMONS/ACCESS_CONTROL/SET_USER_PERMISSION':
      const userPermission = action.payload as Permission;
      return {
        ...userPermission,
      };

    default:
      return state;
  }
};
