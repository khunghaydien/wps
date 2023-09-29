import React from 'react';

import Label from '../../../../commons/components/fields/Label';
import SelectField from '../../../../commons/components/fields/SelectField';
import msg from '../../../../commons/languages';

import { LeaveType } from '../../../models/managed-leave-management/types';

import './LeaveTypeSelector.scss';

const ROOT = 'admin-pc-managed-leave-management-leave-types';

export type Props = {
  leaveTypes: LeaveType[];
  selectedLeaveTypeId: string;
  onChangeLeaveType: (arg0: string) => void;
};

export default class LeaveTypeSelector extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onChangeLeaveType = this.onChangeLeaveType.bind(this);
  }

  onChangeLeaveType(event: React.SyntheticEvent<HTMLSelectElement>) {
    if (event && event.currentTarget) {
      this.props.onChangeLeaveType(event.currentTarget.value);
    }
  }

  render() {
    return (
      <form className={ROOT}>
        <Label
          labelCols={2}
          childCols={2}
          text={msg().Att_Lbl_LeaveType}
          className={`${ROOT}__label`}
        >
          <SelectField
            options={[
              {
                text: msg().Admin_Lbl_PleaseSelect,
                value: '',
              },
              ...this.props.leaveTypes.map((leaveType) => ({
                text: leaveType.name,
                value: leaveType.id,
              })),
            ]}
            value={this.props.selectedLeaveTypeId}
            onChange={this.onChangeLeaveType}
          />
        </Label>
      </form>
    );
  }
}
