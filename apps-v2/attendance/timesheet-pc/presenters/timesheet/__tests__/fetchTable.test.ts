import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import presenter from '../fetchTable';
import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchTableUseCase';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('reload', () => {
  describe('complete()', () => {
    it('should do.', () => {
      // Arrange
      const store = mockStore({});

      // Act
      presenter(store).complete({
        startDate: '2022-12-01',
        endDate: '2022-12-31',
        layoutTable: 'layoutTable',
      } as unknown as IOutputData);

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('error()', () => {
    it('should do.', () => {
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
});
