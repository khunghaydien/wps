import parse from 'date-fns/parse';

import {
  catchApiError,
  catchBusinessError,
  confirm,
  withLoading,
} from '../../../../commons/actions/app';
import { SELECT_TAB, SelectTabAction } from '../../../../commons/actions/tab';
import msg from '../../../../commons/languages';

import JobAssignRepository from '../../../../repositories/JobAssignRepository';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import {
  CHANGE_COMPANY,
  ChangeCompanyAction,
  SELECT_MENU_ITEM,
  SelectMenuItemAction,
} from '../../base/menu-pane/ui';
import { searchByJob as searchJobAssignmentByJob } from '../entities/assignmentList';

// State
type State = {
  selectedIds: string[];
  isOpeningChangePeriod: boolean;
  editingValidPeriod: {
    from: string;
    through: string;
  };
};

// Action

const ACTIONS = {
  SELECT: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/SELECT',
  DESELECT: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/DESELECT',
  TOGGLE: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/TOGGLE',
  CLEAR: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/CLEAR',
  START_VALID_PERIOD_UPDATING:
    'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/START_VALID_PERIOD_UPDATING',
  END_VALID_PERIOD_UPDATING:
    'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/END_VALID_PERIOD_UPDATING',
  UPDATE_VALID_PERIOD: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/UPDATE_VALID_PERIOD',
};

type SelectJobAssignmentsAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/SELECT';
  payload: string[];
};

type DeselectJobAssignmentsAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/DESELECT';
  payload: string[];
};

type ToggleJobAssignmentsAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/TOGGLE';
  payload: string;
};

type ClearSelectedJobAssignmentsAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/CLEAR';
};

type StartValidPeriodUpdatingAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/START_VALID_PERIOD_UPDATING';
};

type EndValidPeriodUpdatingAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/END_VALID_PERIOD_UPDATING';
};

type UpdateValidPeriodOfSelectedJobAssignmentsAction = {
  type: 'ADMIN/JOB/UI/JOB_ASSIGNMENT_LIST/UPDATE_VALID_PERIOD';
  payload: {
    key: 'from' | 'through';
    value: string;
  };
};

type Action =
  | SelectJobAssignmentsAction
  | DeselectJobAssignmentsAction
  | ToggleJobAssignmentsAction
  | ClearSelectedJobAssignmentsAction
  | StartValidPeriodUpdatingAction
  | EndValidPeriodUpdatingAction
  | UpdateValidPeriodOfSelectedJobAssignmentsAction
  | ChangeCompanyAction
  | SelectMenuItemAction
  | SelectTabAction;

export const actions = {
  select: (selectedIds: string[]): SelectJobAssignmentsAction => ({
    // @ts-ignore
    type: ACTIONS.SELECT,
    payload: selectedIds,
  }),

  deselect: (deselectedIds: string[]): DeselectJobAssignmentsAction => ({
    // @ts-ignore
    type: ACTIONS.DESELECT,
    payload: deselectedIds,
  }),

  toggle: (id: string): ToggleJobAssignmentsAction => ({
    // @ts-ignore
    type: ACTIONS.TOGGLE,
    payload: id,
  }),

  clear: (): ClearSelectedJobAssignmentsAction => ({
    // @ts-ignore
    type: ACTIONS.CLEAR,
  }),

  startValidPeriodUpdating: (): StartValidPeriodUpdatingAction => ({
    // @ts-ignore
    type: ACTIONS.START_VALID_PERIOD_UPDATING,
  }),

  endValidPeriodUpdating: (): EndValidPeriodUpdatingAction => ({
    // @ts-ignore
    type: ACTIONS.END_VALID_PERIOD_UPDATING,
  }),

  updateValidPeriodBoundKey:
    (key: 'from' | 'through') =>
    (value: string): UpdateValidPeriodOfSelectedJobAssignmentsAction => ({
      // @ts-ignore
      type: ACTIONS.UPDATE_VALID_PERIOD,
      payload: { key, value },
    }),

  bulkUpdateJobAssignments:
    (
      param: {
        ids: string[];
        validDateFrom: string;
        validDateThrough: string;
        minValidDateFrom: string;
        maxValidDateTo: string;
      },
      jobId: string
    ) =>
    (dispatch: AppDispatch) => {
      const isError =
        dispatch(
          showErrorIfInvalidPeriodStartDate(
            param.minValidDateFrom,
            param.validDateFrom
          )
        ) ||
        dispatch(
          showErrorIfInvalidPeriodEndDate(
            param.maxValidDateTo,
            param.validDateThrough
          )
        );

      if (isError) {
        return;
      }

      return dispatch(
        withLoading(() =>
          JobAssignRepository.bulkUpdate(param).then(() => {
            dispatch(actions.endValidPeriodUpdating());
            dispatch(actions.clear());
          })
        )
      )
        .then(() => dispatch(searchJobAssignmentByJob(jobId)))
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
    },

  bulkDeleteJobAssignments:
    (param: { ids: string[] }, jobId: string) => (dispatch: AppDispatch) => {
      // @ts-ignore
      dispatch(confirm(msg().Exp_Msg_ConfirmDelete)).then((yes) => {
        if (!yes) {
          return undefined;
        }

        return dispatch(
          withLoading(() =>
            JobAssignRepository.bulkDelete(param).then(() => {
              dispatch(actions.clear());
            })
          )
        )
          .then(() => dispatch(searchJobAssignmentByJob(jobId)))
          .catch((err) =>
            dispatch(catchApiError(err, { isContinuable: true }))
          );
      });
    },
};

const showErrorInvalidJobAssignPeriodStartDate =
  () =>
  (dispatch: AppDispatch): void => {
    dispatch(
      catchBusinessError(
        msg().Admin_Lbl_ValidationCheck,
        msg().Admin_Lbl_StartDate,
        msg().Admin_Err_InvalidJobAssignPeriodStartDate
      )
    );
  };

const showErrorInvalidJobAssignPeriodEndDate =
  () =>
  (dispatch: AppDispatch): void => {
    dispatch(
      catchBusinessError(
        msg().Admin_Lbl_ValidationCheck,
        msg().Admin_Lbl_EndDate,
        msg().Admin_Err_InvalidJobAssignPeriodEndDate
      )
    );
  };

const showErrorIfInvalidPeriodStartDate =
  (minValidFrom: string, validFrom: string) =>
  (dispatch: AppDispatch): boolean => {
    if (isInvalidAssignPeriodStartDate(minValidFrom, validFrom)) {
      dispatch(showErrorInvalidJobAssignPeriodStartDate());
      return true;
    }
    return false;
  };

const showErrorIfInvalidPeriodEndDate =
  (maxValidTo: string, validTo: string) =>
  (dispatch: AppDispatch): boolean => {
    if (isInvalidAssignPeriodEndDate(maxValidTo, validTo)) {
      dispatch(showErrorInvalidJobAssignPeriodEndDate());
      return true;
    }
    return false;
  };

// validator
const isInvalidAssignPeriodStartDate = (minValidFrom, validFrom) =>
  parse(validFrom) < parse(minValidFrom);

const isInvalidAssignPeriodEndDate = (maxValidTo, validTo) =>
  parse(maxValidTo) < parse(validTo);

// Reducer
const initialState: State = {
  selectedIds: [],
  isOpeningChangePeriod: false,
  editingValidPeriod: {
    from: '',
    through: '',
  },
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SELECT: {
      const { payload } = action as SelectJobAssignmentsAction;
      return {
        ...state,
        selectedIds: [
          ...state.selectedIds,
          ...payload.filter((newId) => !state.selectedIds.includes(newId)),
        ],
      };
    }

    case ACTIONS.DESELECT: {
      const { payload } = action as DeselectJobAssignmentsAction;
      return {
        ...state,
        selectedIds: state.selectedIds.filter((id) => !payload.includes(id)),
      };
    }

    case ACTIONS.TOGGLE: {
      const { payload } = action as ToggleJobAssignmentsAction;
      const { selectedIds } = state;
      return {
        ...state,
        selectedIds: selectedIds.includes(payload)
          ? selectedIds.filter((id) => id !== payload)
          : selectedIds.concat(payload),
      };
    }

    case ACTIONS.START_VALID_PERIOD_UPDATING:
      return {
        ...state,
        isOpeningChangePeriod: true,
        editingValidPeriod: initialState.editingValidPeriod,
      };

    case ACTIONS.END_VALID_PERIOD_UPDATING:
      return {
        ...state,
        isOpeningChangePeriod: false,
        editingValidPeriod: initialState.editingValidPeriod,
      };

    case ACTIONS.UPDATE_VALID_PERIOD: {
      const { payload } =
        action as UpdateValidPeriodOfSelectedJobAssignmentsAction;
      return {
        ...state,
        editingValidPeriod: {
          ...state.editingValidPeriod,
          [payload.key]: payload.value,
        },
      };
    }

    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
    case ACTIONS.CLEAR:
      return initialState;

    default:
      return state;
  }
};
