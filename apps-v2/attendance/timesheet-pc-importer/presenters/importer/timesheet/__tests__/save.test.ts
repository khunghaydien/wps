import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { REASON } from '@attendance/domain/models/Result';

import presenter from '../save';
import { IOutputData } from '@attendance/domain/useCases/importer/timesheet/ISaveUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

jest.mock('@commons/actions/app', () => {
  const original = jest.requireActual('@commons/actions/app');
  return {
    ...original,
    __esModules: true,
    confirm: jest.fn(),
  };
});

jest.mock('@commons/modules/toast', () => ({
  __esModules: true,
  showToast: (...args) => ({
    type: 'TEST:SHOW_TOAST',
    payload: args,
  }),
}));

const mockStore = configureMockStore([thunkMiddleware]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('complete()', () => {
  it('should do if return true.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().complete({
      result: true,
      value: undefined,
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should do if return false.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().complete({
      result: false,
      reason: REASON.NO_RECORD,
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should do if return false and unknown reason.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().complete({
      result: false,
      reason: REASON.UNEXPECTED,
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
