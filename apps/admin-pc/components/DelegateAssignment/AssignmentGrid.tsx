import React from 'react';
import ReactDataGrid from 'react-data-grid';

import get from 'lodash/get';

import msg from '../../../commons/languages';

import { DelegatedApplicant } from '../../models/DelegatedApplicant';
import {
  DelegatedApprover,
  EmployeeShowObj,
} from '../../models/DelegatedApprover';

import './AssignmentGrid.scss';

const ROOT = 'ts-expenses-modal-delegate-assignment-grid';

export const GRID_KEY = {
  APPROVER: 'Approver',
  APPLICANT: 'Applicant',
};

type SettingItem = DelegatedApprover | EmployeeShowObj | DelegatedApplicant;

type Props = {
  target: string;
  items: Array<SettingItem>;
  getLabel: (arg0: string) => string;
  updateValue: (target: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedIndexes: Array<string>;
  onRowsSelected: (arg0: Array<{ row: EmployeeShowObj }>) => void;
  onRowsDeselected: (arg0: Array<{ row: EmployeeShowObj }>) => void;
};

export default class AssignmentGrid extends React.Component<Props> {
  setEmployeeDisplay = (fields: Record<string, any>, x: EmployeeShowObj) => {
    fields.id = x.id;
    fields.code = x.code;
    fields.name = x.name;
    fields.photoUrl = x.photoUrl;
    fields.isExpenseChecked = false;
    fields.isRequestChecked = false;
    fields.isActiveSFUserAcc = x.isActiveSFUserAcc;
  };

  setDelegateApprover = (fields: Record<string, any>, x: DelegatedApprover) => {
    fields.id = x.delegatedApproverId;
    fields.code = x.delegatedApproverCode;
    fields.name = x.delegatedApproverName;
    fields.photoUrl = x.delegatedApproverPhotoUrl;
    fields.isExpenseChecked = x.canApproveExpenseReportByDelegate;
    fields.isRequestChecked = x.canApproveExpenseRequestByDelegate;
    fields.isActiveSFUserAcc = x.isActiveSFUserAcc;
  };

  setDelegateApplicant = (
    fields: Record<string, any>,
    x: DelegatedApplicant
  ) => {
    fields.id = get(x.delegatee, 'id', '');
    fields.code = get(x.delegatee, 'code', '');
    fields.name = get(x.delegatee, 'name', '');
    fields.photoUrl = get(x.delegatee, 'photoUrl', '');
    fields.isExpenseChecked = get(x.delegatedFor, 'expense', false);
    fields.isRequestChecked = get(x.delegatedFor, 'request', false);
    fields.isActiveSFUserAcc = x.isActiveSFUserAcc;
  };

  render() {
    const {
      target,
      onRowsSelected,
      onRowsDeselected,
      selectedIndexes,
      updateValue,
      items,
      getLabel,
    } = this.props;
    const rows = items.map((item: any) => {
      const fields: EmployeeShowObj | DelegatedApprover | DelegatedApplicant =
        {} as any;
      if (item.code) {
        const x: EmployeeShowObj = item;
        this.setEmployeeDisplay(fields, x);
      } else if (target === GRID_KEY.APPROVER) {
        const x: DelegatedApprover = item;
        this.setDelegateApprover(fields, x);
      } else if (target === GRID_KEY.APPLICANT) {
        const x: DelegatedApplicant = item;
        this.setDelegateApplicant(fields, x);
      }
      const {
        id,
        code,
        name,
        isRequestChecked,
        isExpenseChecked,
        isActiveSFUserAcc,
        photoUrl,
      } = fields as any;

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
        {/* @ts-ignore There is a difference between the types of onRowsSelected and onRowsDeselected and the inferred types. */}
        <ReactDataGrid
          rowHeight={45}
          columns={[
            { key: 'name', name: msg().Admin_Lbl_Employee },
            { key: 'expense', name: getLabel('expense') },
            { key: 'request', name: getLabel('request') },
          ]}
          // @ts-ignore
          rowGetter={(i) => rows[i]}
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
