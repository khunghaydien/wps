import Api from '@apps/commons/api';

import { ILegalAgreementRequestRepository } from '../../domain/models/LegalAgreementRequest';

const submit: ILegalAgreementRequestRepository['submit'] = async (
  param
): Promise<void> => {
  return await Api.invoke({
    path: '/att/request/legal-agreement/submit',
    param,
  });
};
export default submit;
