import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { REASON } from '@attendance/domain/models/Result';

import presenter from '../submitFixDailyRequestWithClockOut';
import { IOutputData } from '@attendance/domain/combinedUseCases/ISubmitFixDailyRequestWithClockOutUseCase';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('complete()', () => {
  it.each([
    {
      result: true,
      value: undefined,
    },
    {
      result: false,
      reason: REASON.UNEXPECTED,
    },
  ])('should do with result %s.', (outputData) => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)().complete(outputData as IOutputData);

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
