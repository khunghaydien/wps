import Api from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { defaultValue } from './mocks/fetch.mock';

it('should return legalAgreement request overtime.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const overtime = await fetch({
    employeeId: 'employeeId',
    targetDate: '2022-09-23',
  });

  // Assert
  expect(overtime).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/legal-agreement/overtime/get',
    param: {
      empId: 'employeeId',
      targetDate: '2022-09-23',
    },
  });
});
