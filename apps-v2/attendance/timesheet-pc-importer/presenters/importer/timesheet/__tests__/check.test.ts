import configureMockStore from 'redux-mock-store';

import presenter from '../check';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const mockStore = configureMockStore([]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('complete()', () => {
  it('should do if result is true.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().complete({
      employeeId: 'employeeId',
      startDate: 'startDate',
      endDate: 'endDate',
      errors: new Map([['recordDate', ['serverError1']]]),
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('error()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().error({
      message: 'Error Test',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('start()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
