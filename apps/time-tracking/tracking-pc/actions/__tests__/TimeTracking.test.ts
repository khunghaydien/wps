import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import TimeTracking from '../TimeTracking';

const initialState = {
  common: {
    empInfo: {
      startDayOfTheWeek: 0,
    },
  },
};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
beforeEach(() => {
  ApiMock.mockReturnValue({
    '/time-track/monthly/get': {
      status: 'NotRequested',
      startDate: '2019-12-23',
      requestId: null,
      records: [
        {
          recordItemList: [],
          recordDate: '2019-12-23',
          note: null,
        },
        {
          recordItemList: [],
          recordDate: '2019-12-24',
          note: null,
        },
        {
          recordItemList: [],
          recordDate: '2019-12-25',
          note: null,
        },
        {
          recordItemList: [],
          recordDate: '2019-12-26',
          note: null,
        },
        {
          recordItemList: [],
          recordDate: '2019-12-27',
          note: null,
        },
        {
          recordItemList: [],
          recordDate: '2019-12-28',
          note: null,
        },
        {
          recordItemList: [],
          recordDate: '2019-12-29',
          note: null,
        },
      ],
      periods: [
        {
          startDate: '2020-01-06',
          name: '2020年01月 1週目',
        },
        {
          startDate: '2019-12-30',
          name: '2019年12月 5週目',
        },
        {
          startDate: '2019-12-23',
          name: '2019年12月 4週目',
        },
        {
          startDate: '2019-12-16',
          name: '2019年12月 3週目',
        },
        {
          startDate: '2019-12-09',
          name: '2019年12月 2週目',
        },
        {
          startDate: '2019-12-02',
          name: '2019年12月 1週目',
        },
        {
          startDate: '2019-11-25',
          name: '2019年11月 4週目',
        },
        {
          startDate: '2019-11-18',
          name: '2019年11月 3週目',
        },
        {
          startDate: '2019-11-11',
          name: '2019年11月 2週目',
        },
        {
          startDate: '2019-11-04',
          name: '2019年11月 1週目',
        },
        {
          startDate: '2019-10-28',
          name: '2019年10月 4週目',
        },
        {
          startDate: '2019-10-21',
          name: '2019年10月 3週目',
        },
        {
          startDate: '2019-10-14',
          name: '2019年10月 2週目',
        },
        {
          startDate: '2019-10-07',
          name: '2019年10月 1週目',
        },
        {
          startDate: '2019-09-30',
          name: '2019年09月 5週目',
        },
      ],
      endDate: '2019-12-29',
    },
  });
});
afterEach(() => {
  ApiMock.reset();
});
describe('loadNextPeriod', () => {
  it('should dispatch actions to display time tracking at next period', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTracking = TimeTracking(store.dispatch);
    const currentPeriod = {
      startDate: '2019-12-23',
      endDate: '2019-12-29',
    };
    // Act
    await timeTracking.loadNextPeriod(currentPeriod);
    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should load time tracking at next period', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTracking = TimeTracking(store.dispatch);
    const currentPeriod = {
      startDate: '2019-12-23',
      endDate: '2019-12-29',
    };
    const startDateOfNextPeriod = '2019-12-30';
    // Act
    await timeTracking.loadNextPeriod(currentPeriod);
    // Assert
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      param: {
        targetDate: startDateOfNextPeriod,
      },
      path: '/time-track/monthly/get',
    });
  });
});
describe('loadPrevPeriod', () => {
  it('should dispatch actions to display time tracking at prev period', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTracking = TimeTracking(store.dispatch);
    const currentPeriod = {
      startDate: '2019-12-23',
      endDate: '2019-12-29',
    };
    // Act
    await timeTracking.loadPrevPeriod(currentPeriod);
    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should load time tracking at prev period', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTracking = TimeTracking(store.dispatch);
    const currentPeriod = {
      startDate: '2019-12-23',
      endDate: '2019-12-29',
    };
    const endDateOfPrevPeriod = '2019-12-22';
    // Act
    await timeTracking.loadPrevPeriod(currentPeriod);
    // Assert
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      param: {
        targetDate: endDateOfPrevPeriod,
      },
      path: '/time-track/monthly/get',
    });
  });
});
describe('loadCurrentPeriod', () => {
  it('should dispatch actions to display time tracking at current period', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTracking = TimeTracking(store.dispatch);
    const today = '2019-10-01';
    // Act
    await timeTracking.loadCurrentPeriod(today);
    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should load time tracking at current period', async () => {
    // Arrange
    const store = mockStore(initialState);
    const timeTracking = TimeTracking(store.dispatch);
    const today = '2019-10-01';
    // Act
    await timeTracking.loadCurrentPeriod(today);
    // Assert
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      param: {
        targetDate: today,
      },
      path: '/time-track/monthly/get',
    });
  });
});
