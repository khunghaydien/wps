import React from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderHook } from '@testing-library/react-hooks';

import defaultPermission from '../../../../domain/models/access-control/Permission';

import { useACL } from '../useACL';

const Provider = ReactReduxProvider as React.ComponentType<
  Omit<React.ComponentProps<typeof ReactReduxProvider>, 'children'>
>;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

it.each([
  { editTimeTrackByDelegate: true },
  { editTimeTrackByDelegate: false },
])(
  'should return editTimeTrack as true for employee who has %p',
  ({ editTimeTrackByDelegate }) => {
    // Arrange
    const store = mockStore({
      common: {
        accessControl: {
          permission: { ...defaultPermission, editTimeTrackByDelegate },
        },
      },
      entities: {
        user: {
          isDelegated: false,
        },
      },
    });

    // Act
    const { result } = renderHook(() => useACL(), {
      wrapper: (props: { [prop: string]: unknown }) => (
        <Provider {...props} store={store} />
      ),
    });

    // Assert
    expect(result.current.editTimeTrack).toBe(true);
  }
);

it('should return editTimeTrack as false for delegated employee who has no proper permissions', () => {
  // Arrange
  const store = mockStore({
    common: {
      accessControl: {
        permission: { ...defaultPermission, editTimeTrackByDelegate: false },
      },
    },
    entities: {
      user: {
        isDelegated: true,
      },
    },
  });

  // Act
  const { result } = renderHook(() => useACL(), {
    wrapper: (props: { [prop: string]: unknown }) => (
      <Provider {...props} store={store} />
    ),
  });

  // Assert
  expect(result.current.editTimeTrack).toBe(false);
});

it('should return editTimeTrack as true for delegated employee who has proper permissions', () => {
  // Arrange
  const store = mockStore({
    common: {
      accessControl: {
        permission: { ...defaultPermission, editTimeTrackByDelegate: true },
      },
    },
    entities: {
      user: {
        isDelegated: true,
      },
    },
  });

  // Act
  const { result } = renderHook(() => useACL(), {
    wrapper: (props: { [prop: string]: unknown }) => (
      <Provider {...props} store={store} />
    ),
  });

  // Assert
  expect(result.current.editTimeTrack).toBe(true);
});
