import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';

//
// constants
//
export const ACTIONS = {
  GET_SUCCESS: 'MODULES/UI/CAPACITY_EDITOR_RESOURCE_AVAILABILITY/GET_SUCCESS',
  SAVE_SUCCESS: 'MODULES/UI/CAPACITY_EDITOR_RESOURCE_AVAILABILITY/SAVE_SUCCESS',
  GET_ERROR: 'MODULES/UI/CAPACITY_EDITOR_RESOURCE_AVAILABILITY/GET_ERROR',
  SAVE_ERROR: 'MODULES/UI/CAPACITY_EDITOR_RESOURCE_AVAILABILITY/SAVE_ERROR',
};

//
// types
//
export type AvailabilityStatus = 'Active' | 'Inactive' | 'Absence' | 'Retired';

export type ResourceAvailabilityUIState = {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: AvailabilityStatus;
  capacity: string;
  availableCapacity: number;
  workSchemeId: string;
  workSchemeCode: string;
  workSchemeName: string;
  workArrangementId1: string;
  workArrangementCode1: string;
  workArrangementName1: string;
  workArrangementTime1: number;
  workArrangementId2: string;
  workArrangementCode2: string;
  workArrangementName2: string;
  workArrangementTime2: number;
  workArrangementId3: string;
  workArrangementCode3: string;
  workArrangementName3: string;
  workArrangementTime3: number;
  nonProjectBookingTime: number;
  nonProjectBookingTimeRM: number;
  unavailableTime: number;
  memberComment: string;
  RMComment: string;
};

type ResourceAvailabilityUIStateArray = {
  resourceAvailability: Array<ResourceAvailabilityUIState>;
};

type ResourceAvailability = {
  id: string;
  date: string;
  capacity: string;
  workSchemeId: string;
  nonProjectBookingTime: number;
  nonProjectBookingTimeRM: number;
  workArrangementId1: string;
  workArrangementTime1: number;
  workArrangementId2: string;
  workArrangementTime2: number;
  workArrangementId3: string;
  workArrangementTime3: number;
  status: AvailabilityStatus;
  unavailableTime: number;
  memberComment: string;
  RMComment: string;
};

type ResourceAvailabilityArray = Array<ResourceAvailability>;

//
// action
//
const getSuccess = (type, records) => ({
  type,
  payload: records,
});

const getError = (type) => ({
  type,
});
const saveSuccess = (type) => ({
  type,
});

const saveError = (type) => ({
  type,
});

//
// actions
//
export const actions = {
  get: (availabilityIds: Array<string>) => (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/psa/capacity/get`, param: { availabilityIds } };
    return Api.invoke(req)
      .then((result: ResourceAvailabilityUIStateArray) => {
        dispatch(getSuccess(ACTIONS.GET_SUCCESS, result.resourceAvailability));
        return result.resourceAvailability;
      })
      .catch((err) => {
        dispatch(getError(ACTIONS.GET_ERROR));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
      })
      .finally(() => dispatch(loadingEnd()));
  },
  save: (resourceAvailability: ResourceAvailabilityArray) => (dispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/psa/capacity/save`,
      param: { resourceAvailability },
    };
    return Api.invoke(req)
      .then(() => {
        dispatch(saveSuccess(ACTIONS.SAVE_SUCCESS));
      })
      .catch((err) => {
        dispatch(saveError(ACTIONS.SAVE_ERROR));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
      })
      .finally(() => dispatch(loadingEnd()));
  },
};

//
// Reducer
//
const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}) as Reducer<any>;
