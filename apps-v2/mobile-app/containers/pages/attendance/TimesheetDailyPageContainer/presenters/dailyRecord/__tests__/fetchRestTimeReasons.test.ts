import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import uuid from 'uuid/v4';

import Presenter from '../fetchRestTimeReasons';
import { IOutputData } from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';

jest.mock('uuid/v4');

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();

  let i = 1;
  (uuid as jest.Mock).mockImplementation(() => `${i++}`);
});

describe('complete()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});
    const presenter = Presenter(store)();

    // Act
    presenter.complete({
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
    const presenter = Presenter(store)();

    // Act
    presenter.error([
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
    const presenter = Presenter(store)();

    // Act
    presenter.error({
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
    const presenter = Presenter(store)();

    // Act
    presenter.start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});
    const presenter = Presenter(store)();

    // Act
    presenter.finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

it('should do with loadingId.', () => {
  // Arrange
  const store = mockStore({});
  const presenter = Presenter(store)();

  // Act
  presenter.start();
  presenter.finally();

  // Assert
  expect(store.getActions()).toMatchSnapshot();
});
