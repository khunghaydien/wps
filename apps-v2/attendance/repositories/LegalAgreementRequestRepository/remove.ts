import Api from '@apps/commons/api';

import { ILegalAgreementRequestRepository } from '../../domain/models/LegalAgreementRequest';

const remove: ILegalAgreementRequestRepository['remove'] = async (
  param
): Promise<boolean> => {
  const result = await Api.invoke({
    path: '/att/request/legal-agreement/remove',
    param,
  });
  return !!result;
};
export default remove;
