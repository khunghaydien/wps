import React from 'react';

import { isEmpty } from 'lodash';

import { AccountingPeriod } from '../../../../../../../domain/models/exp/AccountingPeriod';
import { CustomHint } from '../../../../../../../domain/models/exp/CustomHint';
import { Report } from '../../../../../../../domain/models/exp/Report';

import ApAndRecordDateContainer from '../../../../../../../expenses-pc/containers/Expenses/AccountingPeriodAndrecordDateContainer';
import RecordDateContainer from '../../../../../../../expenses-pc/containers/Expenses/RecordDateContainer';
import ScheduledDateContainer from '../../../../../../../requests-pc/containers/Requests/ScheduledDateContainer';

type Props = {
  apActive: AccountingPeriod;
  customHint: CustomHint;
  // componentType: string,
  errors: any;
  expReport: Report;
  isExpense?: boolean;
  isFAExpenseTab?: boolean;
  isFARequestTab?: boolean;
  isFinanceApproval?: boolean;
  onChangeEditingExpReport: any;
  readOnly: boolean;
  touched: any;
};

// this class is only used in expense request (not in expense report)
export default class DateSelector extends React.Component<Props> {
  selectComponent() {
    const isExpenseOrFAExpenseTab =
      this.props.isExpense || this.props.isFAExpenseTab;
    const isRequestOrFARequestTab =
      !this.props.isExpense || this.props.isFARequestTab;
    const existActiveAp = !isEmpty(this.props.apActive);

    if (isExpenseOrFAExpenseTab && existActiveAp) {
      return (
        <ApAndRecordDateContainer
          expReport={this.props.expReport}
          customHint={this.props.customHint}
          onChangeEditingExpReport={this.props.onChangeEditingExpReport}
          readOnly={this.props.readOnly}
          isFinanceApproval={this.props.isFinanceApproval}
          errors={this.props.errors}
          touched={this.props.touched}
        />
      );
    } else if (isExpenseOrFAExpenseTab && !existActiveAp) {
      // only RecordDate without accounting period
      return (
        <RecordDateContainer
          expReport={this.props.expReport}
          hintMsg={this.props.customHint.reportHeaderRecordDate}
          onChangeEditingExpReport={this.props.onChangeEditingExpReport}
          readOnly={this.props.readOnly}
          errors={this.props.errors}
          touched={this.props.touched}
          isFinanceApproval={this.props.isFinanceApproval}
        />
      );
    } else if (isRequestOrFARequestTab) {
      return (
        <ScheduledDateContainer
          expReport={this.props.expReport}
          hintMsg={this.props.customHint.reportHeaderScheduledDate}
          isFinanceApproval={this.props.isFinanceApproval}
          onChangeEditingExpReport={this.props.onChangeEditingExpReport}
          readOnly={this.props.readOnly}
          errors={this.props.errors}
          touched={this.props.touched}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return <React.Fragment>{this.selectComponent()}</React.Fragment>;
  }
}
