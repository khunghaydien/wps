import { withLoading } from '../../commons/actions/app';
import { getUserSetting } from '../../commons/actions/userSetting';
import { setUserPermission } from '../../commons/modules/accessControl/permission';

import { Permission } from '../../domain/models/access-control/Permission';

import { AppDispatch } from './AppThunk';
import { load } from './AttRequestStatus';

/**
 * チーム画面を初期化する
 */
// eslint-disable-next-line import/prefer-default-export
export const initialize =
  (param?: { userPermission: Permission }) => (dispatch: AppDispatch) => {
    if (param) {
      dispatch(setUserPermission(param.userPermission));
    }

    return dispatch(
      withLoading(
        () => dispatch(getUserSetting()),
        (userSetting) => {
          if (!userSetting) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject();
          }
          return dispatch(load(userSetting.departmentId, null));
        }
      )
    );
  };
