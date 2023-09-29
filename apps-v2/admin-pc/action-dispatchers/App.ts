import { setUserPermission } from '../../commons/modules/accessControl/permission';

import { Permission } from '../../domain/models/access-control/Permission';

import { AppDispatch } from './AppThunk';

export type AppParam = {
  userPermission: Permission;
};

export const initialize = (param: AppParam) => (dispatch: AppDispatch) => {
  dispatch(setUserPermission(param.userPermission));
};

export default initialize;
