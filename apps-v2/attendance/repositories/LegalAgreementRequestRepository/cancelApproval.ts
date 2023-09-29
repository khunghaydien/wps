import Api from '@apps/commons/api';

import { ILegalAgreementRequestRepository } from '../../domain/models/LegalAgreementRequest';

const cancelApproval: ILegalAgreementRequestRepository['cancelApproval'] =
  async (param): Promise<void> => {
    return await Api.invoke({
      path: '/att/request/legal-agreement/cancel-approval',
      param,
    });
  };
export default cancelApproval;
