import configureMockStore from 'redux-mock-store';

import behavior from '../cleanTimesheetRecords';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const createStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do', async () => {
  // Arrange
  const store = createStore({
    timesheet: {
      startDate: 'startDate',
      endDate: 'endDate',
    },
  });

  // Act
  await behavior(store as AppStore)();

  // Assert
  expect(store.getActions()).toMatchSnapshot();
});
