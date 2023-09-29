import configureMockStore from 'redux-mock-store';

import createControllers from '../controllers';
import Events from '@attendance/timesheet-pc-importer/Events';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const mockStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('selectEmployee', () => {
  it('should call', async () => {
    // Arrange
    const publish = jest.spyOn(Events.selectedEmployee, 'publish');
    const store = mockStore({});
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.selectEmployee({
      id: 'employeeId',
      departmentCode: 'departmentCode',
      departmentName: 'departmentName',
      employeeCode: 'employeeCode',
      employeeName: 'employeeName',
      employeePhotoUrl: 'employeePhotoUrl',
      title: 'title',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(publish).toHaveBeenCalledWith({
      id: 'employeeId',
      departmentCode: 'departmentCode',
      departmentName: 'departmentName',
      employeeCode: 'employeeCode',
      employeeName: 'employeeName',
      employeePhotoUrl: 'employeePhotoUrl',
      title: 'title',
    });
  });
});
