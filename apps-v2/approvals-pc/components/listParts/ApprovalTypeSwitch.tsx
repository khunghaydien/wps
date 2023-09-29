import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import ButtonGroups from '../../../commons/components/buttons/ButtonGroups';
import msg from '../../../commons/languages';

import ApprovalType, {
  ApprovalTypeValue,
} from '../../../domain/models/approval/ApprovalType';

type Props = {
  approvalType: ApprovalTypeValue;
  onSwitch: (arg0: ApprovalTypeValue) => void;
  onSwitchToByEmployee?: any;
  onSwitchToByDelegate?: any;
};

export default class ApprovalTypeSwitch extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onSwitchToByEmployee = this.onSwitchToByEmployee.bind(this);
    this.onSwitchToByDelegate = this.onSwitchToByDelegate.bind(this);
  }

  onSwitchToByEmployee() {
    this.props.onSwitch(ApprovalType.ByEmployee);
  }

  onSwitchToByDelegate() {
    this.props.onSwitch(ApprovalType.ByDelegate);
  }

  noop() {}

  render() {
    const { approvalType } = this.props;

    return (
      <ButtonGroups>
        <Button
          type={approvalType === ApprovalType.ByEmployee ? 'primary' : null}
          onClick={
            approvalType !== ApprovalType.ByEmployee
              ? this.onSwitchToByEmployee
              : this.noop
          }
        >
          {msg().Att_Btn_ToYourself}
        </Button>

        <Button
          type={approvalType === ApprovalType.ByDelegate ? 'primary' : null}
          onClick={
            approvalType !== ApprovalType.ByDelegate
              ? this.onSwitchToByDelegate
              : this.noop
          }
        >
          {msg().Att_Btn_ApproveOnBehalf}
        </Button>
      </ButtonGroups>
    );
  }
}
