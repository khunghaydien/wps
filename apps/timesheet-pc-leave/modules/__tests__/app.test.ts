import dummyResponse from '../../../repositories/__tests__/mocks/response/att-leave-info-get';

import Api from '../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../__tests__/mocks/DispatcherMock';
import { actions } from '../app';

describe('actions', () => {
  describe('.initialize()', () => {
    describe('Success', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        // @ts-ignore
        jsdom.reconfigure({
          url: 'http://localhost:3000/dummy-url?targetDate=2018-02-01&targetEmployeeId=',
        });

        Api.setDummyResponse(
          '/att/leave-info/get',
          { targetDate: '2018-02-01', empId: '' },
          dummyResponse
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

      test('3. GET_USER_SETTING', () => {
        expect(dispatchMock.logged[3].type).toBe('GET_USER_SETTING');
      });

      test('4. MODULES/ENTITIES/LEAVE_INFO/FETCH_SUCCESS', () => {
        expect(dispatchMock.logged[4].type).toBe(
          'MODULES/ENTITIES/LEAVE_INFO/FETCH_SUCCESS'
        );
      });

      test('5. LOADING_END', () => {
        expect(dispatchMock.logged[5].type).toBe('LOADING_END');
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
