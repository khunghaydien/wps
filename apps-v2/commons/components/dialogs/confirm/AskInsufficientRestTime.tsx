import React from 'react';

import TextUtil from '../../../utils/TextUtil';

import msg from '../../../languages';
import { CustomConfirmDialogComponent } from '../ConfirmDialog';

type Params = {
  insufficientRestTime: number;
  targetDate?: string;
  employeeId?: string;
};

type Props = {
  ConfirmDialog: React.ComponentClass<any>;
  params: Params;
};

// @ts-ignore
const AskFillDailyRestTime: CustomConfirmDialogComponent<Params> = (
  props: Props
) => {
  const { ConfirmDialog, params } = props;
  return (
    <ConfirmDialog okButtonLabel={msg().Com_Lbl_SaveRestHours}>
      {TextUtil.template(
        msg().Com_Msg_InsufficientRestTime,
        params.insufficientRestTime
      )}
    </ConfirmDialog>
  );
};

export default AskFillDailyRestTime;
