import { IAttendanceSummaryRepository } from '@attendance/domain/models/AttendanceSummary';

import fetch from './fetch';

const repository: IAttendanceSummaryRepository = {
  fetch,
};

export default repository;
