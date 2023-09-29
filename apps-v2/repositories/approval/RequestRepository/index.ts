import { IRequestRepository } from '@apps/domain/models/approval/request/Request';

import approve from './approve';
import fetchCount from './fetchCount';
import reject from './reject';

const repository: IRequestRepository = {
  approve,
  reject,
  fetchCount,
};

export default repository;
