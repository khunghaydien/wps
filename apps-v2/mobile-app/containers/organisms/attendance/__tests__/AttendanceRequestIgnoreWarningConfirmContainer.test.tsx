import React from 'react';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';

import { actions } from '@mobile/modules/attendance/attendanceRequest/warning';

import './mocks/mockWindowObj';
import Container from '../AttendanceRequestIgnoreWarningConfirmContainer';
import createStore from '@mobile/store/configureStore';

const renderComponent = (store = createStore()) => {
  return create(
    <Provider store={store}>
      <Container data-test-id="container" />
    </Provider>
  );
};

it('should connect to state', () => {
  // Arrange
  const messages = ['Messages 1', 'Messages 2', 'Messages 3'];
  const callback = () => {};
  const store = createStore();
  store.dispatch(actions.setMessages(messages, callback));

  // Act
  let instance;
  act(() => {
    instance = renderComponent(store);
  });

  // Assert
  const props = instance.root.children[0].children[0].props;
  expect(props.messages).toBe(messages);
  expect(props.callback).toBe(callback);
});
