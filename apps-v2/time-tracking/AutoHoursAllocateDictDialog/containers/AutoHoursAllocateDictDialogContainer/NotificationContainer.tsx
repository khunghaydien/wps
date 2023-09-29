import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePortal from 'react-useportal';

import styled from 'styled-components';

import Toast from '@commons/components/Toast';

import { State } from '../../modules';

import App from '../../action-dispatchers/App';

const Message = styled.div`
  min-width: 142px; // 240px - padding(16px * 2) - icon(40px) - close(26px)
  max-height: 40vh; // heuristic
  overflow-y: auto;
`;

const mapStateToProps = (state: State) => ({
  isShow: state.common.toast.isShow,
  message: state.common.toast.message,
  variant: state.common.toast.variant,
});

const NotificationContainer = (): JSX.Element => {
  const { message, ...props } = useSelector(mapStateToProps);

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

  return (
    <Portal>
      {/* Portal is not removed to make the CSS transition work. */}
      <Toast
        {...props}
        message={undefined}
        onClick={app.hideErrorNotification}
        onExit={app.resetErrorNotification}
      >
        <Message>{message}</Message>
      </Toast>
    </Portal>
  );
};

export default NotificationContainer;
