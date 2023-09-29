import { IFixDailyRequestRepository } from '@attendance/domain/models/approval/FixDailyRequest';

import fetch from './fetch';
import fetchList from './fetchList';

const repository: IFixDailyRequestRepository = {
  fetchList,
  fetch,
};

export default repository;
