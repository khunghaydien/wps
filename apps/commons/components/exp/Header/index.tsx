import React from 'react';

import { VIEW_MODE } from '../../../../domain/models/exp/Report';

import msg from '../../../languages';
import Button from '../../buttons/Button';

import './index.scss';

const ROOT = 'ts-expenses__header';

type Props = {
  isExpenseRequest?: boolean;
  isReadOnlyApexPage?: boolean;
  selectedView: string;
  onClickNewReportButton: () => void;
};

export default class ExpensesHeader extends React.Component<Props> {
  renderNewReportButton() {
    const label = this.props.isExpenseRequest
      ? msg().Exp_Lbl_GeneralExpense
      : msg().Exp_Clbl_NewReport;
    return (
      <Button
        type="secondary"
        data-testid={`${ROOT}__btn-new`}
        onClick={this.props.onClickNewReportButton}
        className={`${ROOT}__btn`}
      >
        {label}
      </Button>
    );
  }

  render() {
    return this.props.isReadOnlyApexPage ||
      this.props.selectedView === VIEW_MODE.REPORT_DETAIL ? null : (
      <div className={ROOT}>
        <div className={`${ROOT}__btn-container`}>
          {this.renderNewReportButton()}
        </div>
      </div>
    );
  }
}
