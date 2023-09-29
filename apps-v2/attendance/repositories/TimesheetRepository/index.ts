import { ITimesheetRepository } from '@attendance/domain/models/Timesheet';

import fetch from './fetch';
import fetchAvailableDailyRequest from './fetchAvailableDailyRequest';
import fetchRaw from './fetchRaw';

const repository: ITimesheetRepository = {
  fetch,
  fetchRaw,
  fetchAvailableDailyRequest,
};

export default repository;
