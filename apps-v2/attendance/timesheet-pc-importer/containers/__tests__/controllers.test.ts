import configureMockStore from 'redux-mock-store';

import DateUtil from '@apps/commons/utils/DateUtil';

import createControllers from '../controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';

jest.mock('@attendance/timesheet-pc-importer/UseCases');
jest.spyOn(DateUtil, 'getToday').mockImplementation(() => '2023-01-01');

const mockStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('initialize', () => {
  it('should call', async () => {
    // Arrange
    const store = mockStore({});
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.initialize();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(UseCases().fetchUserSetting).toHaveBeenCalledTimes(1);
    expect(UseCases().fetchUserSetting).toHaveBeenCalledWith();
  });
});
