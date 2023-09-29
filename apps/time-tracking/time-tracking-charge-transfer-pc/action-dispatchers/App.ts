import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { getUserSetting } from '@apps/commons/actions/userSetting';
import msg from '@apps/commons/languages';
import { setUserPermission } from '@apps/commons/modules/accessControl/permission';
import { actions as proxyEmployeeInfoActions } from '@apps/commons/modules/proxyEmployeeInfo';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { AppDispatch } from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/AppThunk';

type ApiErrorArgType = Parameters<typeof catchApiError>;

export default (dispatch: AppDispatch) =>
  ({
    initialize: async (param: {
      userPermission: Permission;
    }): Promise<void> => {
      dispatch(loadingStart());
      try {
        setUserPermission(param.userPermission);
        const userSetting: void | UserSetting = await dispatch(
          getUserSetting()
        );
        if (
          userSetting &&
          userSetting.useTimeTrackingChargeTransfer === false
        ) {
          const error = {
            errorCode: 'TIME_TRACKING_CHARGE_TRANSFER_CANNOT_USE',
            message: msg().Trac_Lbl_CantUseTimeTrackingChargeTransfer,
            stackTrace: null,
          };
          throw error;
        }
      } catch (err) {
        dispatch(catchApiError(err, { isContinuable: false }));
      } finally {
        dispatch(loadingEnd());
      }
    },
    selectDelegatedEmployee: async (targetEmployeeId: string) => {
      dispatch(proxyEmployeeInfoActions.set(targetEmployeeId));
      return true;
    },
    unselectDelegatedEmployee: async () => {
      dispatch(proxyEmployeeInfoActions.unset());
    },
    catchApiError: (err: ApiErrorArgType[0], option: ApiErrorArgType[1]) => {
      dispatch(catchApiError(err, option));
    },
  } as const);
