import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { showConfirm } from '@mobile/modules/commons/confirm';

import presenter from '../save';

jest.mock('uuid/v4');

jest.mock('@mobile/modules/commons/confirm', () => {
  return {
    __esModule: true,
    showConfirm: jest.fn(),
  };
});

jest.mock('@commons/modules/toast', () => {
  return {
    __esModule: true,
    showToast: jest.fn((args) => ({
      type: 'TEST/TOAST',
      payload: args,
    })),
  };
});

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe.each(['normal', 'noCompleteMessage'])('%s', (methodName) => {
  describe('complete()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store)[methodName]().complete(undefined);

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('error()', () => {
    it('should do', () => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store)
        [methodName]()
        .error([
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
      presenter(store)[methodName]().error({
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
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args) =>
          async (dispatch) => {
            dispatch({
              type: 'TEST/ASK',
              payload: args,
            });
            return true;
          }
      );

      // Act
      const result = await presenter(store)
        [methodName]()
        .confirmToComplementInsufficientingRestTime({
          insufficientRestTime: 60,
        });

      // Assert
      expect(result).toBe(true);
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should do when answer is no.', async () => {
      // Arrange
      const store = mockStore({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args) =>
          async (dispatch) => {
            dispatch({
              type: 'TEST/ASK',
              payload: args,
            });
            return false;
          }
      );

      // Act
      const result = await presenter(store)
        [methodName]()
        .confirmToComplementInsufficientingRestTime({
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
      presenter(store)[methodName]().start();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('finally()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store)[methodName]().finally();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
