import { COUNT_TYPE } from '@apps/domain/models/approval/request/Request';

import MockApi from '../../../../../__tests__/mocks/ApiMock';
import fetchCount from '../fetchCount';

beforeEach(() => {
  (MockApi.invoke as jest.Mock).mockClear();
});

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce({
    attDailyRequestCount: 1,
    attFixDailyRequestCount: 2,
    attFixMonthlyRequestCount: 3,
    timeRequestCount: 4,
    expReportRequestCount: 5,
    expPreApprovalRequestCount: 6,
    attLegalAgreementRequestCount: 7,
  });

  // Act
  const result = await fetchCount({
    employeeId: 'employeeId',
    isDelegated: true,
    filterExpReqByCompanyId: 'companyId',
    type: COUNT_TYPE.ATT_FIX_DAILY,
  });

  // Assert
  expect(result).toEqual({
    attDailyRequestCount: 1,
    attFixDailyRequestCount: 2,
    attFixMonthlyRequestCount: 3,
    timeRequestCount: 4,
    expReportRequestCount: 5,
    expPreApprovalRequestCount: 6,
    attLegalAgreementRequestCount: 7,
  });
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/approval/request-count/get',
    param: {
      empId: 'employeeId',
      filterExpReqByCompanyId: 'companyId',
      isDelegatedApprover: true,
      approvalTypes: [COUNT_TYPE.ATT_FIX_DAILY],
    },
  });
});

it('should do if countType is array', async () => {
  // Arrange
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce({
    attDailyRequestCount: 1,
    attFixDailyRequestCount: 2,
    attFixMonthlyRequestCount: 3,
    timeRequestCount: 4,
    expReportRequestCount: 5,
    expPreApprovalRequestCount: 6,
    attLegalAgreementRequestCount: 7,
  });

  // Act
  const result = await fetchCount({
    employeeId: 'employeeId',
    isDelegated: true,
    filterExpReqByCompanyId: 'companyId',
    type: [COUNT_TYPE.ATT_FIX_DAILY, COUNT_TYPE.ATT_FIX_MONTHLY],
  });

  // Assert
  expect(result).toEqual({
    attDailyRequestCount: 1,
    attFixDailyRequestCount: 2,
    attFixMonthlyRequestCount: 3,
    timeRequestCount: 4,
    expReportRequestCount: 5,
    expPreApprovalRequestCount: 6,
    attLegalAgreementRequestCount: 7,
  });
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/approval/request-count/get',
    param: {
      empId: 'employeeId',
      filterExpReqByCompanyId: 'companyId',
      isDelegatedApprover: true,
      approvalTypes: [COUNT_TYPE.ATT_FIX_DAILY, COUNT_TYPE.ATT_FIX_MONTHLY],
    },
  });
});
