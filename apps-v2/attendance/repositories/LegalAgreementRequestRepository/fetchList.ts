import Api from '@apps/commons/api';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  ILegalAgreementRequestRepository,
  LegalAgreementRequestList,
} from '../../domain/models/LegalAgreementRequest';

const fetchList: ILegalAgreementRequestRepository['fetchList'] = async ({
  employeeId,
  targetDate,
}): Promise<LegalAgreementRequestList> => {
  const result: LegalAgreementRequestList = await Api.invoke({
    path: '/att/request/legal-agreement/list',
    param: {
      empId: employeeId,
      targetDate,
    },
  });
  return {
    ...result,
    requests: result.requests?.map((request) => ({
      ...request,
      changedOvertimeHoursLimit: TimeUtil.toHours(
        request?.changedOvertimeHoursLimit
      ),
    })),
  };
};
export default fetchList;
