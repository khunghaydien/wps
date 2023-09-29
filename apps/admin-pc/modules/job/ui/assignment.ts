import { Dispatch } from 'redux';

import parse from 'date-fns/parse';
import differenceBy from 'lodash/differenceBy';

import {
  catchApiError,
  catchBusinessError,
  withLoading,
} from '../../../../commons/actions/app';
import msg from '../../../../commons/languages';

import EmployeeRepository, {
  SearchQuery,
} from '../../../../repositories/EmployeeRepository';
import JobAssignRepository from '../../../../repositories/JobAssignRepository';

import { Employee as DomainEmployee } from '../../../../domain/models/organization/Employee';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { searchByJob as searchJobAssignmentByJob } from '../entities/assignmentList';
// State

export type Employee = DomainEmployee & {
  isSelected: boolean;
};

type State = {
  /**
   * 社員検索の結果
   */
  foundEmployees: Employee[];

  /**
   * 未決定のジョブアサインの社員リスト
   */
  candidates: Employee[];

  /**
   * 決定されたジョブアサインの社員リスト
   * アサインが最終的に確定するとサーバーに送信される
   */
  stagedEmployees: Employee[];

  /**
   * 有効開始日
   */
  validDateFrom: string;

  /**
   * 有効終了日
   */
  validDateThrough: string;

  /**
   * ジョブアサインの新規追加が開いてるかどうか
   */
  isOpeningNewAssignment: boolean;

  /**
   * 社員選択が開いてるかどうか
   */
  isOpeningEmployeeSelection: boolean;

  /**
   * whether fetched record amount exceeded the limit number
   */
  isExceededLimit: boolean;
};

// Action

/* foundEmployees */
type AddToFoundEmployees = {
  type: 'ADD_TO_FOUND_EMPLOYEES';
  payload: Employee[];
};

type AppendToFoundEmployees = {
  type: 'APPEND_TO_FOUND_EMPLOYEES';
  payload: Employee[];
};

type RemoveFromFoundEmployees = {
  type: 'REMOVE_FROM_FOUND_EMPLOYEES';
  payload: Employee[];
};

type ClearFoundEmployees = {
  type: 'CLEAR_FOUND_EMPLOYEES';
};

type ClearSelection = {
  type: 'CLEAR_SELECTION';
};

type ToggleSlection = {
  type: 'TOGGLE_SELECTION';
  payload: Employee;
};

/* candidates */
type AddToCandidates = {
  type: 'ADD_TO_CANDIDATES';
  payload: Employee[];
};

type RemoveFromCandidates = {
  type: 'REMOVE_FROM_CANDADATES';
  payload: Employee[];
};

type ClearCandidates = {
  type: 'CLEAR_CANDADATES';
};

/* stargedEmployees */
type AddToStagedEmployees = {
  type: 'ADD_TO_STAGED_EMPLOYEES';
  payload: Employee[];
};

type ClearStagedEmployees = {
  type: 'CLEAR_STAGED_EMPLOYEES';
};

/* generize state updater */
type Update = {
  type: 'UPDATE';
  payload: {
    key: string;
    value: any;
  };
};

type Action =
  | AddToFoundEmployees
  | AppendToFoundEmployees
  | RemoveFromFoundEmployees
  | ClearFoundEmployees
  | ClearSelection
  | ToggleSlection
  | AddToCandidates
  | RemoveFromCandidates
  | ClearCandidates
  | AddToStagedEmployees
  | ClearStagedEmployees
  | Update;

export const LIMIT_NUMBER = 100;

const showErrorInvalidJobAssignPeriodStartDate =
  () =>
  (dispatch: Dispatch): void => {
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
  (dispatch: Dispatch): void => {
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

export const addToFoundEmployees = (
  employees: Employee[]
): AddToFoundEmployees => ({
  type: 'ADD_TO_FOUND_EMPLOYEES',
  payload: employees,
});

export const appendToFoundEmployees = (
  employees: Employee[]
): AppendToFoundEmployees => ({
  type: 'APPEND_TO_FOUND_EMPLOYEES',
  payload: employees,
});

export const removeFromFoundEmployees = (
  employees: Employee[]
): RemoveFromFoundEmployees => ({
  type: 'REMOVE_FROM_FOUND_EMPLOYEES',
  payload: employees,
});

export const clearFoundEmployees = (): ClearFoundEmployees => ({
  type: 'CLEAR_FOUND_EMPLOYEES',
});

export const clearSelection = (): ClearSelection => ({
  type: 'CLEAR_SELECTION',
});

export const toggleSelection = (target: Employee): ToggleSlection => ({
  type: 'TOGGLE_SELECTION',
  payload: target,
});

export const addToCandidates = (employees: Employee[]): AddToCandidates => ({
  type: 'ADD_TO_CANDIDATES',
  payload: employees,
});

export const removeFromCandidates = (
  employees: Employee[]
): RemoveFromCandidates => ({
  type: 'REMOVE_FROM_CANDADATES',
  payload: employees,
});

export const clearCandidates = (): ClearCandidates => ({
  type: 'CLEAR_CANDADATES',
});

export const addToStagedEmployees = (
  employees: Employee[]
): AddToStagedEmployees => ({
  type: 'ADD_TO_STAGED_EMPLOYEES',
  payload: employees,
});

export const clearStagedEmployees = (): ClearStagedEmployees => ({
  type: 'CLEAR_STAGED_EMPLOYEES',
});

export const update = (key: string, value: any) => ({
  type: 'UPDATE',
  payload: {
    key,
    value,
  },
});

//

export const clear = () => (dispatch: Dispatch<any>) => {
  dispatch(clearSelection());
  dispatch(clearCandidates());
  dispatch(clearFoundEmployees());
  dispatch(clearStagedEmployees());
  dispatch(update('validDateThrough', ''));
  dispatch(update('validDateFrom', ''));
};

export const assignJobToEmployees =
  (param: {
    jobId: string;
    validDateFrom: string;
    minValidDateFrom: string;
    maxValidDateTo: string;
    validDateThrough: string;
    employees: Employee[];
  }) =>
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
        JobAssignRepository.create({
          jobId: param.jobId,
          employeeIds: param.employees.map((employee) => employee.id),
          validDateFrom: param.validDateFrom,
          validDateThrough: param.validDateThrough,
        }).then(() => {
          dispatch(clear());
          dispatch(update('isOpeningNewAssignment', false));
        })
      )
    )
      .then(() => dispatch(searchJobAssignmentByJob(param.jobId)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const searchEmployees =
  (query: SearchQuery) => (dispatch: Dispatch<any>) => {
    return dispatch(
      withLoading(() =>
        EmployeeRepository.search({
          ...query,
        })
          .then((foundEmployees) =>
            foundEmployees.map((employee) => ({
              ...employee,
              isSelected: false,
            }))
          )
          .then((foundEmployees) => {
            dispatch(clearFoundEmployees());
            dispatch(addToFoundEmployees(foundEmployees));
          })
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      )
    );
  };

export const selectCandidates =
  (employees: Employee[]) => (dispatch: Dispatch<any>) => {
    const candidates = employees.filter((e) => e.isSelected);

    dispatch(clearSelection());
    dispatch(removeFromFoundEmployees(candidates));
    dispatch(addToCandidates(candidates));
  };

export const deleteACandidate =
  (candidate: Employee) => (dispatch: Dispatch<any>) => {
    dispatch(removeFromCandidates([candidate]));
    dispatch(appendToFoundEmployees([candidate]));
  };

export const decideCandidates =
  (candidates: Employee[]) => (dispatch: Dispatch<any>) => {
    dispatch(addToStagedEmployees(candidates));
    dispatch(clearCandidates());
    dispatch(update('isOpeningEmployeeSelection', false));
  };

export const openEmployeeSelection =
  (
    stagedEmployees: Employee[],
    startDate: string,
    minStartDate: string,
    endDate: string,
    maxEndDate: string
  ) =>
  (dispatch: Dispatch<any>) => {
    const isError =
      dispatch(showErrorIfInvalidPeriodStartDate(minStartDate, startDate)) ||
      dispatch(showErrorIfInvalidPeriodEndDate(maxEndDate, endDate));

    if (isError) {
      return;
    }

    dispatch(clearSelection());
    dispatch(clearCandidates());
    dispatch(clearFoundEmployees());
    dispatch(addToCandidates(stagedEmployees));
    dispatch(update('isOpeningEmployeeSelection', true));
  };

export const cancelEmployeeSelection = () => (dispatch: Dispatch<any>) => {
  dispatch(clearSelection());
  dispatch(clearCandidates());
  dispatch(clearFoundEmployees());
  dispatch(update('isOpeningEmployeeSelection', false));
};

export const openNewAssignment = () => (dispatch: Dispatch<any>) => {
  dispatch(update('isOpeningNewAssignment', true));
};

export const cancelNewAssignment = () => (dispatch: Dispatch<any>) => {
  dispatch(cancelEmployeeSelection());
  dispatch(clearStagedEmployees());
  dispatch(update('validDateThrough', ''));
  dispatch(update('validDateFrom', ''));
  dispatch(update('isOpeningNewAssignment', false));
};

// validator
const isInvalidAssignPeriodStartDate = (minValidFrom, validFrom) =>
  parse(validFrom) < parse(minValidFrom);

const isInvalidAssignPeriodEndDate = (maxValidTo, validTo) =>
  parse(maxValidTo) < parse(validTo);

// Reducer

const initialState: State = {
  foundEmployees: [],
  candidates: [],
  stagedEmployees: [],
  validDateFrom: '',
  validDateThrough: '',
  isOpeningNewAssignment: false,
  isOpeningEmployeeSelection: false,
  isExceededLimit: false,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'ADD_TO_FOUND_EMPLOYEES': {
      const payload = (action as AddToFoundEmployees).payload;
      const exceededNum = payload.length - LIMIT_NUMBER;

      return {
        ...state,
        foundEmployees: [
          ...differenceBy(
            exceededNum ? payload.slice(0, LIMIT_NUMBER) : payload,
            state.candidates,
            'id'
          ),
        ],
        isExceededLimit: exceededNum > 0,
      };
    }
    case 'APPEND_TO_FOUND_EMPLOYEES': {
      const payload = (action as AppendToFoundEmployees).payload;

      return {
        ...state,
        foundEmployees: [...state.foundEmployees, ...payload],
      };
    }
    case 'REMOVE_FROM_FOUND_EMPLOYEES': {
      const payload = (action as RemoveFromFoundEmployees).payload;

      return {
        ...state,
        foundEmployees: [...differenceBy(state.foundEmployees, payload, 'id')],
      };
    }
    case 'CLEAR_FOUND_EMPLOYEES': {
      return {
        ...state,
        foundEmployees: [],
        isExceededLimit: false,
      };
    }
    case 'TOGGLE_SELECTION': {
      const payload = (action as ToggleSlection).payload;
      const clone = [...state.foundEmployees];

      const index = state.foundEmployees.findIndex(
        (employee) => employee.id === payload.id
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };

      return {
        ...state,
        foundEmployees: [...clone],
      };
    }
    case 'CLEAR_SELECTION': {
      return {
        ...state,
        foundEmployees: state.foundEmployees.map((e) => ({
          ...e,
          isSelected: false,
        })),
      };
    }
    case 'ADD_TO_CANDIDATES': {
      const payload = (action as AddToCandidates).payload.map((value) => ({
        ...value,
        isSelected: false,
      }));

      return {
        ...state,
        candidates: [...state.candidates, ...payload],
      };
    }
    case 'REMOVE_FROM_CANDADATES': {
      const payload = (action as RemoveFromCandidates).payload;

      return {
        ...state,
        candidates: [...differenceBy(state.candidates, payload, 'id')],
      };
    }
    case 'CLEAR_CANDADATES': {
      return {
        ...state,
        candidates: [],
      };
    }
    case 'ADD_TO_STAGED_EMPLOYEES': {
      const payload = (action as AddToStagedEmployees).payload;

      return {
        ...state,
        stagedEmployees: [...payload],
      };
    }
    case 'CLEAR_STAGED_EMPLOYEES': {
      return {
        ...state,
        stagedEmployees: [],
      };
    }
    case 'UPDATE': {
      const payload = (action as Update).payload;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }
    default:
      return state;
  }
};
