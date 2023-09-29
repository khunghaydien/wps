import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import presenter from '../fetchRestTimeReasons';
import { IOutputData } from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';

jest.mock('@apps/commons/actions/app', () => {
  const original = jest.requireActual('@apps/commons/actions/app');
  return {
    __esModule: true,
    ...original,
    confirm: jest.fn(),
  };
});

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('complete()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store).complete({
      restReasons: 'restReasons',
    } as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('error()', () => {
  it('should do', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store).error([
      {
        message: 'Error Test 1',
      },
      {
        message: 'Error Test 2',
      },
    ]);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should do if Error is Array', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store).error({
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
    presenter(store).start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store).finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
