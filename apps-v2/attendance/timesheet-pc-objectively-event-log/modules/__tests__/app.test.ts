import dummyResponse from '@attendance/repositories/__tests__/mocks/att-daily-objectively-event-log-get';
import dummyResponseHeader from '@attendance/repositories/__tests__/mocks/att-daily-objectively-event-log-header';

import { actions } from '../../action-dispatchers/app';

import Api from '../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../__tests__/mocks/DispatcherMock';

describe('actions', () => {
  describe('.initialize()', () => {
    describe('Success', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        // @ts-ignore
        jsdom.reconfigure({
          url: 'http://localhost:3000/dummy-url?startDate=2022-02-01&endDate=2022-02-28&targetEmployeeId=',
        });

        Api.setDummyResponse(
          '/att/daily-objectively-event-log/get',
          { startDate: '2022-02-01', endDate: '2022-02-28', empId: '' },
          dummyResponse
        );
        Api.setDummyResponse(
          '/att/employee/get',
          { targetDate: '2022-02-01', empId: '' },
          dummyResponseHeader
        );
        Api.setDummyResponse('/user-setting/get', {}, { language: 'ja' });

        return actions.initialize()(dispatchMock.dispatch);
      });

      test('1. Called Promise.all()', () => {
        expect(typeof dispatchMock.logged[0]).toBe('function');
        expect(typeof dispatchMock.logged[1]).toBe('function');
      });

      test('2. LOADING_START', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_START');
      });

      test('3. Func', () => {
        expect(typeof dispatchMock.logged[3]).toBe('function');
      });

      test('4. LOADING_START', () => {
        expect(dispatchMock.logged[4].type).toBe('LOADING_START');
      });

      test('5. GET_USER_SETTING', () => {
        expect(dispatchMock.logged[5].type).toBe('GET_USER_SETTING');
      });
      test('7. MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_SUCCESS', () => {
        expect(dispatchMock.logged[6].type).toBe(
          'MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_SUCCESS'
        );
      });
      test('6. MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_HEADER_SUCCESS', () => {
        expect(dispatchMock.logged[7].type).toBe(
          'MODULES/ENTITIES/DAILY_OBJECTIVELYEVENTLOG/FETCH_HEADER_SUCCESS'
        );
      });
      test('8. LOADING_END', () => {
        expect(dispatchMock.logged[8].type).toBe('LOADING_END');
      });
      test('9. LOADING_END', () => {
        expect(dispatchMock.logged[9].type).toBe('LOADING_END');
      });
    });
  });

  describe('.openPrintDialog()', () => {
    const mockWindowPrint = jest.fn();

    beforeAll(() => {
      window.print = mockWindowPrint;
      actions.openPrintDialog()();
    });

    test('calls window.open', () => {
      expect(mockWindowPrint.mock.calls).toEqual([[]]);
    });
  });
});
