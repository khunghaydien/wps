import React from 'react';

import { CustomConfirmDialogComponent } from '../../../../../commons/components/dialogs/ConfirmDialog';
import msg from '../../../../../commons/languages';

import './FixSummaryRequestCheckDialog.scss';

const ROOT = 'timesheet-pc-dialogs-fix-summary-request-check-dialog';

type Params = {
  confirmation: string[];
};

const FixSummaryRequestCheckDialog: CustomConfirmDialogComponent<Params> = (
  props
) => {
  const { ConfirmDialog, params } = props;

  return (
    <ConfirmDialog className={ROOT} okButtonLabel={msg().Att_Btn_Submit}>
      <p>{msg().Att_Msg_FixSummaryConfirm}</p>
      <ul className={`${ROOT}__list`}>
        {params.confirmation.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </ConfirmDialog>
  );
};

export default FixSummaryRequestCheckDialog;
