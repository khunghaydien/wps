import Api from '../../../../../__tests__/mocks/ApiMock';
import fetchTable from '../fetchTable';
import { defaultValue } from './mocks/fetchTable.mock';

it('should return daily record display field layout.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const layoutTable = await fetchTable({
    employeeId: 'employeeId',
    startDate: '2022-12-01',
    endDate: '2022-12-31',
  });

  // Assert
  expect(layoutTable).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/record-display-fields/get',
    param: {
      empId: 'employeeId',
      startDate: '2022-12-01',
      endDate: '2022-12-31',
    },
  });
});
