import React from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';

import { act, renderHook } from '@testing-library/react-hooks';

import ApiMock from '../../../../../../../../__tests__/mocks/ApiMock';
import configureStore from '../../../store/configureStore';
import useWorkCategoryResource from '../useWorkCategoryResource';
import Store from './mocks/Store';

const Provider = ReactReduxProvider as React.ComponentType<
  Omit<React.ComponentProps<typeof ReactReduxProvider>, 'children'>
>;

const apiReturnValue = {
  workCategoryList: [
    {
      name: 'Training',
      id: 'a1G2v000003yt73EAA',
      code: '4',
    },
    {
      name: 'Meeting',
      id: 'a1G2v000003yt78EAA',
      code: '5',
    },
  ],
};

describe('useWorkCategoryResources', () => {
  beforeEach(() => {
    ApiMock.mockReturnValue({
      '/time/work-category/get': apiReturnValue,
    });
  });

  it('should return workCategories if loading has been completed', async () => {
    const store = configureStore({
      entities: {
        workCategories: {},
      },
      ui: {
        workCategoryList: {},
      },
    });

    const { result } = renderHook(
      () =>
        useWorkCategoryResource({
          targetDate: '2020-02-06',
          jobId: 'a0h2v00000a4y2zAAA',
        }),
      {
        wrapper: (props: { [prop: string]: unknown }) => (
          <Provider {...props} store={store as any} />
        ),
      }
    );

    await act(async () => {
      await result.current.load();
    });

    expect(result.current.workCategories).toEqual(
      apiReturnValue.workCategoryList
    );
  });

  it('should return true while loading', async () => {
    ApiMock.mockReturnValue({
      '/time/work-category/get': apiReturnValue,
    });

    const store = Store.create({
      entities: {
        workCategories: {},
      },
      ui: {
        workCategoryList: {},
      },
    });

    const { result, waitForNextUpdate } = renderHook(
      () =>
        useWorkCategoryResource({
          targetDate: '2020-02-06',
          jobId: 'a0h2v00000a4y2zAAA',
        }),
      {
        wrapper: (props: { [prop: string]: unknown }) => (
          <Provider {...props} store={store} />
        ),
      }
    );

    act(() => {
      result.current.load();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();
  });
});
