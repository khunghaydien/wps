import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePortal from 'react-useportal';

import Toast from '../../commons/components/Toast';

import { State } from '../modules';

import App from '../action-dispatchers/App';

const mapStateToProps = (state: State) => ({
  isShow: state.toast.isShow,
  message: state.toast.message,
  variant: state.toast.variant,
});

const NotificationContainer = (): JSX.Element => {
  const props = useSelector(mapStateToProps);

  const dispatch = useDispatch();
  const app = useMemo(() => App(dispatch), [dispatch]);

  const { Portal, ref } = usePortal({
    isOpen: true,
  });
  useEffect(() => {
    // HACK: Workaround for 'TypeError: Cannot read properties of undefined (reading 'contains')'
    // FIXME: Maybe ref.current should be bound to any actual DOM(or document.body??).
    ref.current = document.createElement('div');
  }, [ref]);

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
