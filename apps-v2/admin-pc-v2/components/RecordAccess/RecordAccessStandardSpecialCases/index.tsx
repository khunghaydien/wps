import React from 'react';

import { RecordAccessHierarchyRecord } from '@apps/admin-pc-v2/models/recordAccess/RecordAccess';
import { Department } from '@apps/domain/models/organization/Department';

import DepartmentSearchDialog from '@admin-pc-v2/components/RecordAccess/RecordAccessTargetToGivePrivilege/DepartmentSearchDialog';

import RecordAccessStandardTargetTable from './RecordAccessStandardTargetTable';

import './index.scss';

type Props = {
  tableDisabled: boolean;
  recordAccessHierarchyRecords: Array<RecordAccessHierarchyRecord>;
  targetDate: string;
  isOpenDepartmentDialog: boolean;
  onDeleteTargets: (recordAccessHierarchyRecordid?: Array<string>) => void;
  onCloseDeptDialog: () => void;
  onOpenDeptDialog: () => void;
  onAddDepartments: (departments: Array<Department>) => void;
  onSearchDepartment: (code: string, name: string) => void;
  changeValueOfRecordAccessHierarchyRecord: (
    deptCode: string,
    key: string,
    e: React.ChangeEvent<HTMLInputElement>,
    recordAccessHierarchyRecords: Array<RecordAccessHierarchyRecord>
  ) => void;
};
const ROOT = 'record-access-target-Standard';
const RecordAccessStandardSpecialCases = (props: Props) => {
  const {
    tableDisabled,
    recordAccessHierarchyRecords,
    targetDate,
    isOpenDepartmentDialog,
    onDeleteTargets,
    onCloseDeptDialog,
    onOpenDeptDialog,
    onAddDepartments,
    onSearchDepartment,
    changeValueOfRecordAccessHierarchyRecord,
  } = props;
  return (
    <div className={ROOT}>
      <RecordAccessStandardTargetTable
        disabled={tableDisabled}
        onOpenDeptDialog={onOpenDeptDialog}
        onDeleteTargets={onDeleteTargets}
        rows={[...(recordAccessHierarchyRecords || [])]}
        changeValueOfRecordAccessHierarchyRecord={
          changeValueOfRecordAccessHierarchyRecord
        }
      />
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
    </div>
  );
};

export default RecordAccessStandardSpecialCases;
