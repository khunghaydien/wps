import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MAX_STANDARD_REST_TIME_COUNT } from '@apps/attendance/domain/models/RestTime';

import presenter from '../fetch';
import {
  IInputData,
  IOutputData,
} from '@attendance/domain/useCases/timesheet/IFetchEntityUseCase';

jest.mock('uuid/v4');

const mockStore = configureMockStore([thunk]);

describe('complete()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)(undefined as unknown as IInputData).complete({
      employeeId: 'employeeId',
      timesheet: {
        workingType: {
          useObjectivelyEventLog: true,
        },
      },
      maxRestTimesCount: MAX_STANDARD_REST_TIME_COUNT,
    } as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should do with isMigratedSummary.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)(undefined as unknown as IInputData).complete({
      employeeId: 'employeeId',
      timesheet: {
        isMigratedSummary: true,
      },
      dailyObjectivelyEventLogs: 'dailyObjectivelyEventLogs',
    } as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
describe('error()', () => {
  it('should do catchApiError if error is not occurred', async () => {
    // Arrange
    const store = mockStore({
      common: {
        app: {
          error: null,
        },
      },
    });

    // Act
    presenter(store)(undefined as unknown as IInputData).error({
      message: 'Error Test',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should not do catchApiError if error is occurred', async () => {
    // Arrange
    const store = mockStore({
      common: {
        app: {
          error: 'error',
        },
      },
    });

    // Act
    presenter(store)(undefined as unknown as IInputData).error({
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
    presenter(store)(undefined as unknown as IInputData).start();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('finally()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenter(store)(undefined as unknown as IInputData).finally();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
