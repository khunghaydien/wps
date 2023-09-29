import Api from '../../../../../__tests__/mocks/ApiMock';
import fetchList from '../fetchList';
import { defaultValue } from './mocks/fetchList.mock';

it('should return legalAgreement request list.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const list = await fetchList({
    employeeId: 'employeeId',
    targetDate: '2022-09-23',
  });

  // Assert
  expect(list).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/legal-agreement/list',
    param: {
      empId: 'employeeId',
      targetDate: '2022-09-23',
    },
  });
});
