import DailyRecordRepository from '@attendance/application/__tests__/mocks/repositories/DailyRecordRepository';
import DailyStampTimeRepository from '@attendance/application/__tests__/mocks/repositories/DailyStampTimeRepository';

import interactor from '../PostUseCaseInteractor';
import { REASON } from '@attendance/domain/useCases/stampTime/IPostUseCase';

const Presenter = {
  complete: jest.fn(),
  confirmToComplementInsufficientingRestTime: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  DailyRecordRepository,
  DailyStampTimeRepository,
})(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  requiredLocation | location                                         | comment      | expected
  ${false}         | ${undefined}                                     | ${undefined} | ${true}
  ${false}         | ${null}                                          | ${undefined} | ${true}
  ${false}         | ${{ latitude: null, longitude: null }}           | ${undefined} | ${true}
  ${false}         | ${{ latitude: undefined, longitude: null }}      | ${undefined} | ${true}
  ${false}         | ${{ latitude: undefined, longitude: undefined }} | ${undefined} | ${true}
  ${false}         | ${{ latitude: 0, longitude: 0 }}                 | ${undefined} | ${true}
  ${false}         | ${{ latitude: 1, longitude: 1 }}                 | ${undefined} | ${true}
  ${true}          | ${undefined}                                     | ${undefined} | ${false}
  ${true}          | ${null}                                          | ${undefined} | ${false}
  ${true}          | ${{ latitude: null, longitude: null }}           | ${undefined} | ${false}
  ${true}          | ${{ latitude: undefined, longitude: null }}      | ${undefined} | ${false}
  ${true}          | ${{ latitude: undefined, longitude: undefined }} | ${undefined} | ${false}
  ${true}          | ${{ latitude: 0, longitude: 0 }}                 | ${undefined} | ${true}
  ${true}          | ${{ latitude: 1, longitude: 1 }}                 | ${undefined} | ${true}
  ${false}         | ${undefined}                                     | ${null}      | ${true}
  ${false}         | ${undefined}                                     | ${'abc'}     | ${true}
  ${true}          | ${undefined}                                     | ${null}      | ${false}
  ${true}          | ${undefined}                                     | ${'abc'}     | ${true}
  ${true}          | ${{ latitude: 1, longitude: 1 }}                 | ${'abc'}     | ${true}
`(
  'should be $expected when [requiredLocation=$requiredLocation, location=$location, comment=$comment]',
  async ({ requiredLocation, location, comment, expected }) => {
    // Arrange
    const input = {
      requiredLocation,
      location,
      comment,
    } as unknown as Parameters<typeof UseCase>[0];

    // Act
    const result = await UseCase(input);

    // Assert
    expect(result.result).toBe(expected);
    if (result.result === false) {
      expect(result.reason).toEqual(REASON.REQUIRED_COMMENT_WITHOUT_LOCATION);
      expect(DailyStampTimeRepository.post).toBeCalledTimes(0);
    } else {
      expect(DailyStampTimeRepository.post).toBeCalledTimes(1);
      expect(DailyStampTimeRepository.post).toBeCalledWith({
        location,
        comment,
      });
    }
  }
);

it.each([
  null,
  {},
  {
    insufficientRestTime: null,
  },
  {
    insufficientRestTime: 0,
  },
])('should not call fillRestTime()', async (response) => {
  // Arrange
  (DailyStampTimeRepository.post as jest.Mock).mockResolvedValueOnce(response);
  const input = { value: 'input' } as unknown as Parameters<typeof UseCase>[0];

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: {
      targetDate: undefined,
    },
  });
  expect(DailyStampTimeRepository.post).toBeCalledTimes(1);
  expect(DailyStampTimeRepository.post).toBeCalledWith({ value: 'input' });
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledTimes(
    0
  );
});

it('should call fillRestTime() if answer is yes', async () => {
  // Arrange
  (DailyStampTimeRepository.post as jest.Mock).mockResolvedValueOnce({
    targetDate: '2022-02-22',
    insufficientRestTime: 60,
  });
  Presenter.confirmToComplementInsufficientingRestTime.mockResolvedValueOnce(
    true
  );
  const input = { value: 'input' } as unknown as Parameters<typeof UseCase>[0];

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: {
      targetDate: '2022-02-22',
    },
  });
  expect(DailyStampTimeRepository.post).toBeCalledTimes(1);
  expect(DailyStampTimeRepository.post).toBeCalledWith({ value: 'input' });
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledTimes(
    1
  );
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledWith({
    insufficientRestTime: 60,
  });
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(1);
  expect(DailyRecordRepository.fillRestTime).toBeCalledWith({
    targetDate: '2022-02-22',
  });
});

it('should call fillRestTime() if answer is no', async () => {
  // Arrange
  (DailyStampTimeRepository.post as jest.Mock).mockResolvedValueOnce({
    insufficientRestTime: 60,
  });
  Presenter.confirmToComplementInsufficientingRestTime.mockResolvedValueOnce(
    false
  );
  const input = { value: 'input' } as unknown as Parameters<typeof UseCase>[0];

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: {
      targetDate: undefined,
    },
  });
  expect(DailyStampTimeRepository.post).toBeCalledTimes(1);
  expect(DailyStampTimeRepository.post).toBeCalledWith({ value: 'input' });
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledTimes(
    1
  );
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledWith({
    insufficientRestTime: 60,
  });
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
});

it('should call return value', async () => {
  // Arrange
  (DailyStampTimeRepository.post as jest.Mock).mockResolvedValueOnce({
    targetDate: '2022-02-22',
  });
  const input = { value: 'input' } as unknown as Parameters<typeof UseCase>[0];

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: {
      targetDate: '2022-02-22',
    },
  });
  expect(DailyStampTimeRepository.post).toBeCalledTimes(1);
  expect(DailyStampTimeRepository.post).toBeCalledWith({ value: 'input' });
});
