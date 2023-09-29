import React from 'react';
import { Provider } from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';

import configureStore from '../../store/configureStore';
import { useDelegate } from '../useDelegate';

const employee = {
  id: 'TEST',
  employeeCode: '',
  employeeName: '',
  employeePhotoUrl: '',
  departmentCode: '',
  departmentName: '',
  title: '',
  managerName: '',
  isDelegated: true,
};

describe('useDestinationTask', () => {
  test('should return user and permission', () => {
    const store = configureStore({
      common: {
        proxyEmployeeInfo: employee,
        accessControl: {
          permission: 'test',
        },
      },
    } as any);

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useDelegate(), {
      wrapper: Wrapper,
    });

    expect(result.current[0]).toEqual('test');
    expect(result.current[1].id).toEqual('TEST');
  });

  test('should return user as undefined', () => {
    const store = configureStore({
      common: {
        proxyEmployeeInfo: {},
        accessControl: {
          permission: 'test',
        },
      },
    } as any);

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useDelegate(), {
      wrapper: Wrapper,
    });

    expect(result.current[0]).toEqual('test');
    expect(result.current[1]).toBeUndefined();
  });
});
