import { IEarlyLeaveReasonRepository } from '@attendance/domain/models/EarlyLeaveReason';

import fetchList from './fetchList';

const repository: IEarlyLeaveReasonRepository = {
  fetchList,
};

export default repository;
