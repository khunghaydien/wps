import Api from '@apps/commons/api';

import { ILegalAgreementRequestRepository } from '../../domain/models/LegalAgreementRequest';

const cancelRequest: ILegalAgreementRequestRepository['cancelRequest'] = async (
  param
): Promise<void> => {
  return await Api.invoke({
    path: '/att/request/legal-agreement/cancel-request',
    param,
  });
};
export default cancelRequest;
