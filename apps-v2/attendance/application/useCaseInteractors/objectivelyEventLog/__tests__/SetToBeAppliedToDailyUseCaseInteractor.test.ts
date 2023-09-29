import DailyObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/DailyObjectivelyEventLogRepository';

import interactor from '../SetToBeAppliedToDailyUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ DailyObjectivelyEventLogRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do.', async () => {
  // Arrange
  const input = {
    id: 'id',
    records: [
      {
        enteringId: 'enteringId',
        leavingId: 'leavingId',
      },
    ],
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyObjectivelyEventLogRepository.setToBeApplied).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.setToBeApplied).toBeCalledWith(
    input
  );
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
