import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import Request from '@apps/planner-pc/action-dispatchers/Request';

import configureStore from '../../store/configureStore';
import { useFetchAlertOnSubmit } from '../useFetchAlertOnSubmit';

jest.mock('@apps/planner-pc/action-dispatchers/Request', () => jest.fn());

test('useFetchAlertOnSubmit', () => {
  const mockFetchAlert = jest.fn();
  (Request as jest.Mock).mockImplementation(() => {
    return { fetchAlert: mockFetchAlert };
  });
  // arrange
  const store = configureStore();

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  renderHook(() => useFetchAlertOnSubmit(new Date(2021, 3, 27)), {
    wrapper: Wrapper,
  });

  window.dispatchEvent(
    new CustomEvent('EVENT/TIME_TRACKING/TIME_TRACK_SUBMIT')
  );

  expect(mockFetchAlert.mock.calls.length).toBe(1);
  expect(mockFetchAlert.mock.calls[0][0]).toStrictEqual({
    targetDate: '2021-04-27',
  });
});
