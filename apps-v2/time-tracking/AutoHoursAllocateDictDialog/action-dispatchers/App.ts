import { setUserPermission } from '@commons/modules/accessControl/permission';
import { actions as toast, showToast } from '@commons/modules/toast';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import { actions as blocking } from '../modules/ui/blocking';

import { AppDispatch } from './AppThunk';
import AutoHoursAllocateDict from './AutoHoursAllocateDict';

export default (dispatch: AppDispatch) => ({
  initialize: ({
    targetDate,
    userPermission,
    empId,
    resultItem,
  }: {
    targetDate: string;
    userPermission: Permission | undefined | null;
    empId: string;
    resultItem?: AutoHoursAllocationResult;
  }) => {
    if (userPermission) {
      dispatch(setUserPermission(userPermission));
    }

    const AutoHoursAllocateResult = AutoHoursAllocateDict(dispatch);
    AutoHoursAllocateResult.fetch(empId, targetDate, resultItem);
  },
  finalize: () => {
    dispatch(toast.reset());
  },

  showSuccessNotification: (message: string) => {
    dispatch(showToast(message));
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
