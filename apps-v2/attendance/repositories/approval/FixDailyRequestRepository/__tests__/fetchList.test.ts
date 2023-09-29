import ApprovalType from '@apps/domain/models/approval/ApprovalType';

import MockApi from '../../../../../../__tests__/mocks/ApiMock';
import fetchList from '../fetchList';
import * as fetchMock from './mocks/fetchList.mock';

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(fetchMock.defaultValue);

  // Act
  const result = await fetchList({
    employeeId: 'xxxx',
    approvalType: ApprovalType.ByEmployee,
  });

  // Assert
  expect(result).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request-list/fix-daily/get',
    param: { empId: 'xxxx', approvalType: ApprovalType.ByEmployee },
  });
});
