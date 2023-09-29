import DailyRecordRepository from '@attendance/application/__tests__/mocks/repositories/DailyRecordRepository';

import interactor from '../SaveFieldsUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ DailyRecordRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call save', async () => {
  // Arrange
  const input = {
    recordId: 'a0F6F00000qnEq7',
    values: [
      {
        objectName: 'AttRecord__c',
        objectItemName:
          'AttRecordEntendedItem__r.ExtendedItemNumeric01Value__c',
        value: '0.50',
      },
      {
        objectName: 'AttRecord__c',
        objectItemName:
          'AttRecordEntendedItem__r.ExtendedItemNumeric02Value__c',
        value: '0.3',
      },
    ],
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.saveFields).toBeCalledTimes(1);
  expect(DailyRecordRepository.saveFields).toBeCalledWith(input);
});
