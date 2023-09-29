import { createSelector } from 'reselect';

import Employee from '../../../../widgets/dialogs/ProxyEmployeeSelectDialog/models/Employee';

import { State as CommonState } from '../../reducers';

import { DIALOG_TYPE } from './ui/dialog';

type State = {
  allIds: Array<string>;
  byId: {
    [key: string]: Employee;
  };
};

const convertEmployee = (record) =>
  new Employee({
    id: record.id,
    employeeCode: record.code || '',
    employeeName: record.name || '',
    employeePhotoUrl: record.user.photoUrl,
    departmentCode: (record.department && record.department.code) || '',
    departmentName: (record.department && record.department.name) || '',
    title: record.title || '',
  });

/**
 * Convert an array of records into normalized list of employees
 * @param {Object[]} records
 * @return
 */
const convertEmployees = (records) => ({
  allIds: records.map((item) => item.id),
  byId: Object.assign(
    {},
    ...records.map((item) => ({ [item.id]: convertEmployee(item) }))
  ),
});

const ACTIONS = {
  SET_BY_REPOSITORY_RESPONSE_DATA:
    'COMMON/APPROVER_EMPLOYEE_SEARCH/LIST/SET_BY_REPOSITORY_RESPONSE_DATA',
  CLEAR: 'COMMON/APPROVER_EMPLOYEE_SEARCH/LIST/CLEAR',
};

export const actions = {
  setByRepositoryResponseData: (result: Array<any>) => ({
    type: ACTIONS.SET_BY_REPOSITORY_RESPONSE_DATA,
    payload: result,
  }),
  clear: () => ({ type: ACTIONS.CLEAR }),
};

type GlobalState = {
  common: CommonState;
};

/**
 * Select employees but the user's
 */
const employeesButUsersSelector = createSelector(
  (state: GlobalState) => state.common.userSetting.employeeId,
  (state: GlobalState) => state.common.accessControl.permission,
  (state: GlobalState) => state.common.approverEmployeeSearch.entities.allIds,
  (state: GlobalState) => state.common.approverEmployeeSearch.entities.byId,
  (state: GlobalState) => state.common.approverEmployeeSearch.ui.dialog.type,
  (userEmployeeId, permission, allIds, byId, dialogType) =>
    allIds
      .filter((id) => {
        if (id === userEmployeeId) {
          const {
            approveSelfAttDailyRequestByEmployee,
            approveSelfAttRequestByEmployee,
            approveSelfAttLegalAgreementRequestByEmployee,
          } = permission;
          switch (dialogType) {
            case DIALOG_TYPE.AttDailyRequest:
              return approveSelfAttDailyRequestByEmployee;
            case DIALOG_TYPE.AttRequest:
              return approveSelfAttRequestByEmployee;
            case DIALOG_TYPE.LegalAgreementRequest:
              return approveSelfAttLegalAgreementRequestByEmployee;
            default:
              return (
                approveSelfAttDailyRequestByEmployee ||
                approveSelfAttRequestByEmployee ||
                approveSelfAttLegalAgreementRequestByEmployee
              );
          }
        }
        return true;
      })
      .map((id) => byId[id])
);

/**
 * Select full data of the selected employee
 */
const selectedEmployeeIdSelector = createSelector(
  (state: GlobalState) =>
    state.common.approverEmployeeSearch.ui.operation.selectedEmployeeId,
  (state: GlobalState) => state.common.approverEmployeeSearch.entities.byId,
  (selectedEmployeeId, byId) => {
    return selectedEmployeeId in byId ? selectedEmployeeId : null;
  }
);

/**
 * Select full data of the selected employee
 */
const selectedEmployeeSelector = createSelector(
  (state: GlobalState) =>
    state.common.approverEmployeeSearch.ui.operation.selectedEmployeeId,
  (state: GlobalState) => state.common.approverEmployeeSearch.entities.byId,
  (selectedEmployeeId, byId) => {
    return selectedEmployeeId && selectedEmployeeId in byId
      ? byId[selectedEmployeeId]
      : null;
  }
);

export const selectors = {
  employeesButUsersSelector,
  selectedEmployeeIdSelector,
  selectedEmployeeSelector,
};

const initialState: State = {
  allIds: [],
  byId: {},
};

export default (state: State = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_BY_REPOSITORY_RESPONSE_DATA:
      return convertEmployees(payload);
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
};
