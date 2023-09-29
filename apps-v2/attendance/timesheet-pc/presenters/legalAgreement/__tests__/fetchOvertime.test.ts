import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import presenter from '../fetchOvertime';
import { IOutputData } from '@attendance/domain/useCases/legalAgreement/IFetchOvertimeUseCase';

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
        targetDate: '2022-02-22',
        overTime: {
          monthlyOvertime: 'monthlyOvertime',
          yearlyOvertime: 'yearlyOvertime',
          legalAgreementWorkSystem: 'legalAgreementWorkSystem',
        },
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
