import { Dispatch } from 'redux';

import differenceBy from 'lodash/differenceBy';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import EmployeeRepository, {
  SearchQuery,
} from '../../../../repositories/EmployeeRepository';

import { EmployeeShowObj } from '../../../models/DelegatedApprover';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

export const LIMIT_NUMBER = 100;

const ACTIONS = {
  ADD_TO_FOUND_EMPLOYEES: 'DELEGATED_APPLICANT/UI/ADD_TO_FOUND_EMPLOYEES',
  CLEAR_FOUND_EMPLOYEES: 'DELEGATED_APPLICANT/UI/CLEAR_FOUND_EMPLOYEES',
  CLEAR_SELECTION: 'DELEGATED_APPLICANT/UI/CLEAR_SELECTION',
  ADD_TO_SELECTED_EMPLOYEES: 'DELEGATED_APPLICANT/UI/ADD_TO_SELECTED_EMPLOYEES',
  REMOVE_FROM_SELECTED_EMPLOYEES:
    'DELEGATED_APPLICANT/UI/REMOVE_FROM_SELECTED_EMPLOYEES',
  CLEAR_SELECTED_EMPLOYEES: 'DELEGATED_APPLICANT/UI/CLEAR_SELECTED_EMPLOYEES',
  INITIALIZE_EXCLUDED_EMPLOYEES:
    'DELEGATED_APPLICANT/UI/INITIALIZE_EXCLUDED_EMPLOYEES',
  ADD_TO_EXCLUDED_EMPLOYEES: 'DELEGATED_APPLICANT/UI/ADD_TO_EXCLUDED_EMPLOYEES',
  REMOVE_FROM_EXCLUDED_EMPLOYEES:
    'DELEGATED_APPLICANT/UI/REMOVE_FROM_EXCLUDED_EMPLOYEES',
  CLEAR_EXCLUDED_EMPLOYEES: 'DELEGATED_APPLICANT/UI/CLEAR_EXCLUDED_EMPLOYEES',
  UPDATE: 'DELEGATED_APPLICANT/UI/UPDATE',
};

// State
type State = {
  foundEmployees: EmployeeShowObj[];
  selectedEmployees: EmployeeShowObj[];
  excludedEmployees: string[];
  isEmployeeSelection: boolean;
  isNewAssignment?: boolean;
};

// Action
type AddToFoundEmployees = {
  type: 'DELEGATED_APPLICANT/UI/ADD_TO_FOUND_EMPLOYEES';
  payload: EmployeeShowObj[];
};

type ClearFoundEmployees = {
  type: 'DELEGATED_APPLICANT/UI/CLEAR_FOUND_EMPLOYEES';
};

type ClearSelection = {
  type: 'DELEGATED_APPLICANT/UI/CLEAR_SELECTION';
};

/* selectedEmployees */
type AddToSelectedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/ADD_TO_SELECTED_EMPLOYEES';
  payload: EmployeeShowObj[];
};

type RemoveFromSelectedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/REMOVE_FROM_SELECTED_EMPLOYEES';
  payload: EmployeeShowObj[];
};

type ClearSelectedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/CLEAR_SELECTED_EMPLOYEES';
};

type InitializeExcludedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/INITIALIZE_EXCLUDED_EMPLOYEES';
  payload: string[];
};
type AddToExcludedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/ADD_TO_EXCLUDED_EMPLOYEES';
  payload: string[];
};

type RemoveFromExcludedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/REMOVE_FROM_EXCLUDED_EMPLOYEES';
  payload: string[];
};
type ClearExcludedEmployees = {
  type: 'DELEGATED_APPLICANT/UI/CLEAR_EXCLUDED_EMPLOYEES';
};

/* generize state updater */
type Update = {
  type: 'DELEGATED_APPLICANT/UI/UPDATE';
  payload: {
    key: string;
    value: any;
  };
};

type Action =
  | AddToFoundEmployees
  | ClearFoundEmployees
  | ClearSelection
  | AddToSelectedEmployees
  | RemoveFromSelectedEmployees
  | ClearSelectedEmployees
  | InitializeExcludedEmployees
  | AddToExcludedEmployees
  | RemoveFromExcludedEmployees
  | ClearExcludedEmployees
  | Update;

const addToFoundEmployees = (
  employees: EmployeeShowObj[]
): AddToFoundEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/ADD_TO_FOUND_EMPLOYEES',
  payload: employees,
});

const clearFoundEmployees = (): ClearFoundEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/CLEAR_FOUND_EMPLOYEES',
});

const clearSelection = (): ClearSelection => ({
  type: 'DELEGATED_APPLICANT/UI/CLEAR_SELECTION',
});

const addToSelectedEmployees = (
  employees: EmployeeShowObj[]
): AddToSelectedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/ADD_TO_SELECTED_EMPLOYEES',
  payload: employees,
});

const removeFromSelectedEmployees = (
  employees: EmployeeShowObj[]
): RemoveFromSelectedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/REMOVE_FROM_SELECTED_EMPLOYEES',
  payload: employees,
});

const clearSelectedEmployees = (): ClearSelectedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/CLEAR_SELECTED_EMPLOYEES',
});

const initializeExcludedEmployees = (
  employees: string[]
): InitializeExcludedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/INITIALIZE_EXCLUDED_EMPLOYEES',
  payload: employees,
});
const addToExcludedEmployees = (
  employees: string[]
): AddToExcludedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/ADD_TO_EXCLUDED_EMPLOYEES',
  payload: employees,
});

const removeFromExcludedEmployees = (
  employees: string[]
): RemoveFromExcludedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/REMOVE_FROM_EXCLUDED_EMPLOYEES',
  payload: employees,
});

const clearExcludedEmployees = (): ClearExcludedEmployees => ({
  type: 'DELEGATED_APPLICANT/UI/CLEAR_EXCLUDED_EMPLOYEES',
});

const update = (key: string, value: any) => ({
  type: 'DELEGATED_APPLICANT/UI/UPDATE',
  payload: {
    key,
    value,
  },
});

// Methods
export const actions = {
  searchEmployees:
    (query: SearchQuery, excludedIds: Array<string>) =>
    (dispatch: AppDispatch): Promise<any> => {
      return dispatch(
        withLoading(() =>
          EmployeeRepository.search({
            ...query,
          })
            .then((foundEmployees) =>
              foundEmployees
                .filter((e) => excludedIds.indexOf(e.id) === -1)
                .map((employee) => ({
                  id: employee.id,
                  code: employee.code,
                  name: employee.name,
                  depCode: employee.department.code,
                  depName: employee.department.name,
                  title: employee.title,
                  photoUrl: employee.user.photoUrl,
                  isSelected: false,
                  isActiveSFUserAcc: employee.isActiveSFUserAcc,
                }))
            )
            .then((foundEmployees) => {
              dispatch(clearFoundEmployees());
              dispatch(
                addToFoundEmployees(
                  foundEmployees.filter((x) => x.isActiveSFUserAcc)
                )
              );
            })
            .catch((err) =>
              dispatch(catchApiError(err, { isContinuable: true }))
            )
        )
      );
    },

  openEmployeeSelection: () => (dispatch: Dispatch<any>) => {
    dispatch(clearFoundEmployees());
    dispatch(update('isEmployeeSelection', true));
  },

  setActiveDialogKey: (key: string) => (dispatch: Dispatch<any>) => {
    dispatch(update('activeDialogKey', key));
  },

  cancelEmployeeSelection: () => (dispatch: Dispatch<any>) => {
    dispatch(clearSelection());
    dispatch(clearFoundEmployees());
    dispatch(update('isEmployeeSelection', false));
  },

  openNewAssignment: () => (dispatch: Dispatch<any>) => {
    dispatch(update('isNewAssignment', true));
  },

  cancelNewAssignment: () => (dispatch: Dispatch<any>) => {
    dispatch(clearSelection());
    dispatch(clearFoundEmployees());
    dispatch(clearSelectedEmployees());
    dispatch(clearExcludedEmployees());
    dispatch(update('isEmployeeSelection', false));
    dispatch(update('isNewAssignment', false));
  },

  selectEmployees:
    (employees: EmployeeShowObj[]) => (dispatch: Dispatch<any>) => {
      dispatch(addToSelectedEmployees(employees));
      dispatch(addToExcludedEmployees(employees.map((x) => x.id)));
      dispatch(update('isEmployeeSelection', false));
    },

  removeFromSelectedEmployees:
    (employees: EmployeeShowObj[]) => (dispatch: Dispatch<any>) => {
      dispatch(removeFromSelectedEmployees(employees));
    },

  addToExcludedEmployees: (empIds: string[]) => (dispatch: Dispatch<any>) => {
    dispatch(addToExcludedEmployees(empIds));
  },
  initializeExcludedEmployees:
    (empIds: string[]) => (dispatch: Dispatch<any>) => {
      dispatch(initializeExcludedEmployees(empIds));
    },
  removeFromExcludedEmployees:
    (empIds: string[]) => (dispatch: Dispatch<any>) => {
      dispatch(removeFromExcludedEmployees(empIds));
    },
  clearExcludedEmployees: () => (dispatch: Dispatch<any>) => {
    dispatch(clearExcludedEmployees());
  },
};

// Reducer
const initialState: State = {
  foundEmployees: [],
  selectedEmployees: [],
  excludedEmployees: [],
  isEmployeeSelection: false,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.ADD_TO_FOUND_EMPLOYEES: {
      const payload = (action as AddToFoundEmployees).payload;
      return {
        ...state,
        foundEmployees: payload,
      };
    }
    case ACTIONS.CLEAR_FOUND_EMPLOYEES: {
      return {
        ...state,
        foundEmployees: [],
      };
    }
    case ACTIONS.CLEAR_SELECTION: {
      return {
        ...state,
        foundEmployees: state.foundEmployees.map((e) => ({
          ...e,
          isSelected: false,
        })),
      };
    }
    case ACTIONS.ADD_TO_SELECTED_EMPLOYEES: {
      const payload = (action as AddToSelectedEmployees).payload;
      return {
        ...state,
        selectedEmployees: [...state.selectedEmployees, ...payload],
      };
    }
    case ACTIONS.REMOVE_FROM_SELECTED_EMPLOYEES: {
      const payload = (action as RemoveFromSelectedEmployees).payload;
      return {
        ...state,
        selectedEmployees: [
          ...differenceBy(state.selectedEmployees, payload, 'id'),
        ],
      };
    }
    case ACTIONS.CLEAR_SELECTED_EMPLOYEES: {
      return {
        ...state,
        selectedEmployees: [],
      };
    }
    case ACTIONS.INITIALIZE_EXCLUDED_EMPLOYEES: {
      const payload = (action as InitializeExcludedEmployees).payload;
      return {
        ...state,
        excludedEmployees: payload,
      };
    }
    case ACTIONS.ADD_TO_EXCLUDED_EMPLOYEES: {
      const payload = (action as AddToExcludedEmployees).payload;
      return {
        ...state,
        excludedEmployees: [...state.excludedEmployees, ...payload],
      };
    }
    case ACTIONS.REMOVE_FROM_EXCLUDED_EMPLOYEES: {
      const payload = (action as RemoveFromExcludedEmployees).payload;
      return {
        ...state,
        excludedEmployees: [
          ...state.excludedEmployees.filter((x) => payload.indexOf(x) === -1),
        ],
      };
    }
    case ACTIONS.CLEAR_EXCLUDED_EMPLOYEES: {
      return {
        ...state,
        excludedEmployees: [],
      };
    }
    case ACTIONS.UPDATE: {
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
