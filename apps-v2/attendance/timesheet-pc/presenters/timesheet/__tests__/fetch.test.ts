import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import presenters from '../fetch';
import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';

const mockStore = configureMockStore([thunk]);

describe('complete()', () => {
  it('should do.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenters(store).complete({
      employeeId: 'employeeId',
      timesheet: {
        workingType: {
          useObjectivelyEventLog: true,
        },
      },
    } as unknown as IOutputData);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should do with isMigratedSummary.', () => {
    // Arrange
    const store = mockStore({});

    // Act
    presenters(store).complete({
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
    presenters(store).error({
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
    presenters(store).error({
      message: 'Error Test',
    });

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
