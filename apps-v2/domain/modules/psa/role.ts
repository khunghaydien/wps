import {
  Assignment,
  assignRole,
  cancelRole,
  cloneRole,
  completeRole,
  confirmRole,
  deleteRole,
  getRole,
  initialScheduleResult,
  initialStateRole,
  recallRole,
  REJECT_BY,
  rejectRole,
  releaseResource,
  rescheduleRole,
  rescheduleRoleEndDate,
  Role,
  RoleAssignParam,
  RoleRescheduleParam,
  RoleScheduleResult,
  saveRole,
  scheduleRoleCheck,
  softBookRole,
  submitMemo,
  submitRole,
} from '@apps/domain/models/psa/Role';
import { RoleStatus as roleStatus } from '@apps/domain/models/psa/RoleStatus';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

export const ACTIONS = {
  CLEAR_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/CLEAR_SUCCESS',
  COMPLETE_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/COMPLETE_SUCCESS',
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/GET_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/INIT_SUCCESS',
  CLONE_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/CLONE_SUCCESS',
  RESCHEDULE_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/RESCHEDULE_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/SAVE_SUCCESS',
  UPDATE_STATUS: 'MODULES/ENTITIES/PSA/ROLE/UPDATE_STATUS',
  UPDATE_JOB_GRADES: 'MODULES/ENTITIES/PSA/ROLE/UPDATE_JOB_GRADES',
  SELECT_ASSIGNMENT_SUCCESS:
    'MODULES/ENTITIES/PSA/ROLE/SELECT_ASSIGNMENT_SUCCESS',
  UPDATE_ASSIGNMENTS: 'MODULES/ENTITIES/PSA/ROLE/UPDATE_ASSIGNMENTS',
  SET_SCHEDULE_RESULT: 'MODULES/ENEITIES/PSA/ROLE/SET_SCHEDULE_RESULT',
};

const completeSuccess = (body: Record<string, any>) => ({
  type: ACTIONS.COMPLETE_SUCCESS,
  payload: body,
});

const cloneSuccess = (body: Record<string, any>) => ({
  type: ACTIONS.CLONE_SUCCESS,
  payload: body,
});

const rescheduleSuccess = (body: Record<string, any>) => ({
  type: ACTIONS.RESCHEDULE_SUCCESS,
  payload: body,
});

const getSuccess = (body: Role) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const saveSuccess = (body: Role) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: body,
});

const updateStatus = (status: string) => ({
  type: ACTIONS.UPDATE_STATUS,
  payload: status,
});

const updateJobGrades = (jobGrades: Array<any>) => ({
  type: ACTIONS.UPDATE_JOB_GRADES,
  payload: jobGrades,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

const clear: any = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
  payload: [],
});

const selectAssignmentSuccess = (body: Assignment) => ({
  type: ACTIONS.SELECT_ASSIGNMENT_SUCCESS,
  payload: body,
});

const updateAssignments = (body: Array<Assignment>) => ({
  type: ACTIONS.UPDATE_ASSIGNMENTS,
  payload: body,
});

const setScheduleResult = (scheduleResult: RoleScheduleResult) => ({
  type: ACTIONS.SET_SCHEDULE_RESULT,
  payload: scheduleResult,
});

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<Role> =>
      dispatch(initialize()),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<Role> =>
      dispatch(clear()),

  complete:
    (roleId: string, completionDate: string, comments: string) =>
    (dispatch: AppDispatch): void | any =>
      completeRole(roleId, completionDate, comments)
        .then((res: Record<string, any>) => dispatch(completeSuccess(res)))
        .catch((err) => {
          throw err;
        }),

  rescheduleEndDate:
    (roleId: string, endDate: string) =>
    (dispatch: AppDispatch): void | any =>
      rescheduleRoleEndDate(roleId, endDate)
        .then((res: Record<string, any>) => dispatch(rescheduleSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  reschedule:
    (roleRescheduleParam: RoleRescheduleParam) =>
    (dispatch: AppDispatch): void | any =>
      rescheduleRole(roleRescheduleParam)
        .then((res: Record<string, any>) => dispatch(rescheduleSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  get:
    (roleId: string) =>
    (dispatch: AppDispatch): void | any =>
      getRole(roleId)
        .then((role: Role) => dispatch(getSuccess(role)))
        .catch((err) => {
          throw err;
        }),

  save:
    (role: Role) =>
    (dispatch: AppDispatch): void | any =>
      saveRole(role)
        .then((res) => {
          dispatch(saveSuccess(role));
          return res;
        })
        .catch((err) => {
          throw err;
        }),

  updateJobGrades:
    (jobGrades: Array<any>) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(updateJobGrades(jobGrades)),

  delete: (roleId: string) => (): void | any =>
    deleteRole(roleId).catch((err) => {
      throw err;
    }),

  cancel: (roleId: string, comments: string) => (): void | any =>
    cancelRole(roleId, comments).catch((err) => {
      throw err;
    }),

  recall: (roleId: string, comments: string) => (): void | any =>
    recallRole(roleId, comments).catch((err) => {
      throw err;
    }),

  reject:
    (roleId: string, rejectBy: string, comments: string) =>
    (dispatch: AppDispatch): void | any =>
      rejectRole(roleId, rejectBy, comments)
        .then(() =>
          rejectBy === REJECT_BY.PM
            ? dispatch(updateStatus(roleStatus.Planning))
            : dispatch(updateStatus(roleStatus.NotFound))
        )
        .catch((err) => {
          throw err;
        }),

  submit:
    (roleId: string, comments: string) =>
    (dispatch: AppDispatch): void | any =>
      submitRole(roleId, comments)
        .then(() => dispatch(updateStatus(roleStatus.Requested)))
        .catch((err) => {
          throw err;
        }),

  submitMemo: (id: string, memo: string, memoType: string) => (): void | any =>
    submitMemo(id, memo, memoType),

  softBook:
    (roleId: string, comments: string) =>
    (dispatch: AppDispatch): void | any =>
      softBookRole(roleId, comments)
        .then(() => dispatch(updateStatus(roleStatus.SoftBooked)))
        .catch((err) => {
          throw err;
        }),
  releaseResource: (assignmentId: string) => (): void | any =>
    releaseResource(assignmentId).catch((err) => {
      throw err;
    }),

  selectAssignment:
    (assignment: Assignment) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(selectAssignmentSuccess(assignment)),

  updateAssignments:
    (assignments: Array<Assignment>) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(updateAssignments(assignments)),

  clone:
    (
      roleIds: Array<string>,
      targetActivityId: string,
      numberOfClones: number
    ) =>
    (dispatch: AppDispatch): void | any =>
      cloneRole(roleIds, targetActivityId, numberOfClones)
        .then((res: Record<string, any>) => dispatch(cloneSuccess(res)))
        .catch((err) => {
          throw err;
        }),

  confirm:
    (assignmentId: string, comments: string, confirmBy: string) =>
    (dispatch: AppDispatch): void | any =>
      confirmRole(assignmentId, comments, confirmBy)
        .then(() => dispatch(updateStatus(roleStatus.Confirmed)))
        .catch((err) => {
          throw err;
        }),

  updateStatus:
    (status: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(updateStatus(status)),

  assign:
    (roleAssignParam: RoleAssignParam) =>
    (dispatch: AppDispatch): void | any =>
      assignRole(roleAssignParam)
        .then(() => dispatch(updateStatus(roleStatus.SoftBooked)))
        .catch((err) => {
          throw err;
        }),

  scheduleCheck: (roleId: string, employeeBaseId: string) => (): void | any =>
    scheduleRoleCheck(roleId, employeeBaseId).catch((err) => {
      throw err;
    }),
  setScheduleResult:
    (scheduleResult: RoleScheduleResult) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setScheduleResult(scheduleResult)),
  clearScheduleResult: (dispatch: AppDispatch): void | any =>
    dispatch(setScheduleResult(initialScheduleResult)),
};

const initialState = {
  role: initialStateRole,
  scheduleResult: initialScheduleResult,
};

type State = {
  role: Role;
  scheduleResult: RoleScheduleResult;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
    case ACTIONS.INIT_SUCCESS:
    case ACTIONS.CLONE_SUCCESS:
      return {
        ...state,
        role: action.payload,
      };
    case ACTIONS.UPDATE_STATUS:
      return {
        ...state,
        role: { ...state.role, status: action.payload },
      };
    case ACTIONS.UPDATE_JOB_GRADES:
      return {
        ...state,
        role: { ...state.role, jobGrades: action.payload },
      };
    case ACTIONS.SELECT_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        role: { ...state.role, assignment: action.payload },
      };
    case ACTIONS.UPDATE_ASSIGNMENTS:
      return {
        ...state,
        role: { ...state.role, assignments: action.payload },
      };
    case ACTIONS.SET_SCHEDULE_RESULT:
      return {
        ...state,
        scheduleResult: action.payload,
      };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
