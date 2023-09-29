import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import configureStore from '../../store/configureStore';
import { useSourceTask } from '../useSourceTask';

test('useSourceTask', () => {
  const task = {
    jobCode: 'job-code',
    jobId: 'job-id',
    jobName: 'job-name',
    workCategoryCode: 'workcategory-code',
    workCategoryId: 'workcategory-id',
    workCategoryName: 'workcategory-name',
  };

  const store = configureStore({
    ui: {
      timeTrackingCharge: {
        srcTask: task,
      },
    },
  } as any);

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result } = renderHook(() => useSourceTask(), { wrapper: Wrapper });

  expect(JSON.stringify(result.current[0])).toBe(JSON.stringify(task));
});
