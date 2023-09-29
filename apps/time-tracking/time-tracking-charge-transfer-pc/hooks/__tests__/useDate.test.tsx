import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import configureStore from '../../store/configureStore';
import { useDate } from '../useDate';

test('useDate', () => {
  const store = configureStore({
    ui: {
      timeTrackingCharge: {
        startDate: new Date(2021, 5, 17),
        endDate: new Date(2021, 6, 17),
      },
    },
  } as any);

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result } = renderHook(() => useDate(), { wrapper: Wrapper });

  expect(result.current[0].toISOString()).toBe(
    new Date(2021, 5, 17).toISOString()
  );

  expect(result.current[1].toISOString()).toBe(
    new Date(2021, 6, 17).toISOString()
  );
});
