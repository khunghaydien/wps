import configureMockStore from 'redux-mock-store';

import behavior from '../resetTimesheet';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('@attendance/timesheet-pc/UseCases');

const createStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do', async () => {
  // Arrange
  const store = createStore({});

  // Act
  await behavior(store)();

  // Assert
  expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
  expect(UseCases().fetchTimesheet).toBeCalledWith();
  expect(store.getActions()).toMatchSnapshot();
});
