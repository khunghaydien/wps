import DailyObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/DailyObjectivelyEventLogRepository';

import interactor from '../SaveDailyDeviationReasonUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ DailyObjectivelyEventLogRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call create', async () => {
  // Arrange
  const input = {
    id: 'objectivityEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'entering',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'leaving',
    },
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    input
  );
});
