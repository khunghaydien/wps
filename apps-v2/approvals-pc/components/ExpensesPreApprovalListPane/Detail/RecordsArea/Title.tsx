import React from 'react';

import classNames from 'classnames';

import msg from '../../../../../commons/languages';

import './Title.scss';

const ROOT =
  'approvals-pc-expenses-pre-approval-pane-detail__records-area__title';

type Props = { showCostCenterColumn: boolean };

export default class Title extends React.Component<Props> {
  render() {
    const { showCostCenterColumn } = this.props;

    const expTypeClass = classNames(`${ROOT}-exp-type`, {
      [`${ROOT}-exp-type-expand`]: !this.props.showCostCenterColumn,
    });

    return (
      <div className={ROOT}>
        <div className={`${ROOT}-date`}>{msg().Exp_Clbl_Date}</div>
        <div className={expTypeClass}>{msg().Exp_Clbl_ExpenseType}</div>
        {showCostCenterColumn && (
          <div className={`${ROOT}-cost-center`}>
            {msg().Exp_Clbl_CostCenter}
          </div>
        )}
        {/* <div className={`${ROOT}-record-type`}>
         {msg().Exp_Lbl_RecordType}
        </div> */}
        <div className={`${ROOT}-excl-tax`}>{msg().Exp_Clbl_WithoutTax}</div>
        <div className={`${ROOT}-tax`}>{msg().Exp_Clbl_GstAmount}</div>
        <div className={`${ROOT}-amount`}>{msg().Exp_Clbl_Amount}</div>
      </div>
    );
  }
}
