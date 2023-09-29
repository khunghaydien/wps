import { IAttDailyRequestDetailRepository } from '@attendance/domain/models/approval/AttDailyRequestDetail';

import fetch from './fetch';

const repository: IAttDailyRequestDetailRepository = {
  fetch,
};

export default repository;
