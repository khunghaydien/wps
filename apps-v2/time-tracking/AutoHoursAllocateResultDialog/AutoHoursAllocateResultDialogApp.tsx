import React, { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { AutoHoursAllocationDictSurplusTime } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import AppActions from './action-dispatchers/App';

import AutoHoursAllocateResultDialogContainer from './containers/AutoHoursAllocateResultDialogContainer';

import configureStore from './store/configureStore';

export type Props = {
  close: () => void;
  onApply: (
    arg0: AutoHoursAllocationResult[],
    arg1: AutoHoursAllocationDictSurplusTime
  ) => void;
  targetDate: string;
  timeOfAttendance: number | null | undefined;
  timeOfExternalTaskTime: number | null;
  userPermission: Permission;
  empId: string | undefined;
};

const AutoHoursAllocateResultDialogApp: React.FC<Props> = ({
  close,
  onApply,
  targetDate,
  timeOfAttendance,
  timeOfExternalTaskTime,
  userPermission,
  empId,
}: Props) => {
  const configuredStore = useMemo(configureStore, []);

  useEffect(() => {
    const app = AppActions(configuredStore.dispatch);
    app.initialize({ targetDate, userPermission, empId });
    return app.finalize;
  }, [configuredStore]);

  return (
    <Provider store={configuredStore}>
      <AutoHoursAllocateResultDialogContainer
        empId={empId}
        targetDate={targetDate}
        timeOfAttendance={timeOfAttendance}
        timeOfExternalTaskTime={timeOfExternalTaskTime}
        onClose={close}
        onApply={onApply}
      />
    </Provider>
  );
};

export default AutoHoursAllocateResultDialogApp;
