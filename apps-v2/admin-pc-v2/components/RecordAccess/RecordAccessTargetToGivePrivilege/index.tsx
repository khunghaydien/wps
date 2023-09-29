import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TARGET } from '@admin-pc-v2/constants/configList/recordAccessPrivilege';

import {
  DepartmentRecordAccessPatternRecord,
  EmployeeRecordAccessPatternRecord,
} from '@admin-pc-v2/models/recordAccess/RecordAccess';
import { EmployeeShowObj } from '@admin-pc/models/DelegatedApprover';
import { Record } from '@apps/domain/models/exp/Record';
import { Department } from '@apps/domain/models/organization/Department';

import { MODE } from '@admin-pc/modules/base/detail-pane/ui';

import { searchDepartmentByQuery } from '@admin-pc-v2/action-dispatchers/employee/Detail';
import * as recordAccessActions from '@admin-pc-v2/actions/recordAccess';
import { changeRecordValue } from '@admin-pc/action-dispatchers/Edit';
import { setEditRecord } from '@admin-pc/actions/editRecord';

import RecordAccessTargetToGivePrivilege from './RecordAccessTargetToGivePrivilege';

type Props = {
  mode: string;
  tmpEditRecord: Record & {
    id: string;
    target: TARGET;
    validDateFrom: string;
    companyId?: string;
    deptRecordAccessPtnRecords?: Array<DepartmentRecordAccessPatternRecord>;
    empRecordAccessPtnRecords?: Array<EmployeeRecordAccessPatternRecord>;
  };
};
const RecordAccessTargetToGivePrivilegeContainer = (
  props: Props
): React.ReactElement => {
  const { mode, tmpEditRecord } = props;
  const {
    id,
    target,
    companyId,
    validDateFrom,
    deptRecordAccessPtnRecords,
    empRecordAccessPtnRecords,
  } = tmpEditRecord;
  const dispatch = useDispatch();

  const sortCondition = useSelector(
    // @ts-ignore
    (state) => state.base.listPane.ui.sortCondition
  );
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchDepartments: searchDepartmentByQuery,
          addDepartments: recordAccessActions.addDeparments,
          addEmployees: recordAccessActions.addEmployees,
          deleteTargets: recordAccessActions.deleteTargets,
          changeRecordValue,
          setEditRecord,
          getRecord: recordAccessActions.getRecord,
        },
        dispatch
      ),
    [dispatch]
  );

  const [dialogStates, setDialogStates] = useState<{
    targetDialog: boolean;
    departmentDialog: boolean;
    employeeDialog: boolean;
  }>({ targetDialog: false, departmentDialog: false, employeeDialog: false });

  const onOpenTargetDialog = () =>
    setDialogStates((s) => ({ ...s, targetDialog: true }));
  const onCloseTargetDialog = () =>
    setDialogStates((s) => ({ ...s, targetDialog: false }));
  const onCloseDeptDialog = () =>
    setDialogStates((s) => ({ ...s, departmentDialog: false }));
  const onCloseEmpDialog = () =>
    setDialogStates((s) => ({ ...s, employeeDialog: false }));

  const getRecord = () => {
    // @ts-ignore
    Actions.getRecord(id).then((res) => {
      Actions.setEditRecord({
        ...tmpEditRecord,
        deptRecordAccessPtnRecords: res.deptRecordAccessPtnRecords,
        empRecordAccessPtnRecords: res.empRecordAccessPtnRecords,
      });
    });
  };

  const onSelectTargetDialog = (target: TARGET) => {
    const targetDialog = false;
    if (target === TARGET.Department)
      setDialogStates((s) => ({ ...s, targetDialog, departmentDialog: true }));
    else if (target === TARGET.Employee) {
      setDialogStates((s) => ({ ...s, targetDialog, employeeDialog: true }));
    }
  };

  const onSearchDepartment = (code: string, name: string) => {
    const param = {
      code,
      name,
      targetDate: validDateFrom,
      companyId,
      sortCondition: { ...sortCondition, field: 'code' },
    };
    return Actions.searchDepartments(param);
  };

  const onAddDepartments = (departments: Array<Department>) => {
    Actions.addDepartments({
      recordAccessPatterns: departments.map((d) => ({
        deptBaseId: d.id,
        recordAccessPtnId: id,
      })),
      // @ts-ignore
    }).then(() => {
      getRecord();
    });
    onCloseDeptDialog();
  };

  const onAddEmployees = (employees: Array<EmployeeShowObj>) => {
    Actions.addEmployees({
      recordAccessPatterns: employees.map((d) => ({
        empBaseId: d.id,
        recordAccessPtnId: id,
      })),
      // @ts-ignore
    }).then(() => {
      getRecord();
    });
    onCloseEmpDialog();
  };

  const onDeleteTargets = (
    empRecordAccessPtnIds?: Array<string>,
    deptRecordAccessPtnIds?: Array<string>
  ) => {
    Actions.deleteTargets({
      empRecordAccessPtnIds,
      deptRecordAccessPtnIds,
      // @ts-ignore
    }).then(() => {
      getRecord();
    });
  };

  return (
    <RecordAccessTargetToGivePrivilege
      tableDisabled={mode === MODE.NEW || mode === MODE.EDIT}
      empRecordAccessPtnRecords={empRecordAccessPtnRecords}
      deptRecordAccessPtnRecords={deptRecordAccessPtnRecords}
      target={target}
      targetDate={validDateFrom}
      isOpenTargetDialog={dialogStates.targetDialog}
      isOpenDepartmentDialog={dialogStates.departmentDialog}
      isOpenEmployeeDialog={dialogStates.employeeDialog}
      onDeleteTargets={onDeleteTargets}
      onOpenTargetDialog={onOpenTargetDialog}
      onCloseTargetDialog={onCloseTargetDialog}
      onSelectTargetDialog={onSelectTargetDialog}
      onAddDepartments={onAddDepartments}
      onAddEmployees={onAddEmployees}
      onSearchDepartment={onSearchDepartment}
      onCloseDeptDialog={onCloseDeptDialog}
      onCloseEmpDialog={onCloseEmpDialog}
    />
  );
};

export default RecordAccessTargetToGivePrivilegeContainer;
