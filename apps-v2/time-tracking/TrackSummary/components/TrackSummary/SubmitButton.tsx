import React from 'react';

import msg from '../../../../commons/languages';

import STATUS, {
  Status,
} from '../../../../domain/models/approval/request/Status';

import AccessControl from '../../containers/AccessControlContainer';

import Button from '../atoms/Button';

type ActionButtonProps = Readonly<{
  disabled?: boolean;
  onClick: () => void | Promise<void>;
}>;

type Props = ActionButtonProps &
  Readonly<{
    status: Status;
  }>;

const Submit = ({ disabled, onClick }: ActionButtonProps) => (
  <AccessControl
    allowIfByEmployee
    requireIfByDelegate={['submitTimeRequestByDelegate']}
  >
    <Button primary disabled={disabled} onClick={onClick}>
      {msg().Time_Action_Submit}
    </Button>
  </AccessControl>
);

const Recall = ({ disabled, onClick }: ActionButtonProps) => (
  <AccessControl
    allowIfByEmployee
    requireIfByDelegate={['cancelTimeRequestByDelegate']}
  >
    <Button error disabled={disabled} onClick={onClick}>
      {msg().Time_Action_Recall}
    </Button>
  </AccessControl>
);

const CancelApproval = ({ disabled, onClick }: ActionButtonProps) => (
  <AccessControl
    requireIfByEmployee={['cancelTimeApprovalByEmployee']}
    requireIfByDelegate={['cancelTimeApprovalByDelegate']}
  >
    <Button error disabled={disabled} onClick={onClick}>
      {msg().Time_Action_CancelApproval}
    </Button>
  </AccessControl>
);

const ButtonSet = {
  // Status => Action
  [STATUS.NotRequested]: Submit,
  [STATUS.Rejected]: Submit,
  [STATUS.Recalled]: Submit,
  [STATUS.Canceled]: Submit,
  [STATUS.Pending]: Recall,
  [STATUS.Approved]: CancelApproval,
  // Never used here
  [STATUS.ApprovalIn]: null,
  [STATUS.Reapplying]: null,
  [STATUS.ApprovedPreRequest]: null,
  // fallback
  '': null,
};

const SubmitButton: React.FC<Props> = ({ status, ...props }) => {
  const ActionButton = ButtonSet[status];
  return <>{ActionButton && <ActionButton status={status} {...props} />}</>;
};

export default SubmitButton;
