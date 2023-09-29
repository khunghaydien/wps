import Api from '@apps/commons/api';

import { ILegalAgreementRequestRepository } from '../../domain/models/LegalAgreementRequest';

const reapply: ILegalAgreementRequestRepository['reapply'] = async (
  param
): Promise<void> => {
  return await Api.invoke({
    path: '/att/request/legal-agreement/reapply',
    param,
  });
};
export default reapply;
