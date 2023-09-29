import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import configureStore from '../../store/configureStore';
import { useRequestAlert } from '../useRequestAlert';

test('useRequestAlert', () => {
  const store = configureStore({
    entities: {
      events: null,
      timeTrackAlert: null,
      requestAlert: {
        id: 'id',
        alert: true,
        startDate: new Date(2021, 3, 1),
        endDate: new Date(2021, 3, 31),
      },
    },
  });

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result } = renderHook(() => useRequestAlert(), { wrapper: Wrapper });

  expect(result.current).toEqual({
    id: 'id',
    alert: true,
    startDate: new Date(2021, 3, 1),
    endDate: new Date(2021, 3, 31),
  });
});
