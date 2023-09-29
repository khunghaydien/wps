import React from 'react';

import msg from '../../../../../commons/languages';
import { LinkButton } from '../../../../../core';

import STATUS, {
  Status,
} from '../../../../../domain/models/approval/request/Status';

type Props = {
  readonly status: Status;
  readonly onClick: () => void;
};

const ApprovalHistoryButton = ({ onClick, status }: Props) => {
  return (
    <>
      {status !== STATUS.NotRequested && (
        <LinkButton onClick={onClick}>
          {msg().Com_Lbl_ApprovalHistory}
        </LinkButton>
      )}
    </>
  );
};

export default ApprovalHistoryButton;
