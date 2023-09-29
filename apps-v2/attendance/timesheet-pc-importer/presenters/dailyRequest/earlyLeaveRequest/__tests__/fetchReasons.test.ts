import configureMockStore from 'redux-mock-store';

import presenter from '../fetchReasons';
import { IOutputData } from '@attendance/domain/useCases/dailyRequest/earlyLeaveRequest/IFetchReasonsUseCase';
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
      reasons: ['reason1', 'reason2', 'reason3'],
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
