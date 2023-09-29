import ObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/ObjectivelyEventLogRepository';

import interactor from '../RemoveUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ ObjectivelyEventLogRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call remove', async () => {
  // Arrange
  const input = 'id';

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(ObjectivelyEventLogRepository.remove).toBeCalledTimes(1);
  expect(ObjectivelyEventLogRepository.remove).toBeCalledWith(input);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
