import configureMockStore from 'redux-mock-store';

import presenter from '../fetchList';
import { IOutputData } from '@attendance/domain/useCases/leave/IFetchListUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const mockStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('complete()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      targetDate: '2022-02-22',
    }).complete({
      targetDate: '2022-02-22',
      leaves: new Map(
        ['leave1', 'leave2', 'leave3'].map((value) => [value, value])
      ),
    } as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('error()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      targetDate: '2023-01-01',
    }).error({
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
    presenter(store as AppStore)({
      targetDate: '2023-01-01',
    }).start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)({
      targetDate: '2023-01-01',
    }).finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
