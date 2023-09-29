import { LOADING_END, LOADING_START } from '../../../../../commons/actions/app';

import listDummyResponse from '../../../../../repositories/__tests__/mocks/response/att-annual-leave-grant-list';

import ApiMock from '../../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../../__tests__/mocks/DispatcherMock';
import { FETCH_SUCCESS as GRANT_HISTORY_LIST_FETCH_SUCCESS } from '../../detail-pane/entities/grant-history-list';
import reducer, {
  execute,
  EXECUTE_SUCCESS,
  HIDE,
  hide,
  initialState,
  SHOW,
  show,
  UPDATE_NEW_DAYS_GRANTED,
  updateNewDaysGranted,
} from '../ui';

describe('admin-pc/annual-paid-leave-management/update-dialog/ui', () => {
  describe('action', () => {
    describe('show', () => {
      test('should return action', () => {
        // @ts-ignore
        expect(show('xxxxxxx', '2017-01-01', '2019-01-01', 8.5)).toEqual({
          type: SHOW,
          payload: {
            targetGrantHistoryRecordId: 'xxxxxxx',
            targetGrantHistoryRecordValidDateFrom: '2017-01-01',
            targetGrantHistoryRecordValidDateTo: '2019-01-01',
            targetGrantHistoryRecordDaysGranted: 8.5,
          },
        });
      });
    });

    describe('hide', () => {
      test('should return action', () => {
        expect(hide()).toEqual({
          type: HIDE,
        });
      });
    });

    describe('updateNewDaysGranted', () => {
      test('should return action', () => {
        // @ts-ignore
        expect(updateNewDaysGranted(8)).toEqual({
          type: UPDATE_NEW_DAYS_GRANTED,
          payload: 8,
        });
      });
    });

    describe('execute ~ fetchGrantHistoryList ~ executeSuccess', () => {
      const targetEmployeeId = 'xxxxx';
      const targetDate = '2020-04-06';
      const targetGrantHistoryRecordId = 'xxxxxxx';

      ApiMock.setDummyResponse(
        '/att/annual-leave/grant/update',
        {
          grantId: targetGrantHistoryRecordId,
          daysGranted: 8,
        },
        {}
      );
      ApiMock.setDummyResponse(
        '/att/annual-leave/grant/list',
        {
          empId: targetEmployeeId,
          targetDate,
        },
        listDummyResponse
      );

      const dispatcherMock = new DispatcherMock();

      execute(
        targetEmployeeId,
        targetGrantHistoryRecordId,
        '8',
        targetDate
      )(dispatcherMock.dispatch);

      test('should show loading spinner', () => {
        expect(dispatcherMock.logged[0]).toEqual({
          type: LOADING_START,
        });
      });

      test('should update the list', () => {
        expect(dispatcherMock.logged[3]).toEqual({
          type: LOADING_START,
        });
        expect(dispatcherMock.logged[4]).toEqual({
          type: EXECUTE_SUCCESS,
        });
        expect(dispatcherMock.logged[5].type).toBe(
          GRANT_HISTORY_LIST_FETCH_SUCCESS
        );
      });

      test('should hide loading spinner', () => {
        expect(dispatcherMock.logged[6]).toEqual({
          type: LOADING_END,
        });
        expect(dispatcherMock.logged[7]).toEqual({
          type: LOADING_END,
        });
      });
    });
  });

  describe('reducer', () => {
    describe('SHOW', () => {
      test('should update state', () => {
        expect(
          reducer(initialState, {
            type: SHOW,
            payload: {
              targetGrantHistoryRecordId: 'xxxxxxx',
              targetGrantHistoryRecordValidDateFrom: '2017-01-01',
              targetGrantHistoryRecordValidDateTo: '2019-01-01',
              targetGrantHistoryRecordDaysGranted: 8.5,
            },
          })
        ).toEqual({
          isVisible: true,
          targetGrantHistoryRecordId: 'xxxxxxx',
          targetGrantHistoryRecordValidDateFrom: '2017-01-01',
          targetGrantHistoryRecordValidDateTo: '2019-01-01',
          targetGrantHistoryRecordDaysGranted: 8.5,
          newDaysGranted: '8.5',
        });
      });
    });

    describe('UPDATE_NEW_DAYS_GRANTED', () => {
      test('should update state', () => {
        expect(
          reducer(
            {
              isVisible: true,
              // @ts-ignore
              newDaysGranted: 10,
            },
            {
              type: UPDATE_NEW_DAYS_GRANTED,
              payload: 8,
            }
          ).newDaysGranted
        ).toBe(8);
      });
    });

    describe('HIDE', () => {
      test('should update state', () => {
        expect(
          reducer(
            {
              isVisible: true,
              // @ts-ignore
              newDaysGranted: 10,
            },
            {
              type: HIDE,
            }
          )
        ).toEqual(initialState);
      });
    });

    describe('EXECUTE_SUCCESS', () => {
      test('should update state', () => {
        expect(
          reducer(
            {
              isVisible: true,
              // @ts-ignore
              newDaysGranted: 10,
            },
            {
              type: EXECUTE_SUCCESS,
            }
          )
        ).toEqual(initialState);
      });
    });
  });
});
