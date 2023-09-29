import ObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/ObjectivelyEventLogRepository';

import { EVENT_TYPE } from '@attendance/domain/models/ObjectivelyEventLogRecord';

import interactor from '../CreateUseCaseInteractor';
import { time } from '@attendance/__tests__/helpers';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ ObjectivelyEventLogRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call create', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    targetDate: '2022-02-22',
    settingCode: 'settingCode',
    eventType: EVENT_TYPE.ENTERING,
    time: time(7, 0),
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(ObjectivelyEventLogRepository.create).toBeCalledTimes(1);
  expect(ObjectivelyEventLogRepository.create).toBeCalledWith(input);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
