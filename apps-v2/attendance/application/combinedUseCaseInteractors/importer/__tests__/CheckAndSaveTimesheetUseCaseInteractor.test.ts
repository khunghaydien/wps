import { allDummyValue } from '@attendance/domain/models/importer/__tests__/mocks/Timesheet.mock';
import { REASON } from '@attendance/domain/models/Result';

import interactor from '../CheckAndSaveTimesheetUseCaseInteractor';

const UseCases = {
  saveTimesheet: jest.fn(),
  checkTimesheet: jest.fn(),
};

const Presenter = {
  confirmSubmittingWithoutErrorRecords: jest.fn(),
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor(UseCases)(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should return true if confirmSubmittingWithoutErrorRecords return true ', async () => {
  // Arrange
  const input = allDummyValue;
  UseCases.checkTimesheet.mockResolvedValue(null);
  UseCases.saveTimesheet.mockResolvedValue({
    result: true,
    value: undefined,
  });
  Presenter.confirmSubmittingWithoutErrorRecords.mockResolvedValue(true);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: undefined,
  });
  expect(UseCases.checkTimesheet).toHaveBeenCalledTimes(1);
  expect(UseCases.checkTimesheet).toHaveBeenCalledWith(input);
  expect(UseCases.saveTimesheet).toHaveBeenCalledTimes(1);
  expect(UseCases.saveTimesheet).toHaveBeenCalledWith(input);
  expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledTimes(
    1
  );
  expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledWith(
    null
  );
});

it('should return false if confirmSubmittingWithoutErrorRecords return false ', async () => {
  // Arrange
  const input = allDummyValue;
  UseCases.checkTimesheet.mockResolvedValue(null);
  UseCases.saveTimesheet.mockResolvedValue('record');
  Presenter.confirmSubmittingWithoutErrorRecords.mockResolvedValue(false);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: false,
    reason: REASON.USER_INDUCED,
  });
  expect(UseCases.checkTimesheet).toHaveBeenCalledTimes(1);
  expect(UseCases.checkTimesheet).toHaveBeenCalledWith(input);
  expect(UseCases.saveTimesheet).toHaveBeenCalledTimes(0);
  expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledTimes(
    1
  );
  expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledWith(
    null
  );
});

describe('With check error', () => {
  it('should call saveTimesheet with filtered errors', async () => {
    // Arrange
    const input = {
      ...allDummyValue,
      records: [
        { ...allDummyValue.records[0], recordDate: '2023-01-01' },
        { ...allDummyValue.records[0], recordDate: '2023-01-02' },
      ],
    };
    UseCases.checkTimesheet.mockResolvedValue({
      startDate: 'startDate',
      endDate: 'endDate',
      errors: new Map([
        ['2023-01-02', ['error1', 'error2']],
        ['2023-01-03', ['error1', 'error2']],
      ]),
    });
    UseCases.saveTimesheet.mockResolvedValue({
      result: true,
      value: undefined,
    });
    Presenter.confirmSubmittingWithoutErrorRecords.mockResolvedValue(true);

    // Act
    const result = await UseCase(input);

    // Assert
    expect(result).toEqual({
      result: true,
      value: undefined,
    });
    expect(UseCases.checkTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases.checkTimesheet).toHaveBeenCalledWith(input);
    expect(UseCases.saveTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases.saveTimesheet).toHaveBeenCalledWith({
      ...allDummyValue,
      records: [{ ...allDummyValue.records[0], recordDate: '2023-01-01' }],
    });
    expect(
      Presenter.confirmSubmittingWithoutErrorRecords
    ).toHaveBeenCalledTimes(1);
    expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledWith(
      {
        startDate: 'startDate',
        endDate: 'endDate',
        errors: new Map([
          ['2023-01-02', ['error1', 'error2']],
          ['2023-01-03', ['error1', 'error2']],
        ]),
      }
    );
  });

  it('should return true if confirmSubmittingWithoutErrorRecords return true ', async () => {
    // Arrange
    const input = {
      ...allDummyValue,
      records: [
        { ...allDummyValue.records[0], recordDate: '2023-01-01' },
        { ...allDummyValue.records[0], recordDate: '2023-01-02' },
        { ...allDummyValue.records[0], recordDate: '2023-01-03' },
      ],
    };
    UseCases.checkTimesheet.mockResolvedValue({
      startDate: 'startDate',
      endDate: 'endDate',
      errors: new Map([['2023-01-02', ['error1', 'error2']]]),
    });
    UseCases.saveTimesheet.mockResolvedValue({
      result: true,
      value: undefined,
    });
    Presenter.confirmSubmittingWithoutErrorRecords.mockResolvedValue(true);

    // Act
    const result = await UseCase(input);

    // Assert
    expect(result).toEqual({
      result: true,
      value: undefined,
    });
    expect(UseCases.checkTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases.checkTimesheet).toHaveBeenCalledWith(input);
    expect(UseCases.saveTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases.saveTimesheet).toHaveBeenCalledWith({
      ...allDummyValue,
      records: [
        { ...allDummyValue.records[0], recordDate: '2023-01-01' },
        { ...allDummyValue.records[0], recordDate: '2023-01-03' },
      ],
    });
    expect(
      Presenter.confirmSubmittingWithoutErrorRecords
    ).toHaveBeenCalledTimes(1);
    expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledWith(
      {
        startDate: 'startDate',
        endDate: 'endDate',
        errors: new Map([['2023-01-02', ['error1', 'error2']]]),
      }
    );
  });

  it('should return false if confirmSubmittingWithoutErrorRecords return false ', async () => {
    // Arrange
    const input = {
      ...allDummyValue,
      records: [
        { ...allDummyValue.records[0], recordDate: '2023-01-01' },
        { ...allDummyValue.records[0], recordDate: '2023-01-02' },
        { ...allDummyValue.records[0], recordDate: '2023-01-03' },
      ],
    };
    UseCases.checkTimesheet.mockResolvedValue({
      startDate: 'startDate',
      endDate: 'endDate',
      errors: new Map([['2023-01-02', ['error1', 'error2']]]),
    });
    UseCases.saveTimesheet.mockResolvedValue('record');
    Presenter.confirmSubmittingWithoutErrorRecords.mockResolvedValue(false);

    // Act
    const result = await UseCase(input);

    // Assert
    expect(result).toEqual({
      result: false,
      reason: REASON.USER_INDUCED,
    });
    expect(UseCases.checkTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases.checkTimesheet).toHaveBeenCalledWith(input);
    expect(UseCases.saveTimesheet).toHaveBeenCalledTimes(0);
    expect(
      Presenter.confirmSubmittingWithoutErrorRecords
    ).toHaveBeenCalledTimes(1);
    expect(Presenter.confirmSubmittingWithoutErrorRecords).toHaveBeenCalledWith(
      {
        startDate: 'startDate',
        endDate: 'endDate',
        errors: new Map([['2023-01-02', ['error1', 'error2']]]),
      }
    );
  });
});
