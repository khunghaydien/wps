import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import { CheckBox } from '@apps/core';
import msg from '@commons/languages';

import { RecordAccessHierarchyRecord } from '@apps/admin-pc-v2/models/recordAccess/RecordAccess';

import DataGrid from '@apps/admin-pc/components/DataGrid';

import './RecordAccessStandardTargetTable.scss';

const ROOT = 'record-access-standard-target-table';

type RAPtnState = RecordAccessHierarchyRecord & {
  typeLabel?: string;
  name?: string;
  code?: string;
  isSelected?: boolean;
  disabled?: boolean;
  recordAccessHierarchyRecords?: Array<RecordAccessHierarchyRecord>;
};
type Props = {
  disabled: boolean;
  onOpenDeptDialog: () => void;
  onDeleteTargets: (recordAccessHierarchyRecord?: Array<string>) => void;
  rows: Array<RecordAccessHierarchyRecord>;
  changeValueOfRecordAccessHierarchyRecord: (
    deptCode: string,
    key: string,
    e: React.ChangeEvent<HTMLInputElement>,
    recordAccessHierarchyRecords: Array<RecordAccessHierarchyRecord>
  ) => void;
};
const nop = () => {};
const S = {
  Container: styled.div`
    display: inline-block;
    margin-left: 4%;
  `,

  Buttons: styled.div`
    margin: 12px 0;

    > button:not(:first-child) {
      margin-left: 10px;
    }
  `,
  DeleteButton: styled(Button)`
    float: right;
  `,

  Grid: styled(DataGrid)`
    max-width: 451px;
  `,
  Primary: styled.span`
    display: block;
    margin-left: 10px;
  `,
};
const RecordAccessStandardTargetTable = (props: Props): React.ReactElement => {
  const {
    disabled,
    onDeleteTargets,
    onOpenDeptDialog,
    rows,
    changeValueOfRecordAccessHierarchyRecord,
  } = props;
  const [tableRows, setTableRows] = useState<Array<RAPtnState>>(rows);
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);

  useEffect(() => {
    const convertedRows = rows.map((r) => {
      const type = r.deptBaseId;
      const code = r.departmentCode;
      const name = r.departmentName;
      const managerDisabled = r.managerDisabled;
      const parentDisabled = r.parentDisabled;
      const grantRAToDeptMgrOnly = r.grantRAToDeptMgrOnly;
      return {
        ...r,
        type,
        name,
        code,
        managerDisabled,
        parentDisabled,
        grantRAToDeptMgrOnly,
        recordAccessHierarchyRecords: rows,
        disabled,
      };
    });
    setTableRows(convertedRows);
  }, [disabled, rows]);

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
    const deptRecordAccessPtnIds = [];
    tableRows
      .filter((r) => r.isSelected)
      .forEach((r) => {
        deptRecordAccessPtnIds.push(r.departmentCode);
      });
    onDeleteTargets(deptRecordAccessPtnIds);
  };

  const addBtn = !disabled && (
    <Button
      type="secondary"
      className={`${ROOT}__new`}
      onClick={onOpenDeptDialog}
    >
      {msg().Admin_Lbl_Add}
    </Button>
  );

  const deleteBtn = !disabled && (
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
      className={`${ROOT}__columns`}
      columns={[
        {
          key: 'code',
          name: msg().Admin_Lbl_DepartmentCode,
          filterable: true,
          width: 100,
        },
        {
          key: 'name',
          name: msg().Admin_Lbl_DepartmentName,
          filterable: true,
          width: 180,
        },
        {
          key: 'managerDisabled',
          name: msg().Admin_Lbl_DisableAccessDeptManager,
          width: 160,
          formatter: ({ row }) => {
            const {
              managerDisabled,
              departmentCode,
              recordAccessHierarchyRecords,
              disabled,
            } = row;
            return (
              <S.Primary>
                <CheckBox
                  checked={managerDisabled}
                  onChange={(e) => {
                    changeValueOfRecordAccessHierarchyRecord(
                      departmentCode,
                      'managerDisabled',
                      e,
                      recordAccessHierarchyRecords
                    );
                  }}
                  readOnly={disabled}
                />
              </S.Primary>
            );
          },
        },
        {
          key: 'parentDisabled',
          name: msg().Admin_Lbl_DisableAccessParentManager,
          width: 135,
          formatter: ({ row }) => {
            const {
              parentDisabled,
              departmentCode,
              recordAccessHierarchyRecords,
              disabled,
            } = row;
            return (
              <S.Primary>
                <CheckBox
                  checked={parentDisabled}
                  onChange={(e) => {
                    changeValueOfRecordAccessHierarchyRecord(
                      departmentCode,
                      'parentDisabled',
                      e,
                      recordAccessHierarchyRecords
                    );
                  }}
                  readOnly={disabled}
                />
              </S.Primary>
            );
          },
        },
        {
          key: 'grantRAToDeptMgrOnly',
          name: msg().Admin_Lbl_GrantRecordAccessToDeptManagerOnly,
          width: 230,
          formatter: ({ row }) => {
            const {
              grantRAToDeptMgrOnly,
              departmentCode,
              recordAccessHierarchyRecords,
              disabled,
            } = row;
            return (
              <S.Primary>
                <CheckBox
                  checked={grantRAToDeptMgrOnly}
                  onChange={(e) => {
                    changeValueOfRecordAccessHierarchyRecord(
                      departmentCode,
                      'grantRAToDeptMgrOnly',
                      e,
                      recordAccessHierarchyRecords
                    );
                  }}
                  readOnly={disabled}
                />
              </S.Primary>
            );
          },
        },
      ]}
      showCheckbox
      rows={tableRows}
      onRowClick={!disabled ? handleRowClick : nop}
      onRowsSelected={!disabled ? handleRowsToggle : nop}
      onRowsDeselected={!disabled ? handleRowsToggle : nop}
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

export default RecordAccessStandardTargetTable;
