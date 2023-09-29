import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import uuid from 'uuid/v4';

import { showConfirm } from '@mobile/modules/commons/confirm';

import presenter from '../cancelSubmitted';
import { IOutputData } from '@attendance/domain/useCases/fixDailyRequest/ICancelSubmittedUseCase';

jest.mock('uuid/v4');

jest.mock('@mobile/modules/commons/confirm', () => ({
  __esModule: true,
  showConfirm: jest.fn(),
}));

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();

  let i = 1;
  (uuid as jest.Mock).mockImplementation(() => `${i++}`);
});

describe('confirm()', () => {
  it.each([true, false])('should do if return value is %s.', async (value) => {
    // Arrange
    const store = mockStore({});
    (showConfirm as jest.Mock).mockImplementationOnce(
      (payload) => (dispatch) => {
        dispatch({
          type: 'confirm',
          payload,
        });
        return Promise.resolve(value);
      }
    );

    // Act
    await presenter(store)().confirm();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('complete()', () => {
  it.each([
    { result: true },
    {
      result: false,
      reason: 'userInduced',
    },
  ])('should do with result %s.', (outputData) => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)().complete(outputData as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('error()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)().error({
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
    presenter(store)().start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)().finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
