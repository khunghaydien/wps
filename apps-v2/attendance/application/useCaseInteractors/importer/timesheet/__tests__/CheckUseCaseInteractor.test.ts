import TimesheetRepository from '@attendance/application/__tests__/mocks/repositories/importer/TimesheetRepository';

import interactor from '../CheckUseCaseInteractor';

const mockCheck = TimesheetRepository.check as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  ImporterTimesheetRepository: TimesheetRepository,
})(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    startDate: 'startDate',
    endDate: 'endDate',
  };
  mockCheck.mockResolvedValue('result');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    startDate: 'startDate',
    endDate: 'endDate',
    errors: 'result',
  });
  expect(TimesheetRepository.check).toHaveBeenCalledTimes(1);
  expect(TimesheetRepository.check).toHaveBeenCalledWith(input);
});
