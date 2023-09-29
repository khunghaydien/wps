import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { parse } from 'date-fns';

import ApiMock, { ErrorResponse } from '../../../../__tests__/mocks/ApiMock';
import TimeTrackAlert from '../TimeTrackAlert';

const initialState = {
  common: {
    empInfo: {
      startDayOfTheWeek: 0,
    },
  },
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('loadTimeTrackAlerts()', () => {
  // Arrange
  beforeEach(() => {
    ApiMock.mockImplement('/time-track/alert/list', [
      [
        { startDate: '2019-10-01', endDate: '2019-11-01' },
        {
          records: [
            {
              targetDate: '2019-10-01',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-02',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-03',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-04',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-07',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-08',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-09',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
            {
              targetDate: '2019-10-10',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
          ],
        },
      ],
      [
        { startDate: '2019-12-01', endDate: '2020-01-01', empId: 'testempid' },
        {
          alerts: [
            {
              targetDate: '2012-12-19',
              alerts: [
                {
                  level: 'Warn',
                  code: 'TIME_ATT_CONSISTENCY',
                },
              ],
            },
          ],
        },
      ],
      [
        { startDate: '2020-07-01', endDate: '2020-08-01' },
        new ErrorResponse({ errorCode: 'test ' }),
      ],
    ]);
  });

  afterEach(() => {
    ApiMock.reset();
  });

  it('should dispatch actions to fetch alerts of inconsistency of time tracking and work hours', async () => {
    // Arrange
    const today = parse('2019-11-02');
    const store = mockStore(initialState);
    const timeTrackAlert = TimeTrackAlert(store.dispatch);

    // Act
    await timeTrackAlert.loadTimeTrackAlerts(
      {
        startDate: parse('2019-10-01'),
        endDate: parse('2019-11-01'),
      },
      undefined,
      today
    );

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should load alerts as delegated employee', async () => {
    // Arrange
    const today = parse('2019-11-02');
    const store = mockStore(initialState);
    const timeTrackAlert = TimeTrackAlert(store.dispatch);

    // Act
    await timeTrackAlert.loadTimeTrackAlerts(
      { startDate: parse('2019-12-01'), endDate: parse('2020-01-01') },
      'testempid',
      today
    );

    // Assert
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      param: {
        startDate: '2019-12-01',
        endDate: '2020-01-01',
        empId: 'testempid',
      },
      path: '/time-track/alert/list',
    });
  });

  it('it should load alerts occurred before or equal today', async () => {
    // Arrange
    const today = parse('2019-10-2');
    const store = mockStore(initialState);
    const timeTrackAlert = TimeTrackAlert(store.dispatch);

    // Act
    await timeTrackAlert.loadTimeTrackAlerts(
      {
        startDate: parse('2019-10-01'),
        endDate: parse('2019-11-01'),
      },
      undefined,
      today
    );

    // Assert
    const actual = store
      .getActions()
      .map(({ payload }) => Object.keys(payload));
    expect(actual).toStrictEqual([['2019-10-01', '2019-10-02']]);
  });

  it('throws api error, then it should catch the error and continue the following process', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTrackAlert = TimeTrackAlert(store.dispatch);

    // Act
    await timeTrackAlert.loadTimeTrackAlerts({
      startDate: parse('2020-07-01'),
      endDate: parse('2020-08-01'),
    });

    // Assert
    const action = store.getActions()[0];
    expect(action.payload.isContinuable).toBe(true);
  });
});
