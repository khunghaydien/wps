import { ILateArrivalReasonRepository } from '@attendance/domain/models/LateArrivalReason';

import fetchList from './fetchList';

const repository: ILateArrivalReasonRepository = {
  fetchList,
};

export default repository;
