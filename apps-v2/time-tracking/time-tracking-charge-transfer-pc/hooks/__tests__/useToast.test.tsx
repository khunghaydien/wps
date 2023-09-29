import React from 'react';
import { Provider } from 'react-redux';

import { act, renderHook } from '@testing-library/react-hooks';

import { useToast } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useToast';
import configureStore from '@apps/time-tracking/time-tracking-charge-transfer-pc/store/configureStore';

describe('useToast', () => {
  test('should dispath to show toast', () => {
    // arrange
    const store = configureStore();

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useToast('success'), {
      wrapper: Wrapper,
    });

    // arrange
    act(() => {
      result.current[0]('message');
    });

    expect(store.getState().common.toast.isShow).toBe(true);
    expect(store.getState().common.toast.message).toBe('message');
    expect(store.getState().common.toast.variant).toBe('success');
  });

  test('should dispath to hide toast', () => {
    // arrange
    const store = configureStore();

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useToast('success'), {
      wrapper: Wrapper,
    });

    // arrange
    act(() => {
      result.current[1]();
    });

    expect(store.getState().common.toast.isShow).toBe(false);
  });
});
