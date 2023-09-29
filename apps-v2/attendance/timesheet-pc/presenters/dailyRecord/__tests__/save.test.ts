import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { confirm } from '../../../../../commons/actions/app';

import { AppDispatch } from '@attendance/timesheet-pc/action-dispatchers/AppThunk';

import presenter from '../save';

jest.mock('../../../../../commons/actions/app', () => {
  const original = jest.requireActual('../../../../../commons/actions/app');
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
    presenter(store).complete(undefined);

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

describe('confirmToComplementInsufficientingRestTime()', () => {
  it('should do when answer is yes.', async () => {
    // Arrange
    const store = mockStore({});
    (confirm as jest.Mock).mockImplementationOnce(
      (...args) =>
        async (dispatch: AppDispatch) => {
          dispatch({
            type: 'TEST/ASK',
            payload: args,
          });
          return true;
        }
    );

    // Act
    const result = await presenter(
      store
    ).confirmToComplementInsufficientingRestTime({
      insufficientRestTime: 60,
    });

    // Assert
    expect(result).toBe(true);
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should do when answer is no.', async () => {
    // Arrange
    const store = mockStore({});
    (confirm as jest.Mock).mockImplementationOnce(
      (...args) =>
        async (dispatch: AppDispatch) => {
          dispatch({
            type: 'TEST/ASK',
            payload: args,
          });
          return false;
        }
    );

    // Act
    const result = await presenter(
      store
    ).confirmToComplementInsufficientingRestTime({
      insufficientRestTime: 60,
    });

    // Assert
    expect(result).toBe(false);
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
