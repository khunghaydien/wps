import { Dispatch, Reducer } from 'redux';

import moment from 'moment';

import { catchApiError } from '@apps/commons/actions/app';

import { ScheduleStrategyConst } from '@apps/domain/models/psa/PsaResourceSchedule';
import { ResourceListItem } from '@apps/domain/models/psa/Resource';
import {
  RoleScheduleParam,
  RoleScheduleResult,
  scheduleRole,
} from '@apps/domain/models/psa/Role';

import { setRoleScheduleResult } from '@resource/action-dispatchers/Role';
//
// constants
//
export const ACTIONS = {
  INITIALIZE: 'MODULES/UI/RESOURCE_SELECTION/INITIALIZE',
  SET_RESOURCE_SELECTION:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION',
  SET_RESOURCE_SELECTION_STATE:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_STATE',
  SET_CURRENT_STRATEGY: 'MODULES/UI/RESOURCE_SELECTION/SET_CURRENT_STRATEGY',
  SET_CURRENT_WORK_HOUR_PER_DAY:
    'MODULES/UI/RESOURCE_SELECTION/SET_CURRENT_WORK_HOUR_PER_DAY',
  SET_CURRENT_WORK_HOUR_PERCENT_PER_DAY:
    'MODULES/UI/RESOURCE_SELECTION/SET_CURRENT_WORK_HOUR_PERCENT_PER_DAY',
  SET_RESOURCE_SELECTION_INDEX:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_INDEX',
  SET_RESOURCE_SELECTION_RESOURCE:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_RESOURCE',
  SET_RESOURCE_SELECTION_SCHEDULED_AVAILABLE_HOURS:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_SCHEDULED_AVAILABLE_HOURS',
  SET_RESOURCE_SELECTION_SCHEDULED_BOOKED_HOURS:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_SCHEDULED_BOOKED_HOURS',
  SET_RESOURCE_SELECTION_SCHEDULED_REMAINING_HOURS:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_SCHEDULED_REMAINING_HOURS',
  SET_RESOURCE_SELECTION_SCHEDULED_CUSTOM_HOURS:
    'MODULES/UI/RESOURCE_SELECTION/SET_RESOURCE_SELECTION_SCHEDULED_CUSTOM_HOURS',
};

export const ResourceSelectionState = {
  SEARCH_RESOURCE: 'SEARCH_RESOURCE',
  SELECT_STRATEGY: 'SELECT_STRATEGY',
  STRATEGY_PREVIEW: 'STRATEGY_PREVIEW',
  CUSTOM_SCHEDULE: 'CUSTOM_SCHEDULE',
  CUSTOM_PREVIEW: 'CUSTOM_PREVIEW',
};
export type ResourceSelectionUIState = {
  currentState: string;
  currentIndex: number;
  currentStrategy: string;
  currentWorkHoursPerDay: number;
  currentWorkHoursPercentPerDay?: number;
  resource?: ResourceListItem;
  scheduledAvailableHours?: Array<Array<number>>;
  scheduledBookedHours?: Array<Array<number>>;
  scheduledRemainingHours?: Array<Array<number>>;
  scheduledCustomHours?: Array<Array<number>>;
};
const initResourceState = {
  currentState: ResourceSelectionState.SEARCH_RESOURCE,
  currentIndex: -1,
  currentStrategy: ScheduleStrategyConst.AdjustConsiderAvailability,
  currentWorkHoursPerDay: 8,
  currentWorkHoursPercentPerDay: 100,
};
const initialize = () => ({
  type: ACTIONS.INITIALIZE,
});
const setResourceSelection = (resourceSelection: ResourceSelectionUIState) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION,
  payload: resourceSelection,
});
const setResourceSelectionState = (currentState: string) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_STATE,
  payload: currentState,
});

const setCurrentStrategy = (currentStrategy: string) => ({
  type: ACTIONS.SET_CURRENT_STRATEGY,
  payload: currentStrategy,
});

const setCurrentWorkHoursPerDay = (currentWorkHoursPerDay: number) => ({
  type: ACTIONS.SET_CURRENT_WORK_HOUR_PER_DAY,
  payload: currentWorkHoursPerDay,
});

const setCurrentWorkHoursPercentPerDay = (
  currentWorkHoursPercentPerDay: number
) => ({
  type: ACTIONS.SET_CURRENT_WORK_HOUR_PERCENT_PER_DAY,
  payload: currentWorkHoursPercentPerDay,
});

const setResourceSelectionIndex = (currentIndex: number) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_INDEX,
  payload: currentIndex,
});
const setResourceSelectionScheduledAvailableHours = (hours: Array<number>) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_AVAILABLE_HOURS,
  payload: hours,
});
const setResourceSelectionScheduledBookedHours = (hours: Array<number>) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_BOOKED_HOURS,
  payload: hours,
});
const setResourceSelectionScheduledRemainingHours = (hours: Array<number>) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_REMAINING_HOURS,
  payload: hours,
});
const setResourceSelectionScheduledCustomHours = (hours: Array<number>) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_CUSTOM_HOURS,
  payload: hours,
});
const setResourceSelectionResource = (resource: ResourceListItem) => ({
  type: ACTIONS.SET_RESOURCE_SELECTION_RESOURCE,
  payload: resource,
});

//
// actions
//
export const actions = {
  initialize:
    () =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(initialize()),
  setResourceSelection:
    (resourceSelection: ResourceSelectionUIState) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelection(resourceSelection)),

  setResourceSelectionState:
    (currentState: string) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionState(currentState)),

  setResourceIndex:
    (currentIndex: number) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionIndex(currentIndex)),

  setCurrentStrategy:
    (newStrategy: string) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setCurrentStrategy(newStrategy)),

  setCurrentWorkHoursPerDay:
    (workHoursPerDay: number) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setCurrentWorkHoursPerDay(workHoursPerDay)),

  setCurrentWorkHoursPercentPerDay:
    (workHoursPercentPerDay: number) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setCurrentWorkHoursPercentPerDay(workHoursPercentPerDay)),

  setResourceSelectionResource:
    (resource: ResourceListItem) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionResource(resource)),

  setResourceSelectionScheduledAvailableHours:
    (hours: Array<number>) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionScheduledAvailableHours(hours)),

  setResourceSelectionScheduledBookedHours:
    (hours: Array<number>) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionScheduledBookedHours(hours)),

  setResourceSelectionScheduledRemainingHours:
    (hours: Array<number>) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionScheduledRemainingHours(hours)),

  setResourceSelectionScheduledCustomHours:
    (hours: Array<number>) =>
    (dispatch: Dispatch<any>): void | any =>
      dispatch(setResourceSelectionScheduledCustomHours(hours)),

  schedulePreview:
    (
      roleScheduleParam: RoleScheduleParam,
      startDate: string,
      selectedResourceAvailability: Array<number>
    ) =>
    (dispatch: Dispatch<any>): void | any =>
      scheduleRole(roleScheduleParam)
        .then((schedulePreviewResult: RoleScheduleResult) => {
          schedulePreviewResult.availableTime = selectedResourceAvailability;

          // Readjust book time if scheduled result is different from roleScheduleParam
          const originalStartDate = moment(roleScheduleParam.startDate);
          const scheduledStartDate = moment(schedulePreviewResult.startDate);
          const diffDay = scheduledStartDate.diff(originalStartDate, 'days');

          if (diffDay > 0) {
            const prependArray = new Array(diffDay).fill(0);
            schedulePreviewResult.bookedTime = prependArray.concat(
              schedulePreviewResult.bookedTime
            );
          }

          schedulePreviewResult.remainingHours =
            schedulePreviewResult.availableTime.map((hour, index) => {
              if (schedulePreviewResult.bookedTime[index] === undefined) {
                return hour;
              }
              const bookedTime =
                schedulePreviewResult.bookedTime[index] === -1
                  ? 0
                  : schedulePreviewResult.bookedTime[index];
              if (hour === -1) {
                return 0 - bookedTime;
              }
              return hour - bookedTime;
            });
          schedulePreviewResult.customHours = schedulePreviewResult.bookedTime;
          dispatch(setRoleScheduleResult(schedulePreviewResult));
          dispatch(
            setResourceSelectionState(ResourceSelectionState.STRATEGY_PREVIEW)
          );
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          dispatch(
            setResourceSelectionState(ResourceSelectionState.SELECT_STRATEGY)
          );
        }),
};

//
// Reducer
//
const initialState = initResourceState;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_RESOURCE_SELECTION:
      return action.payload;
    case ACTIONS.INITIALIZE:
      return initResourceState;
    case ACTIONS.SET_RESOURCE_SELECTION_STATE:
      return {
        ...state,
        currentState: action.payload,
      };
    case ACTIONS.SET_RESOURCE_SELECTION_INDEX:
      return {
        ...state,
        currentIndex: action.payload,
      };
    case ACTIONS.SET_RESOURCE_SELECTION_RESOURCE:
      return {
        ...state,
        resource: action.payload,
      };
    case ACTIONS.SET_CURRENT_STRATEGY:
      return {
        ...state,
        currentStrategy: action.payload,
      };
    case ACTIONS.SET_CURRENT_WORK_HOUR_PER_DAY:
      return {
        ...state,
        currentWorkHoursPerDay: action.payload,
      };
    case ACTIONS.SET_CURRENT_WORK_HOUR_PERCENT_PER_DAY:
      return {
        ...state,
        currentWorkHoursPercentPerDay: action.payload,
      };
    case ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_AVAILABLE_HOURS:
      return {
        ...state,
        scheduledAvailableHours: action.payload,
      };
    case ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_BOOKED_HOURS:
      return {
        ...state,
        scheduledBookedHours: action.payload,
      };
    case ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_REMAINING_HOURS:
      return {
        ...state,
        scheduledRemainingHours: action.payload,
      };
    case ACTIONS.SET_RESOURCE_SELECTION_SCHEDULED_CUSTOM_HOURS:
      return {
        ...state,
        scheduledCustomHours: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<ResourceSelectionUIState, any>;
