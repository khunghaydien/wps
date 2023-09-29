import React from 'react';
import { Provider } from 'react-redux';

import { act, renderHook } from '@testing-library/react-hooks';

import configureStore from '../../store/configureStore';
import { useSummary } from '../useSummary';

describe('useSummary', () => {
  test('should return summary', () => {
    const store = configureStore({
      ui: {
        timeTrackingCharge: {
          summaryId: 'id',
          summaryPeriod: {
            startDate: new Date(2021, 3, 1),
            endDate: new Date(2021, 3, 31),
          },
          startDate: new Date(2021, 3, 1),
          endDate: new Date(2021, 3, 31),
          destTask: {
            jobCode: '',
            jobId: '',
            jobName: '',
            workCategoryCode: '',
            workCategoryId: '',
            workCategoryName: '',
            validFrom: '',
            validTo: '',
          },
          srcTask: {
            jobCode: '',
            jobId: '',
            jobName: '',
            workCategoryCode: '',
            workCategoryId: '',
            workCategoryName: '',
          },
        },
      },
    });

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSummary(), { wrapper: Wrapper });

    expect(result.current[0]).toEqual({
      summaryId: 'id',
      summaryPeriod: {
        startDate: new Date(2021, 3, 1),
        endDate: new Date(2021, 3, 31),
      },
    });
  });

  test('should update summary', () => {
    const store = configureStore();

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSummary(), { wrapper: Wrapper });

    act(() => {
      result.current[1]({
        summaryId: 'update-test-id',
        summaryPeriod: {
          startDate: new Date(2021, 11, 1),
          endDate: new Date(2021, 11, 15),
        },
      });
    });

    expect(result.current[0]).toEqual({
      summaryId: 'update-test-id',
      summaryPeriod: {
        startDate: new Date(2021, 11, 1),
        endDate: new Date(2021, 11, 15),
      },
    });
  });
});
