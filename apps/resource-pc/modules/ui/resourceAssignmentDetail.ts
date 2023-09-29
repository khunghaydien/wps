import { Reducer } from 'redux';

import { initAssignmentDetail } from '@apps/domain/models/psa/Resource';

import { AppDispatch } from '@resource/action-dispatchers/AppThunk';

export const ACTIONS = {
  SET_ASSIGNMENT_BOOKED_TIME_SUCCESS:
    'MODULES/UI/RESOURCE_ASSIGNMENT_DETAIL/SET_ASSIGNMENT_BOOKED_TIME_SUCCESS',
};

export type ResourceAssignmentDetailUIState = {
  bookedTimePerDay: Array<number>;
};

const setAssignmentBookedTimePerDay = (bookedTimePerDay: Array<number>) => ({
  type: ACTIONS.SET_ASSIGNMENT_BOOKED_TIME_SUCCESS,
  payload: bookedTimePerDay,
});

/**
 * Actions
 */
export const actions = {
  setBookedTimePerDay:
    (bookedTimePerDay: Array<number>) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setAssignmentBookedTimePerDay(bookedTimePerDay)),
};

/**
 * Reducer
 */
const initialState = initAssignmentDetail;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ASSIGNMENT_BOOKED_TIME_SUCCESS:
      return {
        ...state,
        bookedTimePerDay: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<ResourceAssignmentDetailUIState, any>;
