import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ApiMock, { ErrorResponse } from '../../../../../__tests__/mocks/ApiMock';
import SummaryTask from '../SummaryTask';

afterEach(() => {
  ApiMock.reset();
});

describe('SummaryTask', () => {
  describe('update', () => {
    test('should dispatch actions to show error about transfer period', async () => {
      // arrange
      ApiMock.mockReturnValue({
        '/time-track/summary-task/update': {},
      });
      const store = configureMockStore([thunk])();
      const { update } = SummaryTask(store.dispatch);
      const param: Parameters<typeof update>[0] = {
        summaryId: 'id',
        empId: 'empId',
        startDate: '2020-05-17',
        endDate: '2020-05-01',
        sourceJobId: 'source',
        destinationJobId: 'destination',
      };

      const destinationTask: Parameters<typeof update>[1] = {
        jobId: 'jobId',
        jobCode: 'jobCode',
        jobName: 'jobName',
        validTo: '2020-05-01',
        validFrom: '2020-05-13',
        workCategoryId: 'workCategoryId',
        workCategoryCode: 'workCategoryCode',
        workCategoryName: 'workCategoryName',
      };

      // act
      await update(param, destinationTask, () => {});

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });

    test('should dispatch actions to display success toast', async () => {
      // arrange
      ApiMock.mockReturnValue({
        '/time-track/summary-task/update': {
          isSuccess: true,
          dateList: [
            {
              targetDate: '2021-04-01',
              reason: 'SUCCESS',
            },
          ],
        },
      });
      const store = configureMockStore([thunk])();
      const { update } = SummaryTask(store.dispatch);
      const param: Parameters<typeof update>[0] = {
        summaryId: 'id',
        empId: 'empId',
        endDate: '2020-05-17',
        startDate: '2020-05-01',
        sourceJobId: 'source',
        destinationJobId: 'destination',
      };

      const destinationTask: Parameters<typeof update>[1] = {
        jobId: 'jobId',
        jobCode: 'jobCode',
        jobName: 'jobName',
        validTo: '2020-05-01',
        validFrom: '2020-05-13',
        workCategoryId: 'workCategoryId',
        workCategoryCode: 'workCategoryCode',
        workCategoryName: 'workCategoryName',
      };

      // act
      await update(param, destinationTask, () => {});

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });

    test('should dispatch actions to display error', async () => {
      // arrange
      ApiMock.mockReturnValue({
        '/time-track/summary-task/update': new ErrorResponse({
          code: 'FATAL',
          message: 'permission denied',
          stackTrace: 'aaaa',
        }),
      });
      const store = configureMockStore([thunk])();
      const { update } = SummaryTask(store.dispatch);
      const param: Parameters<typeof update>[0] = {
        summaryId: 'id',
        empId: 'empId',
        endDate: '2020-05-17',
        startDate: '2020-05-01',
        sourceJobId: 'source',
        destinationJobId: 'destination',
      };

      const destinationTask: Parameters<typeof update>[1] = {
        jobId: 'jobId',
        jobCode: 'jobCode',
        jobName: 'jobName',
        validTo: '2020-05-01',
        validFrom: '2020-05-13',
        workCategoryId: 'workCategoryId',
        workCategoryCode: 'workCategoryCode',
        workCategoryName: 'workCategoryName',
      };

      // act
      await update(param, destinationTask, () => {});

      // assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  test('should dispatch actions to multiple error', async () => {
    // arrange
    ApiMock.mockReturnValue({
      '/time-track/summary-task/update': {
        isSuccess: false,
        dateList: [
          {
            targetDate: '2021-04-01',
            reason: 'INVALID_JOB_IN_TIME_TRACKING',
          },
          {
            targetDate: '2021-04-02',
            reason: 'INVALID_JOB_IN_TIME_TRACKING',
          },
          {
            targetDate: '2021-04-03',
            reason: 'INVALID_TERM_IN_WORK_CATEGORY',
          },
        ],
      },
    });
    const store = configureMockStore([thunk])();
    const { update } = SummaryTask(store.dispatch);
    const param: Parameters<typeof update>[0] = {
      summaryId: 'id',
      empId: 'empId',
      endDate: '2020-05-17',
      startDate: '2020-05-01',
      sourceJobId: 'source',
      destinationJobId: 'destination',
    };

    const destinationTask: Parameters<typeof update>[1] = {
      jobId: 'jobId',
      jobCode: 'jobCode',
      jobName: 'jobName',
      validTo: '2020-05-01',
      validFrom: '2020-05-13',
      workCategoryId: 'workCategoryId',
      workCategoryCode: 'workCategoryCode',
      workCategoryName: 'workCategoryName',
    };

    // act
    await update(param, destinationTask, () => {});

    // assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
