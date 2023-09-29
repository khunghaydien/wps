import { ILegalAgreementRequestRepository } from '../../domain/models/LegalAgreementRequest';

import cancelApproval from './cancelApproval';
import cancelRequest from './cancelRequest';
import fetchList from './fetchList';
import reapply from './reapply';
import remove from './remove';
import submit from './submit';

export default {
  fetchList,
  submit,
  cancelRequest,
  cancelApproval,
  remove,
  reapply,
} as ILegalAgreementRequestRepository;
