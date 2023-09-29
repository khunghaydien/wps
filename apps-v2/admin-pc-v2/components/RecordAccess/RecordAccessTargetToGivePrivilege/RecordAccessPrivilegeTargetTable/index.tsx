import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { TARGET } from '@apps/admin-pc-v2/constants/configList/recordAccessPrivilege';

import Button from '@apps/commons/components/buttons/Button';
import msg from '@commons/languages';

import { DepartmentRecordAccessPatternRecord } from '@apps/admin-pc-v2/models/recordAccess/RecordAccess';

import DataGrid from '@apps/admin-pc/components/DataGrid';

import './RecordAccessPrivilegeTargetTable.scss';

const ROOT = 'record-access-privilege-target-table';

type RAPtnState = DepartmentRecordAccessPatternRecord & {
  typeLabel?: string;
  type?: TARGET;
  name?: string;
  code?: string;
  isSelected?: boolean;
};
type Props = {
  disabled: boolean;
  onOpenTargetDialog: () => void;
  onDeleteTargets: (
    empRecordAccessPtnIds?: Array<string>,
    deptRecordAccessPtnIds?: Array<string>
  ) => void;
  rows: Array<DepartmentRecordAccessPatternRecord>;
};
const RecordAccessPrivilegeTargetTable = (props: Props): React.ReactElement => {
  const { disabled, onOpenTargetDialog, onDeleteTargets, rows } = props;
  const [tableRows, setTableRows] = useState<Array<RAPtnState>>(rows);
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);

  useEffect(() => {
    const convertedRows = rows.map((r) => {
      const type = r.deptBaseId ? TARGET.Department : TARGET.Employee;
      const typeLabel = r.deptBaseId
        ? msg().Admin_Lbl_Department
        : msg().Admin_Lbl_Employee;
      const name = r.deptBaseId ? r.departmentName : r.employeeName;
      const code = r.deptBaseId ? r.departmentCode : r.employeeCode;
      return { ...r, typeLabel, type, name, code };
    });
    setTableRows(convertedRows);
  }, [rows]);

  useEffect(() => {
    const sIds = tableRows.filter((r) => r.isSelected).map((r) => r.id);
    setSelectedIds(sIds);
  }, [tableRows]);

  const toggleRow = (row: RAPtnState) => {
    return {
      ...row,
      isSelected: !row.isSelected,
    };
  };

  const handleRowClick = (rowIdx: number) => {
    if (rowIdx < 0) return;
    const tableRowsClone = cloneDeep(tableRows);
    tableRowsClone[rowIdx] = toggleRow(tableRowsClone[rowIdx]);
    setTableRows(tableRowsClone);
  };

  const handleRowsToggle = (
    rows: Array<{ rowIdx: number; row: RAPtnState }>
  ) => {
    const tableRowsClone = cloneDeep(tableRows);
    rows.forEach((row) => {
      const { rowIdx } = row;
      tableRowsClone[rowIdx] = toggleRow(tableRowsClone[rowIdx]);
    });
    setTableRows(tableRowsClone);
  };

  const onClickDeleteTargets = () => {
    const empRecordAccessPtnIds = [];
    const deptRecordAccessPtnIds = [];
    tableRows
      .filter((r) => r.isSelected)
      .forEach((r) => {
        if (r.type === TARGET.Department) deptRecordAccessPtnIds.push(r.id);
        else empRecordAccessPtnIds.push(r.id);
      });
    onDeleteTargets(empRecordAccessPtnIds, deptRecordAccessPtnIds);
  };

  const addBtn = (
    <Button
      type="secondary"
      className={`${ROOT}__new`}
      onClick={onOpenTargetDialog}
      disabled={disabled}
    >
      {msg().Admin_Lbl_Add}
    </Button>
  );

  const deleteBtn = (
    <Button
      type="destructive"
      disabled={isEmpty(selectedIds)}
      className={`${ROOT}__delete`}
      onClick={onClickDeleteTargets}
    >
      {msg().Com_Btn_Remove}
    </Button>
  );

  const table = (
    <DataGrid
      numberOfRowsVisibleWithoutScrolling={5}
      columns={[
        {
          key: 'typeLabel',
          name: msg().Com_Lbl_Type,
          filterable: true,
        },
        {
          key: 'code',
          name: msg().Admin_Lbl_Code,
          filterable: true,
        },
        {
          key: 'name',
          name: msg().Admin_Lbl_Name,
          filterable: true,
        },
      ]}
      showCheckbox
      rows={tableRows}
      onRowClick={handleRowClick}
      onRowsSelected={handleRowsToggle}
      onRowsDeselected={handleRowsToggle}
      disabled={false}
      //   onFilterChange={onFilterChange}
    />
  );
  return (
    <>
      {addBtn}
      {deleteBtn}
      {table}
    </>
  );
};

export default RecordAccessPrivilegeTargetTable;
