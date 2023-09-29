import React from 'react';
import { useSelector, useStore } from 'react-redux';

import { ownerEmployeeId } from '@attendance/timesheet-pc-importer/modules/selectors';

import BaseContainer from '@widgets/dialogs/ProxyEmployeeSelectDialog/containers/ProxyEmployeeSelectDialogContainer';

import createControllers from './controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const ProxyEmployeeSelectDialogContainer = () => {
  const store = useStore() as AppStore;
  const employeeId = useSelector(ownerEmployeeId);
  const controllers = React.useMemo(() => createControllers(store), [store]);

  return (
    <BaseContainer
      {...{
        excludedEmployeeId: employeeId,
        onDecide: controllers.selectEmployee,
      }}
    />
  );
};

export default ProxyEmployeeSelectDialogContainer;
