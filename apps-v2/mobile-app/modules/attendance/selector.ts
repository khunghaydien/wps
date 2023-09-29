import { AttDailyRequest } from '@attendance/domain/models/AttDailyRequest';
import { Code } from '@attendance/domain/models/AttDailyRequestType';

import { State } from './index';

export const selectAvailableRequest = (
  state: State,
  requestTypeCode: Code
): AttDailyRequest | null | undefined =>
  state.dailyRequest.entities.availableRequests.find(
    (request) => request.requestTypeCode === requestTypeCode
  ) || null;

export const selectLatestRequest = (
  state: State,
  id: string
): AttDailyRequest | null | undefined =>
  state.dailyRequest.entities.latestRequests.find(
    (request) => request.id === id
  ) || null;
