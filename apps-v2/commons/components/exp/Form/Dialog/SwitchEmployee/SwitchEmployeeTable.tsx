import React from 'react';

import {
  Delegator,
  Delegators,
} from '../../../../../../domain/models/exp/DelegateApplicant';

import msg from '../../../../../languages';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '../../../../FixedHeaderTable';

const ROOT = 'ts-expenses-switch-employee-table';
const CELL_CLASS = `${ROOT}__cell ${ROOT}__column`;

type Props = {
  empList: Delegators;
  onClickEmployee: (arg0: Delegator) => void;
};

const SwitchEmployeeTable = (props: Props) => {
  const renderRows = () => {
    const items = props.empList || [];
    const rows = items.map((item) => {
      return (
        // @ts-ignore
        <BodyRow key={item.id} onClick={() => props.onClickEmployee(item)}>
          <BodyCell className={`${CELL_CLASS}-emp-photo-url`}>
            <img
              className={`${ROOT}__icon`}
              src={item.photoUrl}
              alt="Employee"
            />
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-emp-name`}>{item.name}</BodyCell>
          <BodyCell className={`${CELL_CLASS}-emp-code`}>{item.code}</BodyCell>
          <BodyCell className={`${CELL_CLASS}-dep-name`}>
            {item.department.name}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-dep-code`}>
            {item.department.code}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-title`}>{item.title}</BodyCell>
        </BodyRow>
      );
    });
    return rows;
  };

  return (
    <div className={ROOT}>
      <FixedHeaderTable scrollableClass={`${ROOT}__scrollable`}>
        <HeaderRow>
          <HeaderCell className={`${CELL_CLASS}-emp-photo-url`} />
          <HeaderCell className={`${CELL_CLASS}-emp-name`}>
            {msg().Com_Lbl_EmployeeName}
          </HeaderCell>
          <HeaderCell className={`${CELL_CLASS}-emp-code`}>
            {msg().Com_Lbl_EmployeeCode}
          </HeaderCell>
          <HeaderCell className={`${CELL_CLASS}-dep-name`}>
            {msg().Com_Lbl_DepartmentName}
          </HeaderCell>
          <HeaderCell className={`${CELL_CLASS}-dep-code`}>
            {msg().Com_Lbl_DepartmentCode}
          </HeaderCell>
          <HeaderCell className={`${CELL_CLASS}-title`}>
            {msg().Com_Lbl_Title}
          </HeaderCell>
        </HeaderRow>

        {renderRows()}
      </FixedHeaderTable>
    </div>
  );
};

export default SwitchEmployeeTable;
