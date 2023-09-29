import React from 'react';

import msg from '../../../../languages';
import MultiColumnsGrid from '../../../MultiColumnsGrid';

import './index.scss';

type Props = {
  isRequest?: boolean;
};

const ROOT = 'ts-expenses__reports-list-header';

export default class ExpensesReportListHeader extends React.Component<Props> {
  render() {
    const amountLabel = this.props.isRequest
      ? msg().Exp_Clbl_EstimatedAmount
      : msg().Exp_Clbl_Amount;
    return (
      <MultiColumnsGrid className={`${ROOT}`} sizeList={[2, 2, 2, 4, 2]}>
        <div className={`${ROOT}--status`}>{msg().Exp_Lbl_Status}</div>
        <div className={`${ROOT}--date`}>{msg().Exp_Lbl_DateSubmitted}</div>
        <div className={`${ROOT}--report-type`}>
          {msg().Exp_Clbl_ReportType}
        </div>
        <div className={`${ROOT}--subject`}>{msg().Exp_Clbl_ReportTitle}</div>
        <div className={`${ROOT}--amount`}>{`${amountLabel}`}</div>
        <div />
      </MultiColumnsGrid>
    );
  }
}
