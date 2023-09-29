import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import stub from '../../../../repositories/__tests__/mocks/dailyAllowance.mock';
import DailyAllowanceRecordRepository from '@attendance/repositories/AttDailyAllowanceRecordRepository';

import reducer from '../../modules';

import timesheet from '../../__tests__/mocks/timesheet';
import * as DailyAllowance from '../DailyAllowance';
import expected from './DailyAllowance.expected';

jest.mock('@attendance/repositories/AttDailyAllowanceRecordRepository');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('timesheet-pc/action-dispatchers/DailyAllowance', () => {
  describe('loadDailyAllowanceRecords()', () => {
    const mockInitialState = {
      common: {
        app: {
          loadingDepth: 0,
        },
      },
    };
    let store = {};
    beforeEach(() => {
      // Arrange
      store = mockStore(mockInitialState);
      // @ts-ignore
      DailyAllowanceRecordRepository.mockClear();
      // @ts-ignore
      DailyAllowanceRecordRepository.search = jest.fn(() => stub);
    });

    test('it should start loading', async () => {
      // Run
      // @ts-ignore
      await store.dispatch(DailyAllowance.loadDailyAllowanceRecords(timesheet));

      // @ts-ignore
      const startLoadingAction = store.getActions()[1];
      // @ts-ignore
      const state = reducer(mockInitialState, startLoadingAction);

      // Assert
      // @ts-ignore
      expect(state.ui.dailyAllowance.isLoading).toBe(true);
    });
    test('it should update state of dailyAllowance', async () => {
      // Run
      // @ts-ignore
      await store.dispatch(DailyAllowance.loadDailyAllowanceRecords(timesheet));
      // @ts-ignore
      const state = store.getActions().reduce(reducer, mockInitialState);

      // Assert
      expect(state.entities.dailyAllowance).toEqual(expected);
    });
    test('it should end loading', async () => {
      // Run
      // @ts-ignore
      await store.dispatch(DailyAllowance.loadDailyAllowanceRecords(timesheet));
      // @ts-ignore
      const state = store.getActions().reduce(reducer, mockInitialState);

      // Assert
      expect(state.ui.dailyAllowance.isLoading).toBe(false);
    });
    test('it should handle catchApiError', async () => {
      // Arrange
      DailyAllowanceRecordRepository.search = jest.fn(() => {
        throw Error('TEST');
      });

      // Run
      // @ts-ignore
      await store.dispatch(DailyAllowance.loadDailyAllowanceRecords(timesheet));
      // @ts-ignore
      const state = store.getActions().reduce(reducer, mockInitialState);

      // Assert
      expect(state.common.app.unexpectedError.message).toEqual('TEST');
    });
  });
});
