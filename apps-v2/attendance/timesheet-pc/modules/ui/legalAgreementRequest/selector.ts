import { createSelector } from 'reselect';

import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import { State } from './index';

export const targetState = createSelector(
  (s: State) => s.editing.requestType,
  (s: State) => s.requests,
  (requestType, requests) => {
    switch (requestType) {
      case CODE.MONTHLY:
        return requests.monthlyRequest;
      case CODE.YEARLY:
        return requests.yearlyRequest;
      default:
        return null;
    }
  }
);

export const targetRequest = createSelector(targetState, (state) => {
  return state ? state.request : null;
});
