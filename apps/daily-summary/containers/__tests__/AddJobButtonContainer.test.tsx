import React from 'react';
import { Provider } from 'react-redux';

import '@testing-library/jest-dom/extend-expect';
import { action } from '@storybook/addon-actions';
import { act, fireEvent, render } from '@testing-library/react';

import { CoreProvider } from '../../../core';

import TimeTrackJobRepository from '../../../repositories/time-tracking/TimeTrackJobRepository';

import AddJobButtonContainer from '../AddJobButtonContainer';
import createStore from './store';
import state from './store/state';

const unsort = action('action');

jest.mock('../../../repositories/time-tracking/TimeTrackJobRepository', () => {
  return {
    fetchAll: jest.fn(),
  };
});

beforeEach(() => {
  (TimeTrackJobRepository.fetchAll as jest.Mock).mockReset();
  (TimeTrackJobRepository.fetchAll as jest.Mock).mockImplementation(
    function* () {
      yield {
        id: '1',
        code: '1',
        name: '1',
        parentId: null,
        hasChildren: true,
      };
    }
  );
});

it('should open JobSelectDialog on click', async () => {
  // Arrange
  const testId = 'add-job-button';
  const store = createStore();
  const { getByTestId, queryByTestId } = render(
    <Provider store={store as any}>
      <CoreProvider>
        <AddJobButtonContainer data-testid={testId} unsort={unsort} />
      </CoreProvider>
    </Provider>
  );

  // Act
  const target = getByTestId(testId);
  await act(async () => {
    fireEvent.click(target);
  });

  // Assert
  const dialog = queryByTestId('time-tracking/JobSelectDialog');
  expect(dialog).not.toBeNull();
});

it('should display JobAddButton to users with appropriate permissions', () => {
  // Arrange
  const testId = 'add-job-button';
  const store = createStore({
    ...state,
    common: {
      ...state.common,
      accessControl: {
        ...state.common.accessControl,
        permission: {
          ...state.common.accessControl.permission,
          editTimeTrackByDelegate: true,
        },
      },
    },
    entities: {
      ...state.entities,
      user: {
        ...state.entities.user,
        isDelegated: true,
      },
    },
  });
  const { queryByTestId } = render(
    <Provider store={store as any}>
      <CoreProvider>
        <AddJobButtonContainer data-testid={testId} unsort={unsort} />
      </CoreProvider>
    </Provider>
  );

  // Act
  const target = queryByTestId(testId);

  // Assert
  expect(target).not.toBeNull();
});

it('should not display JobAddButton to users without appropriate permissions', () => {
  // Arrange
  const testId = 'add-job-button';
  const store = createStore({
    ...state,
    common: {
      ...state.common,
      accessControl: {
        ...state.common.accessControl,
        permission: {
          ...state.common.accessControl.permission,
          editTimeTrackByDelegate: false,
        },
      },
    },
    entities: {
      ...state.entities,
      user: {
        ...state.entities.user,
        isDelegated: true,
      },
    },
  });
  const { queryByTestId } = render(
    <Provider store={store as any}>
      <CoreProvider>
        <AddJobButtonContainer data-testid={testId} unsort={unsort} />
      </CoreProvider>
    </Provider>
  );

  // Act
  const target = queryByTestId(testId);

  // Assert
  expect(target).toBeNull();
});
