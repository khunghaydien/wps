import Api from '../../../../../__tests__/mocks/ApiMock';
import save from '../saveFields';

it('should do submit.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await save({
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
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/record-field/save',
    param: {
      attRecordId: 'a0F6F00000qnEq7',
      valueList: [
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
    },
  });
});
