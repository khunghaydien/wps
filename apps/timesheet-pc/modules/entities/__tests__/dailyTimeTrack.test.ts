import keyBy from 'lodash/keyBy';

import { snapshot } from './dailyTimeTrack.snapshot';

import dailyTimeTrack from '../../../__tests__/mocks/dailyTimeTrack';
import timesheet from '../../../__tests__/mocks/timesheet';
import reducer, { actions } from '../dailyTimeTrack';

describe('timesheet-pc/modules/dailyTimeTrack', () => {
  describe('reducer', () => {
    describe('FETCH_SUCCESS', () => {
      test('it should create a map with date as key', () => {
        // Arrange
        const initialState = {};
        const fetchSuccess = actions.fetchSuccess(
          // @ts-ignore
          dailyTimeTrack,
          timesheet
        );
        const expected = timesheet.records.map((record) => record.recordDate);

        // Run
        const state = reducer(initialState, fetchSuccess);
        const actual = Object.keys(state);

        // Assert
        expect(actual).toEqual(expected);
      });
      test('it should create a map with DailyRecord as value', () => {
        // Arrange
        const initialState = {};
        const fetchSuccess = actions.fetchSuccess(
          // @ts-ignore
          dailyTimeTrack,
          timesheet
        );
        const recordMap = keyBy(
          timesheet.records,
          (record) => record.recordDate
        );
        const expected = dailyTimeTrack.map((track) => ({
          ...track,
          realWorkTime: recordMap[track.targetDate].realWorkTime,
          totalTaskTime: track.time,
        }));

        // Run
        const state = reducer(initialState, fetchSuccess);
        const actual = Object.values(state);

        // Assert
        expect(actual).toEqual(expected);
      });
      test('it should create a state matching with snapshot', () => {
        // Arrange
        const initialState = {};
        const fetchSuccess = actions.fetchSuccess(
          // @ts-ignore
          dailyTimeTrack,
          timesheet
        );
        const expected = snapshot;

        // Run
        const actual = reducer(initialState, fetchSuccess);

        // Assert
        expect(actual).toEqual(expected);
      });
    });
    describe('UPDATE_RECORDS', () => {
      test('it shuold update DailyRecords with a given periods', () => {
        // Arrange
        const initialState = {};
        const records = [
          {
            status: null,
            recordDate: '2019-05-12',
            output: null,
            note: null,
            dailyRecordItemList: [
              {
                workCategoryName: '',
                workCategoryId: null,
                workCategoryCode: null,
                taskTime: null,
                taskNote: null,
                ratio: 100,
                jobName: '002 - お寿司の醤油のキャップをしめる仕事',
                jobId: 'a0V6F00000yJp0aUAC',
                jobCode: '002',
              },
              {
                workCategoryName: 'テストD',
                workCategoryId: 'a0o6F00000ZxCBiQAN',
                workCategoryCode: 'E010',
                taskTime: 310,
                taskNote: null,
                ratio: null,
                jobName: '004 - 自宅の警備員の仕事',
                jobId: 'a0V6F00000yJsUuUAK',
                jobCode: '004',
              },
            ],
            targetDate: '2019-05-12',
            time: 310,
          },
        ];
        const expected = {
          status: null,
          recordDate: '2019-05-12',
          output: null,
          note: null,
          dailyRecordItemList: keyBy(records, (record) => record.recordDate)[
            '2019-05-12'
          ].dailyRecordItemList,
          targetDate: '2019-05-12',
          time: 310,
          realWorkTime: null,
          totalTaskTime: 310,
        };

        // Run
        const state = reducer(
          initialState,
          actions.fetchSuccess(
            // @ts-ignore
            dailyTimeTrack,
            timesheet
          )
        );
        const nextState = reducer(
          state,
          actions.updateRecords(
            // @ts-ignore
            records,
            timesheet
          )
        );
        const actual = nextState['2019-05-12'];

        // Assert
        expect(actual).toEqual(expected);
      });
    });
  });
});
