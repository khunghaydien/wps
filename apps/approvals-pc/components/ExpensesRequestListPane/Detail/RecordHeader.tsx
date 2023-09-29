import React from 'react';

import msg from '../../../../commons/languages';

const ROOT = 'approvals-pc-expenses-request-pane-detail-records_header';

type Props = Record<string, unknown>;

export default class RecordHeader extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__date`}>${msg().Appr_Lbl_Date}</div>
        <div className={`${ROOT}__expType`}>${msg().Exp_Lbl_ExpenseType}</div>
        <div className={`${ROOT}__recordType`}>${msg().Exp_Lbl_RecordType}</div>
        <div className={`${ROOT}__amount`}>${msg().Exp_Lbl_Amount}</div>
      </div>
    );
  }
}
