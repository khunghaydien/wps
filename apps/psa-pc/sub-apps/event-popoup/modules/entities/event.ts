import { Dispatch } from 'redux';

import { getPsaEvent, PsaEvent } from '@apps/domain/models/psa/PsaEvent';

const ACTION_PREFIX = 'SUB_APP/EVENT_DIALOG/MODULES/ENTITIES/EVENT';
export const ACTIONS = {
  GET_PROJECT_SUCCESS: `${ACTION_PREFIX}/GET_PROJECT`,
};

const getPsaEventSuccess = (event: PsaEvent) => ({
  type: ACTIONS.GET_PROJECT_SUCCESS,
  payload: event,
});

export const actions = {
  getPsaEvent:
    (eventId: string) =>
    (dispatch: Dispatch): void | any => {
      return getPsaEvent(eventId)
        .then((res: PsaEvent) => {
          dispatch(getPsaEventSuccess(res));
        })
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = null;

export default (state: any = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_PROJECT_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
