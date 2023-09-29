import { TARGET } from '../constants/configList/recordAccessPrivilege';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import api from '@apps/commons/api';
import { AppDispatch } from '@apps/commons/modules/AppThunk';

import { RecordAccessPermissionEnum } from '../models/recordAccess/RecordAccess';

import * as base from '@admin-pc/actions/base';

const FUNC_NAME = 'record-access';
const DEPARTMENT_FUNC_NAME = `${FUNC_NAME}/department/pattern`;
const EMPLOYEE_FUNC_NAME = `${FUNC_NAME}/employee/pattern`;
export const SEARCH_RECORD_ACCESS = 'SEARCH_RECORD_ACCESS';
export const SEARCH_RECORD_ACCESS_ERROR = 'SEARCH_RECORD_ACCESS_ERROR';
export const CREATE_RECORD_ACCESS = 'CREATE_RECORD_ACCESS';
export const CREATE_RECORD_ACCESS_ERROR = 'CREATE_RECORD_ACCESS_ERROR';
export const GET_RECORD = 'GET_RECORD';
export const GET_RECORD_ERROR = 'GET_RECORD_ERROR';
export const DELETE_RECORD_ACCESS = 'DELETE_RECORD_ACCESS';
export const DELETE_RECORD_ACCESS_ERROR = 'DELETE_RECORD_ACCESS_ERROR';
export const UPDATE_RECORD_ACCESS = 'UPDATE_RECORD_ACCESS';
export const UPDATE_RECORD_ACCESS_ERROR = 'UPDATE_RECORD_ACCESS_ERROR';
export const CREATE_RECORD_ACCESS_HIERARCHY = '';

export interface SearchRecordAccessRequest {
  companyId: string;
  targetDate: string;
  permissionTypes: Array<RecordAccessPermissionEnum>;
}
export const searchRecordAccess = (param: SearchRecordAccessRequest) => {
  return base.search(
    `${FUNC_NAME}/pattern`,
    param,
    SEARCH_RECORD_ACCESS,
    SEARCH_RECORD_ACCESS_ERROR
  );
};

export interface RecordAccessCreateRequest {
  code: string;
  companyId: string;
  deptBaseId?: string | undefined;
  empBaseId?: string | undefined;
  orgHierarchyPtnId: string;
  permissionType: RecordAccessPermissionEnum;
  validFrom: string;
  validTo: string;
}
export const createRecordAccess = (param: RecordAccessCreateRequest) => {
  return base.create(
    `${FUNC_NAME}/pattern`,
    param,
    CREATE_RECORD_ACCESS,
    CREATE_RECORD_ACCESS_ERROR
  );
};

export const deleteRecordAccess = (param) => {
  return base.del(
    `${FUNC_NAME}/pattern`,
    param,
    DELETE_RECORD_ACCESS,
    DELETE_RECORD_ACCESS_ERROR
  );
};

export const updateRecordAccess = (param) => {
  return base.update(
    `${FUNC_NAME}/pattern`,
    param,
    UPDATE_RECORD_ACCESS,
    UPDATE_RECORD_ACCESS_ERROR
  );
};

export type PrivilegeRecordResponse = {
  id: string;
  companyId: string;
  code: string;
  name: string;
  deptBaseId?: string;
  departmentName?: string; // if deptBaseId exists
  departmentCode?: string; // if deptBaseId exists
  empBaseId?: string;
  employeeName?: string; // if empBaseId exists
  employeeCode?: string; // if empBaseId exists
  orgHierarchyPtnId: string;
  orgHierarchyPtnName: string; // this is localised name depending on EN, JA languages
  permissionType: RecordAccessPermissionEnum;
  validDateFrom: string; // '2020-11-11';
  validDateTo: string; // '2021-11-11';
  lastExecutedDatetime?: string; // only for STANDARD permission type
  empRecordAccessPtnRecords?: Array<// empty for STANDARD
  {
    id: string;
    recordAccessPtnId: string;
    empBaseId?: string;
    employeeName?: string;
    employeeCode?: string;
  }>;
  deptRecordAccessPtnRecords?: Array<// empty for STANDARD
  {
    id: string;
    recordAccessPtnId: string;
    deptBaseId?: string;
    departmentName?: string;
    departmentCode?: string;
  }>;
  recordAccessHierarchyRecords?: Array<{
    id: string;
    recordAccessPtnId: string;
    deptBaseId: string;
    departmentName: string;
    departmentCode: string;
    managerDisabled: boolean;
    parentDisabled: boolean;
    grantRAToDeptMgrOnly: boolean;
  }>;
  managerDisabled: boolean;
  parentDisabled: boolean;
  grantRAToDeptMgrOnly: boolean;
  target?: TARGET;
};
export const getRecord = (patternId: string) => (dispatch) => {
  dispatch(loadingStart());
  const req = {
    path: `/${FUNC_NAME}/pattern/get`,
    param: base.convertToRemoteFormat({ patternId }),
  };
  return api
    .invoke(req)
    .then((res) => {
      dispatch(loadingEnd());
      return res;
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch(catchApiError(err, { isContinuable: true }));
    })
    .finally(() => {
      dispatch(loadingEnd());
    });
};

export const createRecordAccessHierarchy =
  (recordAccessPtnId: string) => (dispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${FUNC_NAME}/hierarchy/generate`,
      param: base.convertFromRemoteFormat({ recordAccessPtnId }),
    };
    return api
      .invoke(req)
      .then((res) => {
        dispatch(loadingEnd());
        return res;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export type RecordAccessHierarchySettingsGetRequest = {
  deptBaseId: string;
  recordAccessPtnId: string;
};
export const getRecordAccessHierarchySettings =
  (param: RecordAccessHierarchySettingsGetRequest) => (dispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${FUNC_NAME}/hierarchy/get`,
      param: base.convertFromRemoteFormat(param),
    };
    return api
      .invoke(req)
      .then((res) => res)
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export type RecordAccessHierarchySettingSaveRequest = {
  id: string;
  disableAccessFromDeptMgr: boolean;
  disableAccessFromParentDept: boolean;
  grantRAToDeptMgrOnly: boolean;
};
export const updateRecordAccessHierarchySettings =
  (param: RecordAccessHierarchySettingSaveRequest) => (dispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${FUNC_NAME}/hierarchy/update`,
      param: base.convertFromRemoteFormat(param),
    };
    return api
      .invoke(req)
      .then((res) => res)
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export type RecordAccessAddDeptRequest = {
  recordAccessPatterns: Array<{
    deptBaseId: string;
    recordAccessPtnId: string;
  }>;
};
export const addDeparments =
  (param: RecordAccessAddDeptRequest) =>
  (dispatch: AppDispatch): Promise<{ ids?: Array<string> }> => {
    dispatch(loadingStart());
    const req = {
      path: `/${DEPARTMENT_FUNC_NAME}/create`,
      param: base.convertFromRemoteFormat(param),
    };
    return api
      .invoke(req)
      .then((res) => res)
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export type RecordAccessAddEmpRequest = {
  recordAccessPatterns: Array<{
    empBaseId: string;
    recordAccessPtnId: string;
  }>;
};
export const addEmployees =
  (param: RecordAccessAddEmpRequest) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${EMPLOYEE_FUNC_NAME}/create`,
      param: base.convertFromRemoteFormat(param),
    };
    return api
      .invoke(req)
      .then((res) => res)
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export const deleteTargets =
  (param: {
    empRecordAccessPtnIds?: Array<string>;
    deptRecordAccessPtnIds?: Array<string>;
  }) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${FUNC_NAME}/privilege-target/pattern/delete`,
      param: base.convertFromRemoteFormat(param),
    };
    return api
      .invoke(req)
      .then((res) => res)
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export const runBatch = () => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  const req = {
    path: `/${FUNC_NAME}/batch/run`,
  };
  return api
    .invoke(req)
    .then((res) => res)
    .catch((err) => {
      dispatch(catchApiError(err, { isContinuable: true }));
    })
    .finally(() => {
      dispatch(loadingEnd());
    });
};

export const getBatchExecutedTimes = () => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  const req = {
    path: `/${FUNC_NAME}/batch/executed-times/get`,
  };
  return api
    .invoke(req)
    .then((res) => res)
    .catch((err) => {
      dispatch(catchApiError(err, { isContinuable: true }));
    })
    .finally(() => {
      dispatch(loadingEnd());
    });
};
