import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import stub from '../../../repositories/__tests__/mocks/dailyRecord.mock';
import DailyRecordRepository from '../../../repositories/DailyRecordRepository';

import reducer from '../../modules';

import timesheet from '../../__tests__/mocks/timesheet';
import * as DailyTimeTrack from '../DailyTimeTrack';
import expected from './DailyTimeTrack.expected';

jest.mock('../../../repositories/DailyRecordRepository');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('timesheet-pc/action-dispatchers/DailyTimeTrack', () => {
  describe('loadTimeTrackRecords()', () => {
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
      DailyRecordRepository.mockClear();
      // @ts-ignore
      DailyRecordRepository.search = jest.fn(() => stub);
    });

    test('it should start loading', async () => {
      // Run
      // @ts-ignore
      await store.dispatch(DailyTimeTrack.loadDailyTimeTrackRecords(timesheet));

      // @ts-ignore
      const startLoadingAction = store.getActions()[1];
      // @ts-ignore
      const state = reducer(mockInitialState, startLoadingAction);

      // Assert
      // @ts-ignore
      expect(state.ui.dailyTimeTrack.isLoading).toBe(true);
    });
    test('it should update state of dailyTimeTrack', async () => {
      // Run
      // @ts-ignore
      await store.dispatch(DailyTimeTrack.loadDailyTimeTrackRecords(timesheet));
      // @ts-ignore
      const state = store.getActions().reduce(reducer, mockInitialState);

      // Assert
      expect(state.entities.dailyTimeTrack).toEqual(expected);
    });
    test('it should end loading', async () => {
      // Run
      // @ts-ignore
      await store.dispatch(DailyTimeTrack.loadDailyTimeTrackRecords(timesheet));
      // @ts-ignore
      const state = store.getActions().reduce(reducer, mockInitialState);

      // Assert
      expect(state.ui.dailyTimeTrack.isLoading).toBe(false);
    });
    test('it should handle catchApiError', async () => {
      // Arrange
      DailyRecordRepository.search = jest.fn(() => {
        throw Error('TEST');
      });

      // Run
      // @ts-ignore
      await store.dispatch(DailyTimeTrack.loadDailyTimeTrackRecords(timesheet));
      // @ts-ignore
      const state = store.getActions().reduce(reducer, mockInitialState);

      // Assert
      expect(state.common.app.unexpectedError.message).toEqual('TEST');
    });
  });
});
