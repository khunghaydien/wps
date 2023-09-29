import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';

import presenter from '../fetchDaily';
import { IOutputData } from '@attendance/domain/useCases/objectivelyEventLog/IFetchDailyUseCase';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();
});

const dummyState = {
  ui: {
    dailyAttTimeDialog: '',
  },
};

describe('reload', () => {
  describe('complete()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore(dummyState);

      // Act
      presenter(store)
        .reload()
        .complete({
          targetDate: '2022-02-22',
          dailyObjectivelyEventLog: 'dailyObjectivelyEventLog',
        } as unknown as IOutputData);

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('error()', () => {
    describe('initialize', () => {
      it('should do catchApiError', async () => {
        // Arrange
        const store = mockStore({
          ...dummyState,
          common: {
            app: {
              error: 'error',
            },
          },
        });

        // Act
        presenter(store).reload().error({
          message: 'Error Test',
        });

        // Assert
        expect(store.getActions()).toMatchSnapshot();
      });

      it('should not do catchApiError if error is occurred', async () => {
        // Arrange
        const store = mockStore({
          ...dummyState,
          common: {
            app: {
              error: 'error',
            },
          },
          entities: {
            timesheet: {
              dailyObjectivelyEventLogs: 'dailyObjectivelyEventLogs',
            },
          },
        });

        // Act
        presenter(store).reload().error({
          message: 'Error Test',
        });

        // Assert
        expect(store.getActions()).toMatchSnapshot();
      });
    });
    describe('reload', () => {
      it('should do catchApiError if error was not occurred already', async () => {
        // Arrange
        const store = mockStore({
          ...dummyState,
          common: {
            app: {
              error: null,
            },
          },
          entities: {
            timesheet: {
              dailyObjectivelyEventLogs: 'dailyObjectivelyEventLogs',
            },
          },
        });

        // Act
        presenter(store).reload().error({
          message: 'Error Test',
        });

        // Assert
        expect(store.getActions()).toMatchSnapshot();
      });

      it('should not do catchApiError if error was occurred yet', async () => {
        // Arrange
        const store = mockStore({
          ...dummyState,
          common: {
            app: {
              error: 'error',
            },
          },
          entities: {
            timesheet: {
              dailyObjectivelyEventLogs: 'dailyObjectivelyEventLogs',
            },
          },
        });

        // Act
        presenter(store).reload().error({
          message: 'Error Test',
        });

        // Assert
        expect(store.getActions()).toMatchSnapshot();
      });
    });
  });

  describe('start()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore(dummyState);

      // Act
      presenter(store).reload().start();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('finally()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore(dummyState);

      // Act
      presenter(store).reload().finally();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('loading', () => {
    it('should use globalLoading', () => {
      // Arrange
      const state = cloneDeep(dummyState);
      state.ui.dailyAttTimeDialog = 'id';
      const store = mockStore(state);
      const $presenter = presenter(store).reload();

      // Act
      $presenter.start();
      $presenter.finally();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
    it('should use only pageLoading', () => {
      // Arrange
      const state = cloneDeep(dummyState);
      state.ui.dailyAttTimeDialog = '';
      const store = mockStore(state);
      const $presenter = presenter(store).reload();

      // Act
      $presenter.start();
      $presenter.finally();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});

describe('reloadOneRecord', () => {
  describe('complete()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store).reloadOneRecord.complete({
        targetDate: '2022-02-22',
        dailyObjectivelyEventLog: 'dailyObjectivelyEventLog',
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
      presenter(store).reloadOneRecord.error({
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
      presenter(store).reloadOneRecord.error({
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
      presenter(store).reloadOneRecord.start();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('finally()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store).reloadOneRecord.finally();

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
