import dummyResponse from '@attendance/repositories/__tests__/mocks/att-daily-objectively-event-log-get';
import dummyResponseHeader from '@attendance/repositories/__tests__/mocks/att-daily-objectively-event-log-header';

import Api, {
  ErrorResponse,
} from '../../../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../../../__tests__/mocks/DispatcherMock';
import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../index';

describe('actions', () => {
  describe('.fetch(startDate, endDate, targetEmployeeId)', () => {
    describe('Success', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/daily-objectively-event-log/get',
          {
            startDate: '2022-02-01',
            endDate: '2022-02-28',
            empId: null,
          },
          dummyResponse
        );

        return actions.fetch('2022-02-01', '2022-02-28')(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_SUCCESS', () => {
        expect(dispatchMock.logged[1].type).toBe(
          'MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_SUCCESS'
        );
      });

      test('3. LOADING_END', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_END');
      });
    });

    describe('Error', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/daily-objectively-event-log/get',
          {
            startDate: '2022-02-01-Error',
            endDate: '2022-02-28-Error',
            empId: null,
          },
          new ErrorResponse({ message: 'Dummy Message' })
        );

        return actions.fetch(
          '2022-02-01-Error',
          '2022-02-28-Error'
        )(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. CATCH_API_ERROR', () => {
        expect(dispatchMock.logged[1].type).toBe('CATCH_API_ERROR');
      });

      test('3. LOADING_END', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_END');
      });
    });
  });
  describe('.fetchHeader(startDate, targetEmployeeId)', () => {
    describe('Success', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/employee/get',
          {
            targetDate: '2022-02-01',
            empId: null,
          },
          dummyResponseHeader
        );

        return actions.fetchHeader('2022-02-01')(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_HEADER_SUCCESS', () => {
        expect(dispatchMock.logged[1].type).toBe(
          'MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_HEADER_SUCCESS'
        );
      });

      test('3. LOADING_END', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_END');
      });
    });

    describe('HeaderError', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/employee/get',
          {
            targetDate: '2022-02-01-Error',
            empId: null,
          },
          new ErrorResponse({ message: 'HEADER Dummy Message' })
        );

        return actions.fetchHeader('2022-02-01-Error')(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. CATCH_API_ERROR', () => {
        expect(dispatchMock.logged[1].type).toBe('CATCH_API_ERROR');
      });

      test('3. LOADING_END', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_END');
      });
    });
  });
});

describe('reducer', () => {
  const stateKeys = ['dailyRecordList', 'employeeInfoList', 'period'];

  describe('(initial)', () => {
    test('returns correct shape', () => {
      const initialState = reducer(undefined, {});
      expect(Object.keys(initialState).sort()).toEqual(stateKeys);
    });
  });
});
