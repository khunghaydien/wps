import { IFixMonthlyRequestRepository } from '@attendance/domain/models/approval/FixMonthlyRequest';

import fetch from './fetch';

const repository: IFixMonthlyRequestRepository = {
  fetch,
};

export default repository;
