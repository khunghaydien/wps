import React from 'react';

import SelectTargetDialog from './SelectTargetDialog';
import DepartmentSearchDialog from './DepartmentSearchDialog';
import RecordAccessPrivilegeTargetTable from './RecordAccessPrivilegeTargetTable';
import TargetEmployeesSearchDialog from '@admin-pc/containers/DelegateApprover/EmployeesSearchDialogContainer';

import {
  DepartmentRecordAccessPatternRecord,
  EmployeeRecordAccessPatternRecord,
} from '@apps/admin-pc-v2/models/recordAccess/RecordAccess';
import { Department } from '@apps/domain/models/organization/Department';
import { EmployeeShowObj } from '@admin-pc/models/DelegatedApprover';
import { TARGET } from '@apps/admin-pc-v2/constants/configList/recordAccessPrivilege';

import './RecordAccessTargetToGivePrivilege.scss';

type Props = {
  tableDisabled: boolean;
  deptRecordAccessPtnRecords?: Array<DepartmentRecordAccessPatternRecord>;
  empRecordAccessPtnRecords?: Array<EmployeeRecordAccessPatternRecord>;
  target: TARGET;
  targetDate: string;
  isOpenTargetDialog: boolean;
  isOpenDepartmentDialog: boolean;
  isOpenEmployeeDialog: boolean;
  onDeleteTargets: (
    empRecordAccessPtnIds?: Array<string>,
    deptRecordAccessPtnIds?: Array<string>
  ) => void;
  onOpenTargetDialog: () => void;
  onCloseTargetDialog: () => void;
  onCloseDeptDialog: () => void;
  onCloseEmpDialog: () => void;
  onSelectTargetDialog: (target: TARGET) => void;
  onAddDepartments: (departments: Array<Department>) => void;
  onAddEmployees: (employees: Array<EmployeeShowObj>) => void;
  onSearchDepartment: (code: string, name: string) => void;
};
const ROOT = 'record-access-target-privilege';
const RecordAccessTargetToGivePrivilege = (props: Props) => {
  const {
    tableDisabled,
    empRecordAccessPtnRecords,
    deptRecordAccessPtnRecords,
    target,
    targetDate,
    isOpenTargetDialog,
    isOpenDepartmentDialog,
    isOpenEmployeeDialog,
    onDeleteTargets,
    onOpenTargetDialog,
    onCloseTargetDialog,
    onCloseDeptDialog,
    onCloseEmpDialog,
    onSelectTargetDialog,
    onAddDepartments,
    onAddEmployees,
    onSearchDepartment,
  } = props;
  return (
    <div className={ROOT}>
      <RecordAccessPrivilegeTargetTable
        disabled={tableDisabled}
        onDeleteTargets={onDeleteTargets}
        onOpenTargetDialog={onOpenTargetDialog}
        rows={[
          ...(deptRecordAccessPtnRecords || []),
          ...(empRecordAccessPtnRecords || []),
        ]}
      />
      {isOpenTargetDialog && (
        <SelectTargetDialog
          onCloseDialog={onCloseTargetDialog}
          target={target}
          onSelectTargetDialog={onSelectTargetDialog}
        />
      )}
      {isOpenDepartmentDialog && (
        <DepartmentSearchDialog
          maxNum={100}
          addSelectedDepartments={onAddDepartments}
          targetDate={targetDate}
          search={onSearchDepartment}
          hideDialog={onCloseDeptDialog}
          isHideDateSearch
        />
      )}
      {isOpenEmployeeDialog && (
        <TargetEmployeesSearchDialog
          select={onAddEmployees}
          cancel={onCloseEmpDialog}
        />
      )}
    </div>
  );
};

export default RecordAccessTargetToGivePrivilege;
