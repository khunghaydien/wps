import React, { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import AppActions from './action-dispatchers/App';

import AutoHoursAllocateDictDialogContainer from './containers/AutoHoursAllocateDictDialogContainer';

import configureStore from './store/configureStore';

export type Props = {
  close: () => void;
  targetDate: string;
  userPermission: Permission;
  empId: string;
  resultItem?: AutoHoursAllocationResult;
};

const AutoHoursAllocateDictDialogApp: React.FC<Props> = ({
  close,
  targetDate,
  userPermission,
  empId,
  resultItem,
}: Props) => {
  const configuredStore = useMemo(configureStore, []);

  useEffect(() => {
    const app = AppActions(configuredStore.dispatch);
    app.initialize({ targetDate, userPermission, empId, resultItem });
    return app.finalize;
  }, [configuredStore]);

  return (
    <Provider store={configuredStore}>
      <AutoHoursAllocateDictDialogContainer
        empId={empId}
        targetDate={targetDate}
        onClose={close}
      />
    </Provider>
  );
};

export default AutoHoursAllocateDictDialogApp;
