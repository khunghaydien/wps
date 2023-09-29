import { createSelector } from 'reselect';

import { LegalAgreementRequestSummary } from '@attendance/domain/models/approval/LegalAgreementRequest';

import ROOT from '../actionType';

export type State = {
  allIds: string[];
  byId: {
    [id: string]: LegalAgreementRequestSummary;
  };
};

/** Define constants */
const ACTION_TYPE_ROOT = `${ROOT}/LIST` as const;
export const ACTION_TYPE = {
  FETCH_SUCCESS: `${ACTION_TYPE_ROOT}/FETCH_SUCCESS`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

/** Define actions */
type FetchSuccessAction = {
  type: typeof ACTION_TYPE.FETCH_SUCCESS;
  payload: LegalAgreementRequestSummary[];
};

type ClearAction = {
  type: typeof ACTION_TYPE.CLEAR;
};

export const actions = {
  clear: (): ClearAction => ({ type: ACTION_TYPE.CLEAR }),
  fetchSuccess: (
    requests: LegalAgreementRequestSummary[]
  ): FetchSuccessAction => ({
    type: ACTION_TYPE.FETCH_SUCCESS,
    payload: requests,
  }),
};

const convertRequests = (requests: LegalAgreementRequestSummary[]): State => ({
  allIds: requests.map((req) => req.id),
  byId: Object.assign({}, ...requests.map((req) => ({ [req.id]: req }))),
});

type Action = FetchSuccessAction | ClearAction;

/** Define selectors */
const getRequestList = (state) => state.entities.attLegalAgreement.list;

const requestListSelector = createSelector(getRequestList, (requestList) =>
  requestList.allIds.map((id) => requestList.byId[id])
);

export const selectors = { requestListSelector };

/** Define reduce */
const initialState: State = {
  allIds: [],
  byId: {},
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.FETCH_SUCCESS:
      return convertRequests(action.payload);

    case ACTION_TYPE.CLEAR:
      return initialState;

    default:
      return state;
  }
};
