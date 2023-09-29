const SET = 'COMMONS/MODULES/PROXY_EMP_INFO/SET';

const UNSET = 'COMMONS/MODULES/PROXY_EMP_INFO/UNSET';

export const constants = { SET, UNSET };

/**
 * Set proxy employee and enter proxy mode
 */
const set = (employeeInfo) => ({
  type: SET,
  payload: employeeInfo,
});

/**
 * Unset proxy employee and exit proxy mode
 */
const unset = () => ({
  type: UNSET,
});

export const actions = { set, unset };

const initialState = {
  isProxyMode: false,
  id: '',
  employeeCode: '',
  employeeName: '',
  employeePhotoUrl: '',
  departmentCode: '',
  departmentName: '',
  title: '',
  managerName: '',
};

type State = {
  isProxyMode: boolean;
  id: string;
  employeeCode: string;
  employeeName: string;
  employeePhotoUrl: string;
  departmentCode: string;
  departmentName: string;
  title: string;
  managerName: string;
};

export default (state: State = initialState, action): State => {
  switch (action.type) {
    case SET:
      return {
        ...state,
        ...action.payload,
        isProxyMode: true,
      };
    case UNSET:
      return initialState;

    default:
      return state;
  }
};
