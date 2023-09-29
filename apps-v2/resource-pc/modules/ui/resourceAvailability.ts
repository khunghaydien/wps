import { Reducer } from 'redux';

import { initResourceAvailability } from '@apps/domain/models/psa/Resource';

import { AppDispatch } from '@resource/action-dispatchers/AppThunk';
//
// constants
//
export const ACTIONS = {
  SET_AVAILABILITY_SUCCESS:
    'MODULES/UI/RESOURCE_AVAILABILITY/SET_AVAILABILITY_SUCCESS',
  SET_AVAILABILITY_PAGE_SUCCESS:
    'MODULES/UI/RESOURCE_AVAILABILITY/SET_AVAILABILITY_PAGE_SUCCESS',
};

export type ResourceAvailabilityUIState = {
  limit: number;
  page: number;
  viewType: string;
  startDate: string;
  endDate: string;
  availableHours: Array<Array<number>>;
};

const setResourceAvailability = (
  resourceAvailability: ResourceAvailabilityUIState
) => ({
  type: ACTIONS.SET_AVAILABILITY_SUCCESS,
  payload: resourceAvailability,
});

const setResourceAvailabilityPage = (pageNum: number) => ({
  type: ACTIONS.SET_AVAILABILITY_PAGE_SUCCESS,
  payload: pageNum,
});
//
// actions
//
export const actions = {
  setAvailability:
    (availability: ResourceAvailabilityUIState) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setResourceAvailability(availability)),
  setAvailabilityPage:
    (pageNum: number) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setResourceAvailabilityPage(pageNum)),
};

//
// Reducer
//
const initialState = initResourceAvailability;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_AVAILABILITY_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.SET_AVAILABILITY_PAGE_SUCCESS:
      return {
        ...state,
        page: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<ResourceAvailabilityUIState, any>;
