import * as React from 'react';
import { useSelector, useStore } from 'react-redux';

import * as selectors from '@attendance/timesheet-pc-importer/modules/selectors';

import Component from '@attendance/timesheet-pc-importer/components/AppHeader/OwnerEmployee';

import createControllers from './controllers';
import * as AccessControlService from '@attendance/application/AccessControlService';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const NameContainer = () => {
  const store = useStore() as AppStore;
  const controllers = React.useMemo(() => createControllers(store), [store]);
  const ownerEmployee = useSelector(selectors.ownerEmployee);
  const allowedSwitching = React.useMemo(
    () =>
      AccessControlService.isPermissionSatisfied({
        isByDelegate: true,
        requireIfByDelegate: ['editAttTimeSheetByDelegate'],
      }) &&
      AccessControlService.isPermissionSatisfied({
        isByDelegate: true,
        requireIfByDelegate: ['viewAttTimeSheetByDelegate'],
      }),
    []
  );

  if (!ownerEmployee.id) {
    return null;
  }

  return (
    <Component
      ownerEmployee={ownerEmployee}
      allowedSwitching={allowedSwitching}
      changeOwnerEmployee={controllers.openProxyEmployeeSelector}
    />
  );
};

export default NameContainer;
