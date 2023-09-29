import React, { SyntheticEvent } from 'react';
import ReactDataGrid from 'react-data-grid';

import msg from '../../../commons/languages';

import {
  DelegatedApprover,
  EmployeeShowObj,
} from '../../models/DelegatedApprover';

import './ApproverGrid.scss';

const ROOT = 'ts-expenses-modal-delegate-approver-grid';

type SettingItem = DelegatedApprover | EmployeeShowObj;

type Props = {
  items: Array<SettingItem>;
  updateValue: (target: string, e: SyntheticEvent) => void;
  selectedIndexes: Array<string>;
  onRowsSelected: (
    array: Array<{
      row: EmployeeShowObj;
    }>
  ) => void;
  onRowsDeselected: (
    array: Array<{
      row: EmployeeShowObj;
    }>
  ) => void;
};

export default class ApproverGrid extends React.Component<Props> {
  render() {
    const {
      onRowsSelected,
      onRowsDeselected,
      selectedIndexes,
      updateValue,
      items,
    } = this.props;

    const rows: any = items.map((item: any) => {
      let id;
      let code;
      let name;
      let isActiveSFUserAcc;
      let isRequestChecked;
      let isExpenseChecked;
      let photoUrl;
      if (item.code) {
        const x: EmployeeShowObj = item;
        id = x.id;
        code = x.code;
        name = x.name;
        photoUrl = x.photoUrl;
        isExpenseChecked = false;
        isRequestChecked = false;
        isActiveSFUserAcc = x.isActiveSFUserAcc;
      } else {
        const x: DelegatedApprover = item;
        id = x.delegatedApproverId;
        code = x.delegatedApproverCode;
        name = x.delegatedApproverName;
        photoUrl = x.delegatedApproverPhotoUrl;
        isExpenseChecked = x.canApproveExpenseReportByDelegate;
        isRequestChecked = x.canApproveExpenseRequestByDelegate;
        isActiveSFUserAcc = x.isActiveSFUserAcc;
      }
      const inActiveLabel =
        (!isActiveSFUserAcc && `(${msg().Exp_Lbl_Inactive}) `) || '';
      const nameArea = (
        <div className={`${ROOT}__name`}>
          <img className={`${ROOT}__icon`} src={photoUrl} alt="" />
          <div className={`${ROOT}__info`}>
            <span className={`${ROOT}__code`}>{code}</span>
            <span>
              {inActiveLabel}
              {name}
            </span>
          </div>
        </div>
      );

      return {
        id,
        name: nameArea,
        expense: (
          <input
            type="checkbox"
            disabled={!isActiveSFUserAcc}
            title=""
            name="isExpenseChecked"
            className={`${ROOT}__checkbox`}
            value={id}
            onChange={(e) => updateValue('EXPENSE', e)}
            checked={isExpenseChecked}
          />
        ),
        request: (
          <input
            type="checkbox"
            disabled={!isActiveSFUserAcc}
            title=""
            name="isRequestChecked"
            className={`${ROOT}__checkbox`}
            value={id}
            onChange={(e) => updateValue('REQUEST', e)}
            checked={isRequestChecked}
          />
        ),
      };
    });
    return (
      <div className={`${ROOT}`}>
        <ReactDataGrid
          // @ts-ignore
          numberOfRowsVisibleWithoutScrolling={8}
          columns={[
            { key: 'name', name: msg().Admin_Lbl_Employee },
            { key: 'expense', name: msg().Com_Lbl_ExpenseApproval },
            { key: 'request', name: msg().Com_Lbl_RequestApproval },
          ]}
          rowHeight={45}
          rowGetter={(i: number) => rows[i]}
          rowsCount={rows.length}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected,
            onRowsDeselected,
            selectBy: {
              keys: { rowKey: 'id', values: selectedIndexes },
            },
          }}
        />
      </div>
    );
  }
}
