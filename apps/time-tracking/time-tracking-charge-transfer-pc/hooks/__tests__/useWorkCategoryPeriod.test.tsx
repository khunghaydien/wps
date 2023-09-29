import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import configureStore from '../../store/configureStore';
import { useWorkCategoryPeriod } from '../useWorkCategoryPeriod';

test('useDestinationTask', () => {
  const task = {
    jobCode: 'job-code',
    jobId: 'job-id',
    jobName: 'job-name',
    validFrom: '2021-04-05',
    validTo: '2021-04-30',
    workCategoryCode: 'workcategory-code',
    workCategoryId: 'workcategory-id',
    workCategoryName: 'workcategory-name',
  };

  const store = configureStore({
    ui: {
      timeTrackingCharge: {
        destTask: task,
        startDate: new Date(2021, 3, 1),
        endDate: new Date(2021, 3, 20),
      },
    },
  } as any);

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result } = renderHook(() => useWorkCategoryPeriod(), {
    wrapper: Wrapper,
  });

  expect(result.current[0]).toBe('2021-04-05');
  expect(result.current[1]).toBe('2021-04-20');
});
