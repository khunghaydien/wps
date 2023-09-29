import React from 'react';

import PeriodPicker from '../../../commons/components/fields/PeriodPicker';
import msg from '../../../commons/languages';

import { Period } from '../../../domain/models/attendance/Timesheet';

import './SummaryPeriodNav.scss';

type Props = {
  onPeriodSelected: (arg0: string | null) => void;
  selectedPeriodStartDate?: string;
  summaryPeriodList: Period[];
};

const ROOT = 'timesheet-pc-summary-period-nav';

export default class SummaryPeriodNav extends React.Component<Props> {
  static defaultProps = {
    selectedPeriodStartDate: null,
    summaryPeriodList: null,
  };

  render() {
    if (!this.props.summaryPeriodList) {
      return null;
    }

    let prevPeriodStartDate;
    let nextPeriodStartDate;
    this.props.summaryPeriodList.forEach((testPeriod, index, periodList) => {
      if (testPeriod.startDate === this.props.selectedPeriodStartDate) {
        prevPeriodStartDate = (periodList[index + 1] || {}).startDate;
        nextPeriodStartDate = (periodList[index - 1] || {}).startDate;
      }
    });

    return (
      <div className={ROOT}>
        <PeriodPicker
          currentButtonLabel={msg().Att_Btn_ThisMonth}
          selectValue={this.props.selectedPeriodStartDate || ''}
          selectOptions={this.props.summaryPeriodList.map((period) => ({
            text: period.name,
            value: period.startDate,
          }))}
          onChangeSelect={(value) => this.props.onPeriodSelected(value)}
          onClickPrevButton={() =>
            this.props.onPeriodSelected(prevPeriodStartDate)
          }
          onClickCurrentButton={() => this.props.onPeriodSelected(null)}
          onClickNextButton={() =>
            this.props.onPeriodSelected(nextPeriodStartDate)
          }
          disabledPrevButton={prevPeriodStartDate === undefined}
          disabledNextButton={nextPeriodStartDate === undefined}
        />
      </div>
    );
  }
}
