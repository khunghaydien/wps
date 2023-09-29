import { Dispatch } from 'redux';

import { setUserPermission } from '../../../commons/modules/accessControl/permission';
import { actions as toast } from '../../../commons/modules/toast';

import { Permission } from '../../../domain/models/access-control/Permission';
import { User } from '../../../domain/models/User';

import { actions as user } from '../modules/entities/user';
import { actions as blocking } from '../modules/ui/blocking';

export default (dispatch: Dispatch) => ({
  initialize: (
    targetEmployee: User | undefined | null,
    userPermission: Permission | undefined | null
  ) => {
    if (targetEmployee) {
      dispatch(user.set(targetEmployee));
    }
    if (userPermission) {
      dispatch(setUserPermission(userPermission));
    }
  },
  finalize: () => {
    dispatch(toast.reset());
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
