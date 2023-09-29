import Api from '@apps/commons/api';

import {
  ILegalAgreementRequestRepository,
  Status,
} from '@apps/attendance/domain/models/approval/LegalAgreementRequest';
import { Code } from '@attendance/domain/models/LegalAgreementRequestType';

type Response = {
  requestList: {
    id: string;
    employeeName: string;
    delegatedEmployeeName: string | null;
    photoUrl: string;
    departmentName: string | null;
    approverName: string;
    approverPhotoUrl: string;
    approverDepartmentName: string | null;
    requestDate: string;
    targetMonth: string;
    requestType: Code;
    requestStatus: Status;
    originalRequestStatus: Status;
  }[];
};

const fetchList: ILegalAgreementRequestRepository['fetchList'] = async (
  approvalType,
  selectId
) => {
  const response: Response = await Api.invoke({
    path: '/att/request-list/legal-agreement/get',
    param: { approvalType, selectId },
  });
  return response.requestList;
};

export default fetchList;
