/* eslint-disable @typescript-eslint/no-empty-function */
import { isSameDay } from 'date-fns';

import DateUtil from '../../../commons/utils/DateUtil';

import STATUS from '../../../domain/models/approval/request/Status';

import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../DailySummary';
import dailySummary, {
  invalidRatioTotalTasks,
} from './mocks/dailySummary.mock';
import dailyTime from './mocks/dailyTime.mock';
import events from './mocks/events.mock';
import personalSetting from './mocks/personalSetting.mock';
import Store from './mocks/Store';

jest.mock('uuid/v4', () => () => 1);

describe('DailySummary', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  describe('openDailySummary()', () => {
    it('should dispatch actions to leave if targetDate is today', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/get': dailySummary,
        '/planner/event/get': events,
        '/att/daily-time/get': dailyTime,
        '/personal-setting/get': personalSetting,
      });

      DateUtil.isToday = jest.fn((targetDate) =>
        isSameDay(new Date(targetDate), new Date(2020, 1, 4))
      );

      const store = Store.create();

      await store.dispatch(actions.openDailySummary('2020-02-04'));

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch actions not to leave if targetDate is not today', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/get': dailySummary,
        '/planner/event/get': events,
        '/att/daily-time/get': dailyTime,
        '/personal-setting/get': personalSetting,
      });

      DateUtil.isToday = jest.fn((targetDate) =>
        isSameDay(new Date(targetDate), new Date(2020, 1, 4))
      );

      const store = Store.create();

      await store.dispatch(actions.openDailySummary('2020-02-05'));

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch actions to notify error if api throws error', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/get': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
          stackTrace: 'aaaa',
        }),
        '/planner/event/get': events,
        '/att/daily-time/get': dailyTime,
        '/personal-setting/get': personalSetting,
      });

      const store = Store.create();

      await store.dispatch(actions.openDailySummary('2020-02-05'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveDailySummary()', () => {
    it('should dispatch to save daily summary', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/save': { isSuccess: true, result: null },
      });
      const dailySummary = {
        targetDate: '2020-02-05',
        useWorkReportByJob: false,
        status: STATUS.NotRequested,
        note: '',
        output: '',
        realWorkTime: null,
        isTemporaryWorkTime: null,
        taskList: [],
      };

      const store = Store.create();

      await store.dispatch(actions.saveDailySummary(dailySummary, () => {}));

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch to notify error if ratio total is not 100%', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/save': { isSuccess: true, result: null },
      });
      const dailySummary = {
        targetDate: '2020-02-05',
        useWorkReportByJob: false,
        status: STATUS.NotRequested,
        note: '',
        output: '',
        realWorkTime: null,
        isTemporaryWorkTime: null,
        taskList: invalidRatioTotalTasks,
      };

      const store = Store.create();

      await store.dispatch(
        actions.saveDailySummary(dailySummary as any, () => {})
      );

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch actions to notify error if api throws error', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/save': new ErrorResponse({
          code: 'FATAL',
          message: 'Server not responded',
          stackTrace: 'aaaa',
        }),
      });
      const dailySummary = {
        targetDate: '2020-02-05',
        useWorkReportByJob: false,
        status: STATUS.NotRequested,
        note: '',
        output: '',
        realWorkTime: null,
        isTemporaryWorkTime: null,
        taskList: [],
      };

      const store = Store.create();

      await store.dispatch(actions.saveDailySummary(dailySummary, () => {}));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('saveDailySummaryAndLeaveWork()', () => {
    it('should dispatch to save daily summary and leave', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/save': { isSuccess: true, result: null },
        '/att/daily-time/stamp': { insufficientRestTime: 0 },
      });
      const dailySummary = {
        targetDate: '2020-02-05',
        useWorkReportByJob: false,
        status: STATUS.NotRequested,
        note: '',
        output: '',
        realWorkTime: null,
        isTemporaryWorkTime: null,
        taskList: [],
      };

      const store = Store.create();

      await store.dispatch(
        actions.saveDailySummaryAndLeaveWork(
          dailySummary,
          '',
          'Weekly',
          () => {}
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch to reload daily summary if plannerDefaultView is daily', async () => {
      ApiMock.mockReturnValue({
        '/daily-summary/save': { isSuccess: true, result: null },
        '/att/daily-time/stamp': { insufficientRestTime: 0 },
        '/daily-summary/get': dailySummary,
        '/planner/event/get': events,
        '/personal-setting/get': personalSetting,
      });
      const dailySummaryDummy = {
        targetDate: '2020-02-05',
        useWorkReportByJob: false,
        status: STATUS.NotRequested,
        note: '',
        output: '',
        realWorkTime: null,
        isTemporaryWorkTime: null,
        taskList: [],
      };

      const store = Store.create();

      await store.dispatch(
        actions.saveDailySummaryAndLeaveWork(
          dailySummaryDummy,
          '',
          'Daily',
          () => {}
        )
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
