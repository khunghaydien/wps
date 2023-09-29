import React from 'react';
import { useSelector, useStore } from 'react-redux';

import useId from '@apps/core/hooks/useId';
import usePortal from '@apps/core/hooks/usePortal';
import Toast from '@commons/components/Toast';

import createControllers from './controllers';
import {
  AppState,
  AppStore,
} from '@attendance/timesheet-pc-importer/store/AppStore';

const NotificationContainer: React.FC = () => {
  const props = useSelector((state: AppState) => state.common.toast);
  const store = useStore() as AppStore;
  const controllers = React.useMemo(() => createControllers(store), [store]);

  const id = useId();

  const Notification = usePortal(
    `portal-${id}`,
    <Toast {...props} onClick={controllers.hide} onExit={controllers.reset} />
  );

  return Notification;
};

export default NotificationContainer;
