/* eslint-disable @typescript-eslint/no-empty-function */
import { isSameDay } from 'date-fns';

import DateUtil from '../../../../commons/utils/DateUtil';

import ApiMock, { ErrorResponse } from '../../../../../__tests__/mocks/ApiMock';
import * as actions from '../DailyAllowance';
import dailyAllowance from './mocks/dailyAllowance.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('DailyAllowance', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  describe('loadDailyAllowanceAllRecords()', () => {
    it('should dispatch actions to leave if targetDate is today', async () => {
      ApiMock.mockReturnValue({
        '/att/daily-allowance/list': dailyAllowance,
      });

      DateUtil.isToday = jest.fn((targetDate) =>
        isSameDay(new Date(targetDate), new Date(2021, 12, 20))
      );

      const store = Store.create();

      const dailyAllowanceList = [];

      await store.dispatch(
        actions.loadDailyAllowanceAllRecords('2021-12-20', dailyAllowanceList)
      );

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch actions not to leave if targetDate is not today', async () => {
      ApiMock.mockReturnValue({
        '/att/daily-allowance/list': dailyAllowance,
      });

      DateUtil.isToday = jest.fn((targetDate) =>
        isSameDay(new Date(targetDate), new Date(2021, 12, 20))
      );

      const store = Store.create();

      await store.dispatch(
        actions.loadDailyAllowanceAllRecords('2021-12-04', [])
      );

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch actions to notify error if api throws error', async () => {
      ApiMock.mockReturnValue({
        '/att/daily-allowance/list': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
          stackTrace: 'aaaa',
        }),
      });

      const store = Store.create();

      await store.dispatch(
        actions.loadDailyAllowanceAllRecords('2021-12-01', [])
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveDailyAllowanceRecord()', () => {
    it('should dispatch to save daily summary', async () => {
      ApiMock.mockReturnValue({
        '/att/daily-allowance/save': { isSuccess: true, result: null },
      });
      const dailyAllowance = [
        {
          order: null,
          managementType: 'Quantity',
          allowanceName:
            'qwertyuiopasdfghjklzxcvbnm,qwertyuiopasdfghjkl;zxcvbnm,.',
          allowanceId: 'a2a1y000000AAFQAA4',
          allowanceCode: 'qwerrtyuiopasdfhjkl',
          startTime: null,
          endTime: null,
          totalTime: null,
          quantity: null,
          isSelected: false,
        },
        {
          allowanceId: 'a2a1y000000A8OZAA0',
          allowanceName: 'wjm3',
          allowanceCode: 'wjm3',
          managementType: 'Hours',
          order: null,
          startTime: null,
          endTime: null,
          totalTime: 180,
          quantity: null,
          isSelected: true,
        },
      ];

      const targetDate = '2020-02-05';

      const store = Store.create();

      await store.dispatch(
        actions.saveDailyAllowanceRecord(dailyAllowance, () => {}, targetDate)
      );

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch to notify error if ratio total is not 100%', async () => {
      ApiMock.mockReturnValue({
        '/att/daily-allowance/save': { isSuccess: true, result: null },
      });
      const dailyAllowance = [
        {
          order: null,
          managementType: 'Quantity',
          allowanceName:
            'qwertyuiopasdfghjklzxcvbnm,qwertyuiopasdfghjkl;zxcvbnm,.',
          allowanceId: 'a2a1y000000AAFQAA4',
          allowanceCode: 'qwerrtyuiopasdfhjkl',
          startTime: null,
          endTime: null,
          totalTime: null,
          quantity: null,
          isSelected: false,
        },
      ];

      const targetDate = '2021-12-01';

      const store = Store.create();

      await store.dispatch(
        actions.saveDailyAllowanceRecord(
          dailyAllowance as any,
          () => {},
          targetDate
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch actions to notify error if api throws error', async () => {
      ApiMock.mockReturnValue({
        '/att/daily-allowance/save': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
          stackTrace: 'aaaa',
        }),
      });
      const dailyAllowance = [
        {
          order: null,
          managementType: 'Quantity',
          allowanceName:
            'qwertyuiopasdfghjklzxcvbnm,qwertyuiopasdfghjkl;zxcvbnm,.',
          allowanceId: 'a2a1y000000AAFQAA4',
          allowanceCode: 'qwerrtyuiopasdfhjkl',
          startTime: null,
          endTime: null,
          totalTime: null,
          quantity: null,
          isSelected: false,
        },
      ];

      const targetDate = '2021-12-11';

      const store = Store.create();

      await store.dispatch(
        actions.saveDailyAllowanceRecord(dailyAllowance, () => {}, targetDate)
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
