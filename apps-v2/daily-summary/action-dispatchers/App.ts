import { confirm, ConfirmDialogProps } from '@commons/actions/app';
import { getUserSetting } from '@commons/actions/userSetting';
import { setUserPermission } from '@commons/modules/accessControl/permission';
import { actions as toast } from '@commons/modules/toast';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { User } from '@apps/domain/models/User';

import { actions as EventsActions } from '../modules/entities/events';
import { actions as user } from '../modules/entities/user';
import { actions as blocking } from '../modules/ui/blocking';
import { actions as DailySummaryActions } from '../modules/ui/dailySummary';

import { AppDispatch } from './AppThunk';

const App = (
  dispatch: AppDispatch
): {
  initialize: (
    targetEmployee: User | undefined | null,
    userPermission: Permission | undefined | null
  ) => void;
  finalize: () => void;
  showErrorNotification: (e: Error) => void;
  hideErrorNotification: () => void;
  resetErrorNotification: () => void;
  confirm: (props: ConfirmDialogProps<unknown>) => Promise<boolean>;
} => ({
  initialize: (
    targetEmployee: User | undefined | null,
    userPermission: Permission | undefined | null
  ) => {
    dispatch(getUserSetting());
    if (targetEmployee) {
      dispatch(user.set(targetEmployee));
    }
    if (userPermission) {
      dispatch(setUserPermission(userPermission));
    }
  },
  finalize: () => {
    dispatch(user.reset());
    dispatch(EventsActions.reset());
    dispatch(DailySummaryActions.reset());
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

  confirm: (props: ConfirmDialogProps<unknown>) => {
    return dispatch(confirm(props)) as Promise<boolean>;
  },
});

export default App;
