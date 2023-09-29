import React from 'react';

import msg from '../../../commons/languages';

import { DaysManagedLeave } from '../models/types';

import DaysManagedBlock from './DaysManagedBlock';

import './DaysManagedSection.scss';

const ROOT = 'timesheet-pc-leave-days-managed-section';

type LeaveCategoryProps = {
  title: string;
  daysManagedLeaves: DaysManagedLeave[];
  isWithoutLeaveName: boolean;
};

const LeaveCategory = (props: LeaveCategoryProps) => {
  const { daysManagedLeaves } = props;

  if (!daysManagedLeaves || !daysManagedLeaves.length) {
    return null;
  }

  return (
    <div className={`${ROOT}__category`}>
      <div className={`${ROOT}__category-title`}>{props.title}</div>
      {daysManagedLeaves.map((daysManagedLeave) => (
        <DaysManagedBlock
          key={daysManagedLeave.leaveName}
          daysManagedLeave={daysManagedLeave}
          isWithoutLeaveName={props.isWithoutLeaveName}
        />
      ))}
    </div>
  );
};

export type Props = {
  annualLeave: DaysManagedLeave;
  paidManagedLeave: DaysManagedLeave[];
  unpaidManagedLeave: DaysManagedLeave[];
  compensatoryLeave: DaysManagedLeave[];
};

export default class DaysManagedSection extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <LeaveCategory
          key="annual"
          title={msg().Att_Lbl_AnnualPaidLeave}
          daysManagedLeaves={this.props.annualLeave && [this.props.annualLeave]}
          isWithoutLeaveName
        />

        <LeaveCategory
          key="paid"
          title={msg().Att_Lbl_Paid}
          daysManagedLeaves={this.props.paidManagedLeave}
          isWithoutLeaveName={false}
        />

        <LeaveCategory
          key="unpaid"
          title={msg().Att_Lbl_Unpaid}
          daysManagedLeaves={this.props.unpaidManagedLeave}
          isWithoutLeaveName={false}
        />

        <LeaveCategory
          key="compensatory"
          title={msg().Att_Lbl_CompensatoryLeave}
          daysManagedLeaves={this.props.compensatoryLeave}
          isWithoutLeaveName
        />
      </div>
    );
  }
}
