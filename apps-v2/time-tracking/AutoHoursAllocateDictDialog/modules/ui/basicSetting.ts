import {
  AutoHoursAllocationDictItem,
  BasicSetting,
  EXCEED_ACT_WORK_HOURS_TYPE,
  ExceededActWorkHours,
  OVER_LAPPING_TYPE,
  OverlappingEvent,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

type State = BasicSetting;

const initialState = {
  surplusTimeRegistrationJob: null,
  surplusTimeRegistrationWorkCategory: null,
  allocateMethodForOverlappingEvent: OVER_LAPPING_TYPE.NONE,
  allocateMethodForExceedActWorkHour: EXCEED_ACT_WORK_HOURS_TYPE.REDUCE_EVENLY,
};

// Actions
const ActionType = {
  INIT: '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_BASIC_SETTING/INIT',
  EDIT_JOB:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_BASIC_SETTING/EDIT_JOB',
  EDIT_WORK_CATEGORY:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_BASIC_SETTING/EDIT_WORK_CATEGORY',
  EDIT_OVER_LAPPING_EVENT:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_BASIC_SETTING/EDIT_OVER_LAPPING_EVENT',
  EDIT_EXCEED_ACT:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_BASIC_SETTING/EDIT_EXCEED_ACT',
} as const;

type InitAllocateDicBasicAction = {
  type: typeof ActionType.INIT;
  payload: BasicSetting;
};

type EditAllocateDicBasicJobAction = {
  type: typeof ActionType.EDIT_JOB;
  payload: AutoHoursAllocationDictItem['job'];
};

type EditAllocateDicBasicWorkAction = {
  type: typeof ActionType.EDIT_WORK_CATEGORY;
  payload: AutoHoursAllocationDictItem['workCategory'];
};

type EditAllocateDicBasicOverlappingAction = {
  type: typeof ActionType.EDIT_OVER_LAPPING_EVENT;
  payload: OverlappingEvent;
};

type EditAllocateDicBasicExceededActAction = {
  type: typeof ActionType.EDIT_EXCEED_ACT;
  payload: ExceededActWorkHours;
};

type Action =
  | InitAllocateDicBasicAction
  | EditAllocateDicBasicJobAction
  | EditAllocateDicBasicWorkAction
  | EditAllocateDicBasicOverlappingAction
  | EditAllocateDicBasicExceededActAction;

export const actions = {
  initAutoHoursAllocateBasic: (
    basicSetting: BasicSetting
  ): InitAllocateDicBasicAction => ({
    type: ActionType.INIT,
    payload: basicSetting,
  }),
  editJob: (
    job: AutoHoursAllocationDictItem['job']
  ): EditAllocateDicBasicJobAction => ({
    type: ActionType.EDIT_JOB,
    payload: job,
  }),
  editWorkCategory: (
    work: AutoHoursAllocationDictItem['workCategory']
  ): EditAllocateDicBasicWorkAction => ({
    type: ActionType.EDIT_WORK_CATEGORY,
    payload: work,
  }),
  editOverlappingEvent: (
    overlappingEvent: OverlappingEvent
  ): EditAllocateDicBasicOverlappingAction => ({
    type: ActionType.EDIT_OVER_LAPPING_EVENT,
    payload: overlappingEvent,
  }),
  editExceedActWorkHour: (
    exceedActWorkHour: ExceededActWorkHours
  ): EditAllocateDicBasicExceededActAction => ({
    type: ActionType.EDIT_EXCEED_ACT,
    payload: exceedActWorkHour,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INIT:
      return (action as InitAllocateDicBasicAction).payload;
    case ActionType.EDIT_JOB:
      const job = (action as EditAllocateDicBasicJobAction).payload;
      return {
        ...state,
        surplusTimeRegistrationJob: job,
        surplusTimeRegistrationWorkCategory: null,
      };
    case ActionType.EDIT_WORK_CATEGORY:
      const { workCategoryId, workCategoryCode, workCategoryName } = (
        action as EditAllocateDicBasicWorkAction
      ).payload;
      return {
        ...state,
        surplusTimeRegistrationWorkCategory: {
          workCategoryId,
          workCategoryCode,
          workCategoryName,
        },
      };
    case ActionType.EDIT_OVER_LAPPING_EVENT:
      return {
        ...state,
        allocateMethodForOverlappingEvent: (
          action as EditAllocateDicBasicOverlappingAction
        ).payload,
      };
    case ActionType.EDIT_EXCEED_ACT:
      return {
        ...state,
        allocateMethodForExceedActWorkHour: (
          action as EditAllocateDicBasicExceededActAction
        ).payload,
      };
    default:
      return state;
  }
};
