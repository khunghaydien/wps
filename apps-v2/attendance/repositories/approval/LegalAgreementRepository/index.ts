import { ILegalAgreementRequestRepository } from '@apps/attendance/domain/models/approval/LegalAgreementRequest';

import fetch from './fetch';
import fetchList from './fetchList';

const repository: ILegalAgreementRequestRepository = {
  fetch,
  fetchList,
};

export default repository;
