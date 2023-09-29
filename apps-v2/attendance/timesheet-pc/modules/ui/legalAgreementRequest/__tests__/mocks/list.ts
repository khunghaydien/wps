import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import request from './request';

export default {
  requests: [request],
  availableRequestTypes: [CODE.MONTHLY],
};
