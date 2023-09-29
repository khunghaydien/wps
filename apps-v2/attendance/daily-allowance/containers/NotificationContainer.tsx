import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePortal from 'react-useportal';

import Toast from '../../../commons/components/Toast';

import { State } from '../modules';

import App from '../action-dispatchers/App';

const mapStateToProps = (state: State) => ({
  isShow: (state.toast as any).isShow,
  message: (state.toast as any).message,
  variant: (state.toast as any).variant,
});

const NotificationContainer = () => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const app = useMemo(() => App(dispatch), [dispatch]);

  const { Portal } = usePortal({
    isOpen: true,
  });
  const onClick = useCallback(() => {
    app.hideErrorNotification();
  }, [app]);
  const onExit = useCallback(() => app.resetErrorNotification(), [app]);

  return (
    <Portal>
      {/* Portal is not removed to make the CSS transition work. */}
      <Toast {...props} onClick={onClick} onExit={onExit} />
    </Portal>
  );
};

export default NotificationContainer;
