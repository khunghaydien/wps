import React from 'react';

import Tooltip from '@commons/components/Tooltip';

import BulkCapacityListItem, { rowItem } from '../BulkCapacityListItem';
import ListHeader from './Header';
import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

export const ROOT = 'ts-capacity_editor_list';

type Props = {
  rows: Array<rowItem> | [];
  removeRow: (rowId: number) => void;
  addEmployees: (employeeArray: Array<any>, rowId: number) => void;
  updateDate: (dateType: string, rowId: number, value: string) => void;
  updateListOfActions: (rowId: number, value: string) => void;
  updateOptions: (rowId: number, value: string) => void;
  updateValue: (rowId: number, value: string) => void;
  addRow: () => void;
  status: Array<any>;
};

const BulkCapacityList = (props: Props) => {
  const generateRows = (rows) => {
    return rows.map((row) => (
      <BulkCapacityListItem
        key={row.id}
        rowId={row.rowId}
        employee={row.employee}
        startDate={row.startDate}
        endDate={row.endDate}
        action={row.action}
        optionSelected={row.optionSelected}
        value={row.value}
        removeRow={props.removeRow}
        addEmployees={props.addEmployees}
        updateDate={props.updateDate}
        updateListOfActions={props.updateListOfActions}
        updateOptions={props.updateOptions}
        updateValue={props.updateValue}
        status={props.status}
        valueError={row.valueError}
      />
    ));
  };

  return (
    <div className="slds-m-around--small">
      <div>
        <Tooltip
          align={'top'}
          content={'Add Row'}
          className={`${ROOT}__add-btn`}
        >
          {/* <span className={`${ROOT}__Add_button_title`}>Add Row</span> */}
          <IconAdd
            data-testid={`${ROOT}--svg-add-btn`}
            className={`${ROOT}__svg_add-btn`}
            onClick={props.addRow}
            type="button"
          />
        </Tooltip>
      </div>
      <ListHeader></ListHeader>
      {generateRows(props.rows)}
    </div>
  );
};

export default BulkCapacityList;
