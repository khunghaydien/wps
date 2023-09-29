import React from 'react';
import { Provider } from 'react-redux';

import { act, renderHook } from '@testing-library/react-hooks';

import { useDate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDate';
import { useSelectTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSelectTask';
import { useSourceTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSourceTask';
import { useSummary } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSummary';
import configureStore from '@apps/time-tracking/time-tracking-charge-transfer-pc/store/configureStore';

test('useSourceTask', () => {
  // arrange
  const store = configureStore();

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { result: useDateResult } = renderHook(() => useDate(), {
    wrapper: Wrapper,
  });
  const { result: useSummaryResult } = renderHook(() => useSummary(), {
    wrapper: Wrapper,
  });
  const { result: useSourceTaskResult } = renderHook(() => useSourceTask(), {
    wrapper: Wrapper,
  });
  const { result: useSelectTaskResult } = renderHook(() => useSelectTask(), {
    wrapper: Wrapper,
  });

  const targetSummary = {
    task: {
      jobId: 'jobId',
      jobCode: 'jobCode',
      jobName: 'jobName',
    },
    period: {
      startDate: '2021-05-1',
      endDate: '2021-05-31',
    },
    summaryId: 'summaryId',
  };

  // arrange
  act(() => {
    useSelectTaskResult.current(targetSummary);
  });

  expect(useDateResult.current[0]).toStrictEqual(new Date(2021, 4, 1));
  expect(useDateResult.current[1]).toStrictEqual(new Date(2021, 4, 31));
  expect(useSummaryResult.current[0]).toStrictEqual({
    summaryId: 'summaryId',
    summaryPeriod: {
      startDate: new Date(2021, 4, 1),
      endDate: new Date(2021, 4, 31),
    },
  });
  expect(useSourceTaskResult.current[0]).toStrictEqual({
    jobId: 'jobId',
    jobCode: 'jobCode',
    jobName: 'jobName',
    workCategoryName: '',
    workCategoryId: '',
    workCategoryCode: '',
  });
});
