import { confirm, ConfirmDialogProps } from '@commons/actions/app';
import { setUserPermission } from '@commons/modules/accessControl/permission';
import { actions as toast } from '@commons/modules/toast';

import { Permission } from '@apps/domain/models/access-control/Permission';

import { actions as blocking } from '../modules/ui/blocking';

import AllocateResult from './AllocateResult';
import { AppDispatch } from './AppThunk';

export default (dispatch: AppDispatch) => ({
  initialize: ({
    targetDate,
    userPermission,
    empId,
  }: {
    targetDate: string;
    userPermission: Permission | undefined | null;
    empId?: string;
  }) => {
    if (userPermission) {
      dispatch(setUserPermission(userPermission));
    }

    const allocateResult = AllocateResult(dispatch);
    allocateResult.fetch(empId, targetDate);
  },
  finalize: () => {
    dispatch(toast.reset());
  },

  showErrorNotification: (e: Error) => {
    const message = e.message;
    dispatch(blocking.enable());
    dispatch(toast.show(message, 'error'));
  },
  showWarnNotification: (message: string) => {
    dispatch(blocking.enable());
    dispatch(toast.show(message, 'warning'));
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
