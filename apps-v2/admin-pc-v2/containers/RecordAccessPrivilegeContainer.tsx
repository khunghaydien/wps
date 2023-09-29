import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import configList, {
  TARGET,
} from '@apps/admin-pc-v2/constants/configList/recordAccessPrivilege';

import DateUtil from '@apps/commons/utils/DateUtil';

import { RecordAccessPermissionEnum } from '../models/recordAccess/RecordAccess';

import { setModeBase } from '@admin-pc/modules/base/detail-pane/ui';
import { actions as SortConditionActions } from '@admin-pc/modules/base/list-pane/ui/sortCondition';

import { getChildDepartments } from '@admin-pc-v2/action-dispatchers/department/Detail';
import * as recordAccess from '@admin-pc-v2/actions/recordAccess';
import { changeRecordValue } from '@admin-pc/action-dispatchers/Edit';

import { State } from '@admin-pc-v2/reducers';

import RecordAccessPrivilege from '@apps/admin-pc-v2/presentational-components/RecordAccessPrivilege';

const mapStateToProps = (state: State) => {
  return {
    recordAccess: state.recordAccess,
  };
};

const setRequestParams = (
  param: recordAccess.RecordAccessCreateRequest & {
    target: TARGET;
  }
): recordAccess.RecordAccessCreateRequest & {
  target: TARGET;
} => {
  let permissionType = RecordAccessPermissionEnum.PRIVILEGE;
  if (param.target === TARGET.Employee) {
    delete param.deptBaseId;
    delete param.orgHierarchyPtnId;
    permissionType = RecordAccessPermissionEnum.INDIVIDUAL;
  } else {
    delete param.empBaseId;
  }
  return {
    ...param,
    permissionType,
  };
};

const RecordAccessPrivilegeContainer = (props) => {
  const { companyId } = props;

  const dispatch = useDispatch();
  const stateProps = useSelector(mapStateToProps);
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          search: (param: recordAccess.SearchRecordAccessRequest) =>
            recordAccess.searchRecordAccess({
              ...param,
              permissionTypes: [
                RecordAccessPermissionEnum.PRIVILEGE,
                RecordAccessPermissionEnum.INDIVIDUAL,
              ],
            }),
          create: (
            param: recordAccess.RecordAccessCreateRequest & { target: TARGET }
          ) => {
            return recordAccess.createRecordAccess(setRequestParams(param));
          },
          delete: recordAccess.deleteRecordAccess,
          update: (
            param: recordAccess.RecordAccessCreateRequest & { target: TARGET }
          ) => {
            return recordAccess.updateRecordAccess(setRequestParams(param));
          },
          getRecord: recordAccess.getRecord,
          createRecordAccessHierarchy: recordAccess.createRecordAccessHierarchy,
          getChildDepartments,
          setModeBase,
          changeRecordValue,
          setSortCondition: SortConditionActions.set,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    const { companyId } = props;
    Actions.setSortCondition('code');
    Actions.search({
      companyId,
      targetDate: DateUtil.getToday(),
      permissionTypes: [
        RecordAccessPermissionEnum.PRIVILEGE,
        RecordAccessPermissionEnum.INDIVIDUAL,
      ],
    });
  }, [companyId]);

  const getRecord = (
    configList,
    editRecord,
    actions,
    companyId,
    onClickEditButton,
    modeBase
  ) => {
    const { id } = editRecord;
    // @ts-ignore
    Actions.getRecord(id).then(
      (response: recordAccess.PrivilegeRecordResponse) => {
        const finalResponse: recordAccess.PrivilegeRecordResponse & {
          department?: { code: string; name: string };
          employee?: { code: string; name: string };
        } = { ...response };
        if (!isEmpty(finalResponse.deptBaseId)) {
          finalResponse.target = TARGET.Department;
          finalResponse.department = {
            code: response.departmentCode,
            name: response.departmentName,
          };
        } else {
          finalResponse.target = TARGET.Employee;
          finalResponse.employee = {
            code: response.employeeCode,
            name: response.employeeName,
          };
        }
        finalResponse.validDateTo = DateUtil.addDays(
          finalResponse.validDateTo,
          -1
        );
        props.commonActions.showDetail(
          configList,
          finalResponse,
          actions,
          companyId,
          onClickEditButton,
          modeBase
        );
      }
    );
  };
  const configListRecordAccess = cloneDeep(configList);
  configListRecordAccess.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = companyId;
    }
  });

  return (
    <RecordAccessPrivilege
      {...props}
      search={Actions.search}
      setModeBase={Actions.setModeBase}
      getRecord={getRecord}
      create={Actions.create}
      setSortCondition={Actions.setSortCondition}
      recordAccess={stateProps.recordAccess}
      actions={Actions}
      configList={configListRecordAccess}
    />
  );
};

export default RecordAccessPrivilegeContainer;
