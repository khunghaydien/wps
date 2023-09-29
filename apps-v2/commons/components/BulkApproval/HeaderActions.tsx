import React from 'react';

import Button from '@commons/components/buttons/Button';
import msg from '@commons/languages';

import './HeaderActions.scss';

const ROOT = 'ts-bulk-approval-header-actions';

type Props = {
  onClickBulkReject: () => void;
  onClickBulkApproval: () => void;
  disabled: boolean;
  selectedIds: string[];
  allowBulkApproval: boolean;
};

const HeaderActions = (props: Props) => {
  const {
    disabled,
    selectedIds,
    allowBulkApproval,
    onClickBulkReject,
    onClickBulkApproval,
  } = props;
  if (!allowBulkApproval) {
    return null;
  }
  return (
    <div className={ROOT}>
      <div className={`${ROOT}-selected-num`}>
        {`${selectedIds.length} ${msg().Exp_Lbl_Select}`}
      </div>
      <div className={`${ROOT}-actions`}>
        <Button
          className={`${ROOT}-reject`}
          data-testid={`${ROOT}-reject`}
          onClick={onClickBulkReject}
          disabled={disabled}
        >
          {msg().Appr_Btn_Reject}
        </Button>
        <Button
          className={`${ROOT}-approval`}
          data-testid={`${ROOT}-approval`}
          onClick={onClickBulkApproval}
          disabled={disabled}
        >
          {msg().Appr_Btn_Approval}
        </Button>
      </div>
    </div>
  );
};

export default HeaderActions;
