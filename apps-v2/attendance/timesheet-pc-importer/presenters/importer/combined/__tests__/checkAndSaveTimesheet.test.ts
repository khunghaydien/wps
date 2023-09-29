import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { confirm } from '@commons/actions/app';

import { REASON } from '@attendance/domain/models/Result';

import presenter from '../checkAndSaveTimesheet';
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

describe('confirmSubmittingWithoutErrorRecords()', () => {
  it('should return true if errors are nothing.', () => {
    // Arrange
    const store = mockStore({
      timesheet: {
        records: new Map([['recordDate', {}]]),
      },
    });

    // Act
    presenter(store as AppStore)().confirmSubmittingWithoutErrorRecords(null);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should call confirm with errors.', async () => {
    // Arrange
    const store = mockStore({
      timesheet: {
        records: new Map([
          [
            'recordDate',
            {
              checked: true,
              errors: 'error',
            },
          ],
        ]),
      },
    });
    (confirm as jest.Mock).mockImplementation((...args) => (dispatch) => {
      dispatch({
        type: 'TEST:CONFIRM',
        payload: args,
      });
      return 'result';
    });

    // Act
    const result = await presenter(
      store as AppStore
    )().confirmSubmittingWithoutErrorRecords(null);

    // Assert
    expect(result).toEqual('result');
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('complete()', () => {
  it('should do if result is true.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().complete({ result: true, value: undefined });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should do if result is false.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store as AppStore)().complete({
      result: false,
      reason: REASON.USER_INDUCED,
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
