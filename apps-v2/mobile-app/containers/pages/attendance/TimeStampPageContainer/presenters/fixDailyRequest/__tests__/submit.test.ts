import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import uuid from 'uuid/v4';

import { REASON } from '@attendance/domain/models/Result';

import presenter from '../submit';
import { IOutputData } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';

jest.mock('uuid/v4');

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();

  let i = 1;
  (uuid as jest.Mock).mockImplementation(() => `${i++}`);
});

describe('complete()', () => {
  it.each([
    { result: true },
    { result: false, reason: REASON.EXISTED_INVALID_REQUEST },
    { result: false, reason: REASON.EXISTED_SUBMITTING_REQUEST },
  ] as IOutputData[])('should do %s.', (output) => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)().complete(output);

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

    // Act
    presenter(store)().complete({ result: true, value: undefined });

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
