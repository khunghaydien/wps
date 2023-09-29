import React from 'react';

import DateRangeField from '../../../../commons/components/fields/DateRangeField';
import Label from '../../../../commons/components/fields/Label';
import SelectField from '../../../../commons/components/fields/SelectField';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';

import { LeaveOfAbsence } from '../../../models/leave-of-absence/LeaveOfAbsence';
import { LeaveOfAbsencePeriodStatus } from '../../../models/leave-of-absence/LeaveOfAbsencePeriodStatus';

export type Props = {
  parentViewType: 'Pane' | 'Dialog';
  editingLeaveOfAbsencePeriodStatus: LeaveOfAbsencePeriodStatus;
  leaveOfAbsenceList: LeaveOfAbsence[];
  onUpdateValue: (key: string, value: string) => void;
};

export default class PeriodStatusForm extends React.Component<Props> {
  render() {
    const {
      editingLeaveOfAbsencePeriodStatus,
      leaveOfAbsenceList,
      onUpdateValue,
    } = this.props;

    const leaveOfAbsenceOptions = [
      { text: msg().Admin_Lbl_PleaseSelect, value: '' },
      ...leaveOfAbsenceList.map((leaveOfAbsence) => ({
        text: leaveOfAbsence.name,
        value: leaveOfAbsence.id,
      })),
    ];

    const format = {
      Pane: { labelCols: 3, childCols: 5 },
      Dialog: { labelCols: 4, childCols: 7 },
    }[this.props.parentViewType || 'Pane'];

    return (
      <div>
        <Label {...format} text={msg().Admin_Lbl_ValidDate}>
          <DateRangeField
            startDateFieldProps={{
              value: editingLeaveOfAbsencePeriodStatus.validDateFrom,
              onChange: (value) => onUpdateValue('validDateFrom', value),
            }}
            endDateFieldProps={{
              value: editingLeaveOfAbsencePeriodStatus.validDateThrough,
              onChange: (value) => onUpdateValue('validDateThrough', value),
            }}
            required
          />
        </Label>

        <Label {...format} text={msg().Admin_Lbl_LeaveOfAbsence}>
          <SelectField
            options={leaveOfAbsenceOptions}
            value={editingLeaveOfAbsencePeriodStatus.leaveOfAbsenceId}
            onChange={(e) => onUpdateValue('leaveOfAbsenceId', e.target.value)}
            required
          />
        </Label>

        <Label
          {...format}
          text={msg().Admin_Lbl_ValidDate2}
          helpMsg={msg().Admin_Help_ChildCareUseOnly}
        >
          <DateRangeField
            startDateFieldProps={{
              value: editingLeaveOfAbsencePeriodStatus.validDateFrom2,
              onChange: (value) => onUpdateValue('validDateFrom2', value),
            }}
            endDateFieldProps={{
              value: editingLeaveOfAbsencePeriodStatus.validDateThrough2,
              onChange: (value) => onUpdateValue('validDateThrough2', value),
            }}
          />
        </Label>

        <Label {...format} childCols={8} text={msg().Admin_Lbl_Comment}>
          <TextField
            value={editingLeaveOfAbsencePeriodStatus.comment}
            onChange={(e, value) => onUpdateValue('comment', value)}
            maxLength={1000}
          />
        </Label>
      </div>
    );
  }
}
