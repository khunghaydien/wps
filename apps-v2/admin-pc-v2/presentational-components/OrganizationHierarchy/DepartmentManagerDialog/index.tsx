import React, { useEffect, useState } from 'react';

import { $Values } from 'utility-types';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import msg from '@apps/commons/languages';
import { CheckBox } from '@apps/core';
import DateUtil from '@commons/utils/DateUtil';

import {
  DIALOG_STATE,
  TYPE as DialogType,
} from '@admin-pc-v2/modules/departmentManager/ui/dialog';

import DataGrid from '@admin-pc/components/DataGrid';

import './index.scss';

const ROOT = 'admin-pc-v2-org-department-manager-dialog';

export const ASSIGNMENT_TYPE = Object.freeze({
  EMPLOYEE: 'Employee',
  POSITION: 'Position',
});

type Assignment = $Values<typeof ASSIGNMENT_TYPE>;

type DeptManager = {
  id: string;
  deptBaseId: string;
  companyId: string;
  hierarchyPatternId: string;
  assignmentType: Assignment;
  empBaseId: string;
  positionId: string;
  primary: boolean;
  active: boolean;
  position?: {
    name: string;
    code: string;
  };
  employee?: {
    name: string;
    code: string;
  };
  validFrom: string;
  validTo: string;
};

type Props = {
  deptName: string;
  setDialog: (dialog: DialogType) => void;
  search: () => Promise<DeptManager[]>;
};

const isEmployee = (x) => x === ASSIGNMENT_TYPE.EMPLOYEE;

const formatPeriod = ({
  value,
}: {
  value: { from: string; through: string };
}) => {
  return [
    DateUtil.formatYMD(value.from),
    '-',
    DateUtil.formatYMD(value.through),
  ].join('');
};

const DepartmentManagerDialog = (props: Props) => {
  const { setDialog } = props;
  const [data, setData] = useState<DeptManager[]>([]);

  useEffect(() => {
    props.search().then((res) => {
      setData(res);
    });
  }, []);

  const changeDialog = (nextDialog: DialogType) => () => setDialog(nextDialog);

  const rows = data.map((row: DeptManager) => {
    const isTypeEmployee = isEmployee(row.assignmentType);
    const displayType = isTypeEmployee
      ? msg().Com_Lbl_Employee
      : msg().Admin_Lbl_Position;
    const name = isTypeEmployee ? row.employee.name : row.position.name;
    const code = isTypeEmployee ? row.employee.code : row.position.code;
    const validDate = {
      from: row.validFrom,
      through: DateUtil.addDays(row.validTo, -1),
    };
    return { ...row, displayType, name, code, validDate };
  });

  return (
    <>
      <DialogFrame
        className={ROOT}
        title={msg().Admin_Lbl_DepartmentManager}
        hide={changeDialog(DIALOG_STATE.NONE)}
        footer={
          <DialogFrame.Footer>
            <Button onClick={changeDialog(DIALOG_STATE.NONE)}>
              {msg().Com_Btn_Close}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body`}>
          <div className={`${ROOT}__search-name`}>{props.deptName}</div>
          <DataGrid
            rowHeight={44}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'displayType',
                name: msg().Com_Lbl_Type,
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
                  const { assignmentType, primary } = row;
                  if (!isEmployee(assignmentType)) return null;
                  return (
                    <span className={`${ROOT}__primary`}>
                      <CheckBox checked={primary} readOnly />
                    </span>
                  );
                },
              },
              {
                key: 'validDate',
                name: msg().Admin_Lbl_ValidDate,
                // @ts-ignore
                formatter: formatPeriod,
              },
            ]}
            rows={rows}
          />
        </div>
      </DialogFrame>
    </>
  );
};

export default DepartmentManagerDialog;
