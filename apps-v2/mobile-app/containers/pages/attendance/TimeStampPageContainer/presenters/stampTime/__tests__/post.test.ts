import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import uuid from 'uuid/v4';

import { showConfirm } from '@mobile/modules/commons/confirm';

import { CLOCK_TYPE } from '@attendance/domain/models/DailyStampTime';

import Presenter from '../post';
import {
  IInputData,
  REASON,
} from '@attendance/domain/useCases/stampTime/IPostUseCase';

jest.mock('uuid/v4');
jest.mock('@commons/modules/toast', () => ({
  __esModule: true,
  showToast: jest.fn((value) => ({
    type: 'SHOW_TOAST',
    payload: value,
  })),
}));
jest.mock('@mobile/modules/commons/confirm', () => ({
  __esModule: true,
  showConfirm: jest.fn(),
}));
jest.mock('@mobile/modules/commons/error', () => ({
  __esModule: true,
  catchApiError: jest.fn((value) => ({
    type: 'CATCH_API_ERROR',
    payload: value.message,
  })),
}));

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();

  let i = 1;
  (uuid as jest.Mock).mockImplementation(() => `${i++}`);
});

describe.each(['normal', 'noCompleteMessage'])('%s', (methodName) => {
  describe('complete()', () => {
    describe.each(Object.values(CLOCK_TYPE))('clockType = %s', (clockType) => {
      it(`should do.`, () => {
        // Arrange
        const store = mockStore({});
        const presenter = Presenter(store)[methodName]({
          clockType,
        } as unknown as IInputData);

        // Act
        presenter.complete({
          result: true,
          value: { targetDate: 'targetDate' },
        });

        // Assert
        expect(store.getActions()).toMatchSnapshot();
      });
      it(`should do with sending.`, () => {
        // Arrange
        const store = mockStore({
          attendance: {
            timeStamp: {
              ui: {
                sending: true,
              },
            },
          },
        });
        const presenter = Presenter(store)[methodName]({
          clockType,
        } as unknown as IInputData);

        // Act
        presenter.complete({
          result: true,
          value: { targetDate: 'targetDate' },
        });

        // Assert
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    it('should show error', () => {
      // Arrange
      const store = mockStore({});
      const presenter = Presenter(store)[methodName](
        undefined as unknown as IInputData
      );

      // Act
      presenter.complete({
        result: false,
        reason: REASON.REQUIRED_COMMENT_WITHOUT_LOCATION,
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('error()', () => {
    it('should do', () => {
      // Arrange
      const store = mockStore({});
      const presenter = Presenter(store)[methodName](
        undefined as unknown as IInputData
      );

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
      const presenter = Presenter(store)[methodName](
        undefined as unknown as IInputData
      );

      // Act
      presenter.start();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('confirmToComplementInsufficientingRestTime()', () => {
    it('should do.', async () => {
      // Arrange
      const store = mockStore({});
      const presenter = Presenter(store)[methodName](
        undefined as unknown as IInputData
      );
      (showConfirm as unknown as jest.Mock).mockImplementation(
        (value) => async (dispatch) => {
          dispatch({
            type: 'SHOW_CONFIRM',
            payload: value,
          });
          return 'result';
        }
      );

      // Act
      const result = await presenter.confirmToComplementInsufficientingRestTime(
        {
          insufficientRestTime: 0,
        }
      );

      // Assert
      expect(result).toBe('result');
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('finally()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore({});
      const presenter = Presenter(store)[methodName](
        undefined as unknown as IInputData
      );

      // Act
      presenter.finally();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('should do with loadingId.', () => {
    // Arrange
    const store = mockStore({});
    const presenter = Presenter(store)[methodName](
      undefined as unknown as IInputData
    );

    // Act
    presenter.start();
    presenter.finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
