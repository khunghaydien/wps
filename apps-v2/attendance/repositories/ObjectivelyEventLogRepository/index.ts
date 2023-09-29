import { IObjectivelyEventLogRepository } from '@attendance/domain/models/ObjectivelyEventLog';

import create from './create';
import fetch from './fetch';
import remove from './remove';

const repository: IObjectivelyEventLogRepository = {
  create,
  remove,
  fetch,
};

export default repository;
