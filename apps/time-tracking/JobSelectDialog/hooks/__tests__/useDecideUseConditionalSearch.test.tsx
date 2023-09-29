import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { renderHook } from '@testing-library/react-hooks';

import common from '@apps/commons/reducers';

import useDecideUseConditionalSearch from '../useDecideUseConditionalSearch';

describe('useDecideUseJobSearchAndSelect(injectedFlag)', () => {
  it('should return true, when true injected.', () => {
    const mockStore = createStore(combineReducers({ common }), {
      common: { userSetting: { useJobSearchAndSelect: false } },
    } as any);

    const Wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

    const { result } = renderHook(() => useDecideUseConditionalSearch(true), {
      wrapper: Wrapper,
    });

    expect(result.current).toBe(true);
  });

  it('should return false, when false injected.', () => {
    const mockStore = createStore(combineReducers({ common }), {
      common: { userSetting: { useJobSearchAndSelect: true } },
    } as any);

    const Wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

    const { result } = renderHook(() => useDecideUseConditionalSearch(false), {
      wrapper: Wrapper,
    });

    expect(result.current).toBe(false);
  });

  it('should return value of state.common.userSetting.useJobSearchAndSelect, when undefined injected.', () => {
    const mockStore = createStore(combineReducers({ common }), {
      common: { userSetting: { useJobSearchAndSelect: true } },
    } as any);

    const Wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

    const { result } = renderHook(
      () => useDecideUseConditionalSearch(undefined),
      {
        wrapper: Wrapper,
      }
    );

    expect(result.current).toBe(true);
  });

  it('should return false, if state dose not have the userSetting', () => {
    const mockStore = createStore(() => ({}));

    const Wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

    const { result } = renderHook(
      () => useDecideUseConditionalSearch(undefined),
      {
        wrapper: Wrapper,
      }
    );

    expect(result.current).toBe(false);
  });
});
