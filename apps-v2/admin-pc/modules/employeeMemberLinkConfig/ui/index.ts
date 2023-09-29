import { Dispatch } from 'redux';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  EmployeeMemberSearchQuery,
  getResponseByGroupId,
  searchEmployeeMember,
} from '../../../../domain/models/psa/EmployeeMember';

import { setEditRecord } from '../../../actions/editRecord';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

// Type
export type EmployeeMember = {
  id?: string;
  employeeId: string;
  employeeCode?: string;
  employeeName?: string;
  employeePhotoUrl: string;
  employeeTitle?: string;
  departmentName?: string;
  isSelected: boolean;
};

/**
 * foundEmployeeMember - response from call the search API
 * selectedEmployeeMember - user selected employeeMembers
 */
type State = {
  foundEmployeeMember: EmployeeMember[];
  selectedEmployeeMember: EmployeeMember[];
  isDialogOpen: boolean;
};

const ACTIONS = {
  SET_FOUND_EMPLOYEE_MEMBER: 'SET_FOUND_EMPLOYEE_MEMBER',
  SET_SELECTED_EMPLOYEE_MEMBER: 'SET_SELECTED_EMPLOYEE_MEMBER',
  CLEAN_FOUND_EMPLOYEE_MEMBER: 'CLEAN_FOUND_EMPLOYEE_MEMBER',
  CLEAN_SELECTION: 'CLEAN_SELECTION',
  TOGGLE_SELECTION: 'TOGGLE_SELECTION',
  TOGGLE_SELECTED: 'TOGGLE_SELECTED',
  ADD_TO_SELECTED_EMPLOYEE_MEMBER: 'ADD_TO_SELECTED_EMPLOYEE_MEMBER',
  REMOVE_FROM_SELECTED_EMPLOYEE_MEMBER: 'REMOVE_FROM_SELECTED_EMPLOYEE_MEMBER',
  OPEN_EMPLOYEE_MEMBER_DIALOG: 'OPEN_EMPLOYEE_MEMBER_DIALOG',
  CLOSE_EMPLOYEE_MEMBER_DIALOG: 'CLOSE_EMPLOYEE_MEMBER_DIALOG',
  CLEAN_SELECTED_EMPLOYEE_MEMBER: 'CLEAN_SELECTED_EMPLOYEE_MEMBER',
};

export const actions = {
  setFoundEmployeeMember: (foundEmployeeMember: EmployeeMember[]) => ({
    type: ACTIONS.SET_FOUND_EMPLOYEE_MEMBER,
    payload: foundEmployeeMember,
  }),
  cleanFoundEmployeeMember: () => ({
    type: ACTIONS.CLEAN_FOUND_EMPLOYEE_MEMBER,
  }),
  toggleSelection: (target: EmployeeMember) => ({
    type: ACTIONS.TOGGLE_SELECTION,
    payload: target,
  }),
  cleanSelection: () => ({
    type: ACTIONS.CLEAN_SELECTION,
  }),
  toggleSelectedEmployeeMember: (target: EmployeeMember) => ({
    type: ACTIONS.TOGGLE_SELECTED,
    payload: target,
  }),
  addToSelectedEmployeeMember: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.ADD_TO_SELECTED_EMPLOYEE_MEMBER,
    payload: employeeMember,
  }),
  setSelectedEmployeeMember: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.SET_SELECTED_EMPLOYEE_MEMBER,
    payload: employeeMember,
  }),
  removeFromSelectedEmployeeMember: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.REMOVE_FROM_SELECTED_EMPLOYEE_MEMBER,
    payload: employeeMember,
  }),
  cleanSelectedEmployeeMember: () => ({
    type: ACTIONS.CLEAN_SELECTED_EMPLOYEE_MEMBER,
  }),
  openDialog: () => ({
    type: ACTIONS.OPEN_EMPLOYEE_MEMBER_DIALOG,
  }),
  closeDialog: () => ({
    type: ACTIONS.CLOSE_EMPLOYEE_MEMBER_DIALOG,
  }),
};

// Methods

/**
 * @param query, selectedEmployeeMember
 * Can be query employeeMember by using following 4 params.
 * 1. companyId
 * 2. name
 * 3. code
 * 4. departmentName
 * selectedEmployeeMember to filter out the selected employeeMember from the result list
 *
 * Used in search dialog form
 */
export const searchEmployeeMemberList =
  (
    query: EmployeeMemberSearchQuery,
    selectedEmployeeMember: EmployeeMember[]
  ) =>
  (dispatch: AppDispatch): Promise<any> => {
    return dispatch(
      withLoading(() =>
        searchEmployeeMember({ ...query })
          .then((response) => {
            const employeeMembers = response;
            const filteredFoundEmployeeMember = employeeMembers
              .filter(
                (empMem) =>
                  !selectedEmployeeMember
                    .map((obj) => obj.employeeId)
                    .includes(empMem.employeeId)
              )
              .map((empMem) => ({
                employeeId: empMem.employeeId,
                employeeCode: empMem.employeeCode,
                employeeName: empMem.employeeName,
                employeePhotoUrl: empMem.employeePhotoUrl,
                departmentName: empMem.departmentName,
                employeeTitle: empMem.employeeTitle,
                isSelected: false,
              }));
            return filteredFoundEmployeeMember;
          })
          .then((filtered) => {
            dispatch(actions.cleanFoundEmployeeMember());
            dispatch(actions.setFoundEmployeeMember(filtered));
          })
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      )
    );
  };

/**
 * @param managerListId
 *
 * EmployeeMemberList is stored at the link object at the backend.
 * Therefore, call separate API to load the employeeMemberList when the managerList is selected
 *
 */
export const searchEmployeeMemberListByManagerListId =
  (groupId: string) =>
  (dispatch: AppDispatch): Promise<any> => {
    return dispatch(
      withLoading(() =>
        getResponseByGroupId(groupId)
          .then((response: any) => {
            const groupMembers = response.members;
            const selectedEmployeeMemberList = groupMembers.map((empMem) =>
              Object.assign(
                {},
                {
                  employeeId: empMem.employeeId,
                  employeeCode: empMem.employeeCode,
                  employeeName: empMem.employeeName,
                  employeePhotoUrl: empMem.employeePhotoUrl,
                  departmentName: empMem.departmentName,
                  employeeTitle: empMem.employeeTitle,
                  isSelected: false,
                }
              )
            );
            dispatch(
              actions.setSelectedEmployeeMember(selectedEmployeeMemberList)
            );
            dispatch(setEditRecord(response));
          })
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      )
    );
  };

export const openSearchDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanFoundEmployeeMember());
  dispatch(actions.openDialog());
};

export const cancelSearch = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanSelection());
  dispatch(actions.cleanFoundEmployeeMember());
  dispatch(actions.closeDialog());
};

export const addSelectedEmployeeMember =
  (employeeMembers: EmployeeMember[]) => (dispatch: Dispatch<any>) => {
    const employeeMember = employeeMembers.filter((e) => e.isSelected);
    const selectedEmployeeMember = employeeMember.map((e) => ({
      ...e,
      isSelected: false,
    }));
    dispatch(actions.addToSelectedEmployeeMember(selectedEmployeeMember));
    dispatch(actions.closeDialog());
  };

// Reducer
const initialState = {
  foundEmployeeMember: [],
  selectedEmployeeMember: [],
  isDialogOpen: false,
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET_FOUND_EMPLOYEE_MEMBER: {
      return {
        ...state,
        foundEmployeeMember: action.payload,
      };
    }
    case ACTIONS.CLEAN_FOUND_EMPLOYEE_MEMBER: {
      return {
        ...state,
        foundEmployeeMember: [],
      };
    }
    case ACTIONS.TOGGLE_SELECTION: {
      const payload = action.payload;
      const clone = [...state.foundEmployeeMember];
      const index = state.foundEmployeeMember.findIndex(
        (employeeMember) => employeeMember.employeeId === payload.employeeId
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };
      return {
        ...state,
        foundEmployeeMember: [...clone],
      };
    }
    case ACTIONS.CLEAN_SELECTION: {
      const clone = [...state.foundEmployeeMember];
      clone.forEach((employeeMember) => ({
        ...employeeMember,
        isSelected: false,
      }));
      return {
        ...state,
        foundEmployeeMember: [...clone],
      };
    }
    case ACTIONS.TOGGLE_SELECTED: {
      const payload = action.payload;
      const clone = [...state.selectedEmployeeMember];
      const index = state.selectedEmployeeMember.findIndex(
        (employeeMember) => employeeMember.employeeId === payload.employeeId
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };
      return {
        ...state,
        selectedEmployeeMember: [...clone],
      };
    }
    case ACTIONS.ADD_TO_SELECTED_EMPLOYEE_MEMBER: {
      const payload = action.payload;
      return {
        ...state,
        selectedEmployeeMember: [...payload, ...state.selectedEmployeeMember],
      };
    }
    case ACTIONS.SET_SELECTED_EMPLOYEE_MEMBER: {
      const { payload } = action;
      return {
        ...state,
        selectedEmployeeMember: [...payload],
      };
    }
    case ACTIONS.REMOVE_FROM_SELECTED_EMPLOYEE_MEMBER: {
      const payload = action.payload;
      const remainEmployeeMember = payload.filter(
        (employeeMember) => !employeeMember.isSelected
      );
      return {
        ...state,
        selectedEmployeeMember: [...remainEmployeeMember],
      };
    }
    case ACTIONS.CLEAN_SELECTED_EMPLOYEE_MEMBER: {
      return {
        ...state,
        selectedEmployeeMember: [],
      };
    }
    case ACTIONS.OPEN_EMPLOYEE_MEMBER_DIALOG: {
      return {
        ...state,
        isDialogOpen: true,
      };
    }
    case ACTIONS.CLOSE_EMPLOYEE_MEMBER_DIALOG: {
      return {
        ...state,
        isDialogOpen: false,
      };
    }
    default:
      return state;
  }
};
