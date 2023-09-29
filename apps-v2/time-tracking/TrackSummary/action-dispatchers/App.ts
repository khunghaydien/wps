import format from 'date-fns/format';

import { getUserSetting } from '../../../commons/actions/userSetting';
import { setUserPermission } from '../../../commons/modules/accessControl/permission';
import { actions as toast } from '../../../commons/modules/toast';

import { Permission } from '../../../domain/models/access-control/Permission';
import { User } from '../../../domain/models/User';

import { actions as user } from '../modules/entities/user';
import { actions as blocking } from '../modules/ui/blocking';

import { AppDispatch } from './AppThunk';
import Request from './Request';

export default (dispatch: AppDispatch) => ({
  initialize: async (
    userPermission: Permission,
    targetEmployee?: User,
    today: Date = new Date()
  ): Promise<void> => {
    if (targetEmployee) {
      Request(dispatch, targetEmployee.id).fetchAlert(
        format(today, 'YYYY-MM-DD')
      );
      dispatch(user.set(targetEmployee));
    } else {
      dispatch(user.reset());
    }
    dispatch(setUserPermission(userPermission));
    try {
      await dispatch(getUserSetting());
    } catch (e) {
      dispatch(blocking.enable());
      dispatch(toast.show(e.message, 'error'));
    }
  },

  finalize: () => {
    dispatch(toast.reset());
    dispatch(user.reset());
    dispatch(blocking.disable());
  },

  showErrorNotification: (e: Error) => {
    const message = e.message;
    dispatch(blocking.enable());
    dispatch(toast.show(message, 'error'));
  },

  hideErrorNotification: () => {
    dispatch(toast.hide());
    dispatch(blocking.disable());
  },

  resetErrorNotification: () => {
    dispatch(toast.reset());
  },
});
