import React from 'react';

import msg from '../../../../../languages';

import './index.scss';

const ROOT = 'ts-expenses__form-records__header';

type Props = Record<string, unknown>;

export default class RecordsHeader extends React.Component<Props> {
  render() {
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}-checkbox`}>a</div>
        <div className={`${ROOT}-icon`}>b</div>

        <div className={`${ROOT}-date`}>{msg().Exp_Clbl_Date}</div>

        <div className={`${ROOT}-exptype`}>{msg().Exp_Clbl_ExpenseType}</div>

        <div className={`${ROOT}-amount`}>{msg().Exp_Lbl_Amount}</div>

        <div className={`${ROOT}-evidence`}>{msg().Exp_Lbl_Evidence}</div>

        <div className={`${ROOT}-detail`}>{msg().Exp_Lbl_Detail}</div>
      </div>
    );
  }
}
