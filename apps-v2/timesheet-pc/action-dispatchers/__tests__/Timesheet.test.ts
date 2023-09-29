import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import dummyAvailableDailyRequestResponseResult from '../../../repositories/__tests__/mocks/response/att__available-daily-request__list';
import dummyResponseResult from '../../../repositories/__tests__/mocks/response/timesheet-get--fixed-time';

import Api from '../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../__tests__/mocks/DispatcherMock';
import { AppDispatch } from '../AppThunk';
import * as TimesheetActions from '../Timesheet';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  Api.invoke.mockClear();
});

describe('fetchTimesheet()', () => {
  const dispatcher = new DispatcherMock();

  Api.setDummyResponse(
    '/att/timesheet/get',
    {
      targetDate: '2017-07-01',
      empId: null,
    },
    dummyResponseResult
  );

  it('should call setTimesheetItems Action', async () => {
    await TimesheetActions.fetchTimesheet('2017-07-01')(dispatcher.dispatch);

    expect(dispatcher.logged).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'TIMESHEET-PC/ENTITIES/TIMESHEET/SET_TIMESHEET_ITEMS',
        }),
      ])
    );
  });
  it('should not affect any other records', async () => {
    const timesheet = await TimesheetActions.fetchTimesheet('2017-07-01')(
      dispatcher.dispatch
    );

    const actualAttRecord = timesheet.records.filter(
      (record) => record.id !== '3'
    );

    const expectAttRecord = dummyResponseResult.records.filter(
      (record) => record.id !== '3'
    );

    expect(actualAttRecord).toEqual(expectAttRecord);
  });
});

describe('fetchTimesheetAndAvailableDailyRequest()', () => {
  it('should fetch timesheet and availableRequestTypeCodesMap', async () => {
    Api.invoke
      .mockReturnValueOnce(dummyResponseResult)
      .mockReturnValueOnce(dummyAvailableDailyRequestResponseResult);
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(
      TimesheetActions.fetchTimesheetAndAvailableDailyRequest(
        '2017-06-01',
        'employeeId'
      )
    );

    // Assert
    expect(Api.invoke).nthCalledWith(1, {
      path: '/att/timesheet/get',
      param: {
        targetDate: '2017-06-01',
        empId: 'employeeId',
      },
    });
    expect(Api.invoke).nthCalledWith(2, {
      path: '/att/daily-request/available/list',
      param: {
        targetDate: '2017-06-01',
        empId: 'employeeId',
      },
    });
    expect(store.getActions()).toMatchSnapshot();
  });
});
