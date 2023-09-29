import React from 'react';

import styled from 'styled-components';

import { CheckBox } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import msg from '@commons/languages';

import {
  ASSIGNMENT_TYPE,
  DepartmentManager as DepartmentManagerType,
} from '../../models/organization/Department';

import { DIALOG_STATE } from '@admin-pc-v2/modules/departmentManager/ui/dialog';

import TargetEmployeesSearchDialog from '@admin-pc/containers/DelegateApprover/EmployeesSearchDialogContainer';

import DataGrid from '@admin-pc/components/DataGrid';
import PositionSearchDialog from '@admin-pc-v2/components/PositionSearchDialog';

type Props = {
  mode: 'edit' | 'revision' | '';
  managers: DepartmentManagerType[];
  selectedIds: string[];
  setSelectedIds: (arg0: string[]) => void;
  dialog: typeof DIALOG_STATE[keyof typeof DIALOG_STATE];
  openSelectEmployeesDialog: () => void;
  openSelectPositionsDialog: () => void;
  searchPosition: (code: string, name: string) => unknown;
  closeDialog: () => void;
  addManagers: (
    arg1: typeof ASSIGNMENT_TYPE[keyof typeof ASSIGNMENT_TYPE]
  ) => (arg1: RowItem[]) => void;
  deleteManagers: () => void;
  onPrimaryManagerChanged: (
    arg0: string,
    arg1: React.ChangeEvent<HTMLInputElement>,
    arg2: DepartmentManagerType[]
  ) => void;
};

export type RowItem = {
  id: string;
  assignmentType: string;
  code: string;
  name: string;
  primary: boolean;
  isSelected?: boolean;
  editable?: boolean;

  // NOTE 望ましくないが、ReactDateGridのformatterにデータ操作を注入するため、やむをえずrowに依存データを持たせている
  //      ref: https://github.com/adazzle/react-data-grid/issues/2291
  managers: DepartmentManagerType[];
};

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

const isEmployee = (x) => x === ASSIGNMENT_TYPE.EMPLOYEE;
const isPosition = (x) => x === ASSIGNMENT_TYPE.POSITION;

const createRow = (
  listItem: DepartmentManagerType,
  _,
  managers: DepartmentManagerType[]
) => {
  const { id, assignmentType, position, employee, primary } = listItem;
  const { code, name } = isEmployee(assignmentType) ? employee : position;
  return { id, assignmentType, primary, code, name, managers };
};

const nop = () => {};

const DepartmentManager: React.FC<Props> = ({
  selectedIds,
  setSelectedIds,
  ...props
}) => {
  const editable = React.useMemo(
    () => props.mode === 'edit' || props.mode === 'revision',
    [props.mode]
  );

  const managers: RowItem[] = React.useMemo(
    () => (props.managers || []).map(createRow),
    [props.managers]
  );

  const rows: RowItem[] = React.useMemo(
    () =>
      managers.map((i) => ({
        ...i,
        editable,
        isSelected: selectedIds.includes(i.id),
      })),
    [managers, editable, selectedIds]
  );

  const handleRowClick = React.useCallback(
    (rowIdx: number, row: RowItem) => {
      if (rowIdx < 0) {
        const idList = (window.event.target as HTMLInputElement).checked
          ? rows.map(({ id }) => id)
          : [];
        setSelectedIds(idList);
      } else if (selectedIds.includes(row.id)) {
        setSelectedIds(selectedIds.filter((id) => id !== row.id));
      } else {
        setSelectedIds(selectedIds.concat(row.id));
      }
    },
    [rows, selectedIds, setSelectedIds]
  );

  const handleRowsToggle = React.useCallback(
    (rows: Array<{ row: RowItem }>) => {
      if (rows.length > 1) {
        handleRowClick(-1, rows[0].row);
        return;
      }
      handleRowClick(0, rows[0].row);
    },
    [handleRowClick]
  );

  const [addEmployeesAsManagers, addPositionsAsManagers] = React.useMemo(
    () => [
      props.addManagers(ASSIGNMENT_TYPE.EMPLOYEE),
      props.addManagers(ASSIGNMENT_TYPE.POSITION),
    ],
    [props.addManagers]
  );

  return (
    <>
      <S.Container>
        {editable && (
          <S.Buttons>
            <Button type="default" onClick={props.openSelectEmployeesDialog}>
              {msg().Admin_Lbl_AddEmployee}
            </Button>
            <Button type="default" onClick={props.openSelectPositionsDialog}>
              {msg().Admin_Lbl_AddPosition}
            </Button>
            <S.DeleteButton
              type="destructive"
              onClick={props.deleteManagers}
              disabled={selectedIds.length === 0}
            >
              {msg().Com_Btn_Remove}
            </S.DeleteButton>
          </S.Buttons>
        )}

        <S.Grid
          rowHeight={44}
          numberOfRowsVisibleWithoutScrolling={5}
          columns={[
            {
              key: 'assignmentType',
              name: msg().Com_Lbl_Type,
              formatter: ({ row }) =>
                ({
                  [ASSIGNMENT_TYPE.EMPLOYEE]: msg().Admin_Lbl_Employee,
                  [ASSIGNMENT_TYPE.POSITION]: msg().Admin_Lbl_Position,
                }[row.assignmentType] || row.assignmentType),
            },
            {
              key: 'code',
              name: msg().Admin_Lbl_Code,
            },
            {
              key: 'name',
              name: msg().Admin_Lbl_Name,
            },
            {
              key: 'primary',
              name: msg().Admin_Lbl_PrimaryDepartmentManager,
              formatter: ({ row }) => {
                const { assignmentType, id, primary, managers, editable } = row;
                if (!isEmployee(assignmentType)) return null;
                return (
                  <S.Primary>
                    <CheckBox
                      checked={primary}
                      onChange={(e) =>
                        props.onPrimaryManagerChanged(id, e, managers)
                      }
                      readOnly={!editable}
                    />
                  </S.Primary>
                );
              },
            },
          ]}
          showCheckbox
          rows={rows}
          onRowClick={editable ? handleRowClick : nop}
          onRowsSelected={editable ? handleRowsToggle : nop}
          onRowsDeselected={editable ? handleRowsToggle : nop}
        />
      </S.Container>
      {props.dialog === DIALOG_STATE.POSITION && (
        <PositionSearchDialog
          maxNum={100}
          isMultiple
          setPosition={addPositionsAsManagers}
          search={props.searchPosition}
          excludedIds={props.managers
            .filter(({ assignmentType }) => isPosition(assignmentType))
            .map(({ positionId }) => positionId)}
          hideDialog={props.closeDialog}
        />
      )}
      {props.dialog === DIALOG_STATE.EMPLOYEE && (
        <TargetEmployeesSearchDialog
          select={addEmployeesAsManagers}
          excludedEmployees={props.managers
            .filter(({ assignmentType }) => isEmployee(assignmentType))
            .map(({ empBaseId }) => empBaseId)}
          cancel={props.closeDialog}
        />
      )}
    </>
  );
};

export default DepartmentManager;
