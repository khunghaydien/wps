import { Dispatch } from 'redux';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  EmployeeMemberSearchQuery,
  getResponseByGroupId,
  searchResourceGroupMember,
} from '../../../../domain/models/psa/EmployeeMember';

import { setEditRecord } from '../../../actions/editRecord';

// Type
export type EmployeeMember = {
  employeeId: string;
  employeeCode?: string;
  employeeName: string;
  employeePhotoUrl: string;
  employeeTitle?: string;
  departmentName?: string;
  departmentCode: string;
  isSelected: boolean;
  type: string;
};

/**
 * foundEmployeeMember - response from call the search API
 * selectedEmployeeMember - user selected employeeMembers
 */
type State = {
  foundEmployeeMember: EmployeeMember[];
  selectedEmployeeMember: EmployeeMember[];
  defaultResourceManager: EmployeeMember[];
  isDialogOpen: boolean;
};

const ACTIONS = {
  SET_FOUND_RESOURCE_MEMBER: 'SET_FOUND_RESOURCE_MEMBER',
  SET_SELECTED_RESOURCE_MEMBER: 'SET_SELECTED_RESOURCE_MEMBER',
  CLEAN_FOUND_RESOURCE_MEMBER: 'CLEAN_FOUND_RESOURCE_MEMBER',
  CLEAN_SELECTION: 'CLEAN_RESOURCE_SELECTION',
  TOGGLE_SELECTION: 'TOGGLE_RESOURCE_SELECTION',
  TOGGLE_SELECTED: 'TOGGLE_RESOURCE_SELECTED',
  ADD_TO_SELECTED_RESOURCE_MEMBER: 'ADD_TO_SELECTED_RESOURCE_MEMBER',
  REMOVE_FROM_SELECTED_RESOURCE_MEMBER: 'REMOVE_FROM_SELECTED_RESOURCE_MEMBER',
  SET_AS_DEFAULT_RESOURCE_MANAGER: 'SET_AS_DEFAULT_RESOURCE_MANAGER',
  OPEN_RESOURCE_MEMBER_DIALOG: 'OPEN_RESOURCE_MEMBER_DIALOG',
  CLOSE_RESOURCE_MEMBER_DIALOG: 'CLOSE_RESOURCE_MEMBER_DIALOG',
  SET_OWNER: 'SET_OWNER',
  CLEAN_SELECTED_RESOURCE_MEMBER: 'CLEAN_SELECTED_RESOURCE_MEMBER',
  UPDATE_RESOURCE_MEMBER: 'UPDATE_RESOURCE_MEMBER',
};

export const actions = {
  setFoundEmployeeMember: (foundEmployeeMember: EmployeeMember[]) => ({
    type: ACTIONS.SET_FOUND_RESOURCE_MEMBER,
    payload: foundEmployeeMember,
  }),
  cleanFoundEmployeeMember: () => ({
    type: ACTIONS.CLEAN_FOUND_RESOURCE_MEMBER,
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
    type: ACTIONS.ADD_TO_SELECTED_RESOURCE_MEMBER,
    payload: employeeMember,
  }),
  setSelectedEmployeeMember: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.SET_SELECTED_RESOURCE_MEMBER,
    payload: employeeMember,
  }),
  updateEmployeeMember: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.UPDATE_RESOURCE_MEMBER,
    payload: employeeMember,
  }),
  removeFromSelectedEmployeeMember: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.REMOVE_FROM_SELECTED_RESOURCE_MEMBER,
    payload: employeeMember,
  }),
  setAsDefaultResourceManager: (employeeMember: EmployeeMember[]) => ({
    type: ACTIONS.SET_AS_DEFAULT_RESOURCE_MANAGER,
    payload: employeeMember,
  }),
  cleanSelectedEmployeeMember: () => ({
    type: ACTIONS.CLEAN_SELECTED_RESOURCE_MEMBER,
  }),
  openDialog: () => ({
    type: ACTIONS.OPEN_RESOURCE_MEMBER_DIALOG,
  }),
  closeDialog: () => ({
    type: ACTIONS.CLOSE_RESOURCE_MEMBER_DIALOG,
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
 */
export const searchEmployeeMemberList =
  (
    query: EmployeeMemberSearchQuery,
    selectedEmployeeMember: EmployeeMember[]
  ) =>
  (dispatch: Dispatch<any>) => {
    return dispatch(
      withLoading(() =>
        searchResourceGroupMember({ ...query })
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
                type: 'Member',
                isSelected: false,
              }));
            return filteredFoundEmployeeMember;
          })
          .then((filtered: any) => {
            dispatch(actions.cleanFoundEmployeeMember());
            dispatch(actions.setFoundEmployeeMember(filtered));
          })
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      )
    );
  };

/**
 * @param groupId
 *
 * EmployeeMemberList is stored at the link object at the backend.
 * Therefore, call separate API to load the employeeMemberList when the managerList is selected
 *
 * Save employeeMembers to EmployeeMember for the purpose of resetting
 */
export const searchEmployeeMemberListByManagerListId =
  (memberType: string) => (groupId: string) => (dispatch: Dispatch<any>) => {
    return dispatch(
      withLoading(() =>
        getResponseByGroupId(groupId)
          .then((response: any) => {
            // RM are owners in resource group and members in manager group
            const groupOwners = response.owners;
            const groupMembers = response.members;

            // toggle for project manager
            const result = memberType === 'Owner' ? groupOwners : groupMembers;

            const selectedEmployeeMemberList = result.map((emp) =>
              Object.assign(
                {},
                {
                  employeeId: emp.employeeId,
                  employeeCode: emp.employeeCode,
                  employeeName: emp.employeeName,
                  employeePhotoUrl: emp.employeePhotoUrl,
                  departmentName: emp.departmentName,
                  employeeTitle: emp.employeeTitle,
                  type: emp.type ? emp.type : memberType,
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
  groupOwner: [],
  foundEmployeeMember: [],
  selectedEmployeeMember: [],
  defaultResourceManager: [],
  isDialogOpen: false,
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET_FOUND_RESOURCE_MEMBER: {
      return {
        ...state,
        foundEmployeeMember: action.payload,
      };
    }
    case ACTIONS.SET_OWNER: {
      return {
        ...state,
        groupOwner: action.payload,
      };
    }
    case ACTIONS.CLEAN_FOUND_RESOURCE_MEMBER: {
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
    case ACTIONS.ADD_TO_SELECTED_RESOURCE_MEMBER: {
      const payload = action.payload;
      return {
        ...state,
        selectedEmployeeMember: [...payload, ...state.selectedEmployeeMember],
      };
    }
    case ACTIONS.SET_SELECTED_RESOURCE_MEMBER: {
      const { payload } = action;
      return {
        ...state,
        selectedEmployeeMember: [...payload],
      };
    }
    case ACTIONS.REMOVE_FROM_SELECTED_RESOURCE_MEMBER: {
      const payload = action.payload;
      const remainEmployeeMember = payload.filter(
        (employeeMember) => !employeeMember.isSelected
      );
      return {
        ...state,
        selectedEmployeeMember: [...remainEmployeeMember],
      };
    }
    case ACTIONS.SET_AS_DEFAULT_RESOURCE_MANAGER: {
      const payload = action.payload;
      const formattedEmployeeMember = payload.map((emp) => ({
        ...emp,
        type: emp.isSelected ? 'Default' : 'Member',
      }));

      return {
        ...state,
        selectedEmployeeMember: [...formattedEmployeeMember],
      };
    }
    case ACTIONS.CLEAN_SELECTED_RESOURCE_MEMBER: {
      return {
        ...state,
        selectedEmployeeMember: [],
      };
    }
    case ACTIONS.OPEN_RESOURCE_MEMBER_DIALOG: {
      return {
        ...state,
        isDialogOpen: true,
      };
    }
    case ACTIONS.CLOSE_RESOURCE_MEMBER_DIALOG: {
      return {
        ...state,
        isDialogOpen: false,
      };
    }
    default:
      return state;
  }
};
