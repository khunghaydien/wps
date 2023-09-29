import SearchStrategy, {
  SearchStrategyType,
} from '../../../../../widgets/dialogs/ProxyEmployeeSelectDialog/models/SearchStrategy';

type State = {
  searchStrategy: SearchStrategyType;
  isSearchByQueriesExecuted: boolean;
  departmentCode: string;
  departmentName: string;
  employeeCode: string;
  employeeName: string;
  title: string;
  targetDate: string;
  selectedEmployeeId: string;
  isOverLimit: boolean;
};

const ACTIONS = {
  SWITCH_SEARCH_STRATEGY:
    'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/SWITCH_SEARCH_STRATEGY',
  EDIT_DEPARTMENT_CODE:
    'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/EDIT_DEPARTMENT_CODE',
  EDIT_DEPARTMENT_NAME:
    'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/EDIT_DEPARTMENT_NAME',
  EDIT_EMPLOYEE_CODE:
    'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/EDIT_EMPLOYEE_CODE',
  EDIT_EMPLOYEE_NAME:
    'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/EDIT_EMPLOYEE_NAME',
  EDIT_TITLE: 'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/EDIT_TITLE',
  SELECT_EMPLOYEE: 'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/SELECT_EMPLOYEE',
  SET_TARGET_DATE: 'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/SET_TARGET_DATE',
  CLEAR: 'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/CLEAR',
  OVER_LIMIT: 'COMMON/APPROVER_EMPLOYEE/UI/OPERATION/OVER_LIMIT',
};

export const actions = {
  switchSearchStrategy: (searchStrategy: SearchStrategyType) => ({
    type: ACTIONS.SWITCH_SEARCH_STRATEGY,
    payload: searchStrategy,
  }),
  editDepartmentCode: (value: string) => ({
    type: ACTIONS.EDIT_DEPARTMENT_CODE,
    payload: value,
  }),
  editDepartmentName: (value: string) => ({
    type: ACTIONS.EDIT_DEPARTMENT_NAME,
    payload: value,
  }),
  editEmployeeCode: (value: string) => ({
    type: ACTIONS.EDIT_EMPLOYEE_CODE,
    payload: value,
  }),
  editEmployeeName: (value: string) => ({
    type: ACTIONS.EDIT_EMPLOYEE_NAME,
    payload: value,
  }),
  editTitle: (value: string) => ({
    type: ACTIONS.EDIT_TITLE,
    payload: value,
  }),
  selectEmployee: (value: string) => ({
    type: ACTIONS.SELECT_EMPLOYEE,
    payload: value,
  }),
  setTargetDate: (value: string) => ({
    type: ACTIONS.SET_TARGET_DATE,
    payload: value,
  }),
  overLimit: (isOverLimit: boolean) => ({
    type: ACTIONS.OVER_LIMIT,
    payload: isOverLimit,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  searchStrategy: SearchStrategy.SHOW_EMPLOYEES_IN_SAME_DEPARTMENT,
  isSearchByQueriesExecuted: false,
  departmentCode: '',
  departmentName: '',
  employeeCode: '',
  employeeName: '',
  title: '',
  targetDate: '',
  selectedEmployeeId: '',
  isOverLimit: false,
};

export default (state: State = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SWITCH_SEARCH_STRATEGY:
      return {
        ...state,
        searchStrategy: payload,
        isSearchByQueriesExecuted: false,
        departmentCode: '',
        departmentName: '',
        employeeCode: '',
        employeeName: '',
        title: '',
        isOverLimit: false,
      };
    case ACTIONS.EDIT_DEPARTMENT_CODE:
      return {
        ...state,
        departmentCode: payload,
      };
    case ACTIONS.EDIT_DEPARTMENT_NAME:
      return {
        ...state,
        departmentName: payload,
      };
    case ACTIONS.EDIT_EMPLOYEE_CODE:
      return {
        ...state,
        employeeCode: payload,
      };
    case ACTIONS.EDIT_EMPLOYEE_NAME:
      return {
        ...state,
        employeeName: payload,
      };
    case ACTIONS.EDIT_TITLE:
      return {
        ...state,
        title: payload,
      };

    case ACTIONS.SELECT_EMPLOYEE:
      return {
        ...state,
        selectedEmployeeId: payload,
      };
    case ACTIONS.SET_TARGET_DATE:
      return {
        ...state,
        targetDate: payload,
      };
    case ACTIONS.OVER_LIMIT:
      return {
        ...state,
        isOverLimit: payload,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
};
