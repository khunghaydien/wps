import React, { useState } from 'react';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import DialogFrame from '../../../../../dialogs/DialogFrame';
import AmountField from '../../../../../fields/AmountField';

import './index.scss';

const ROOT = 'ts-expenses-modal-record-clone-number-input';
const MAX_CLONE_NUMBER = 10;

export type Props = {
  records: string[];
  onClickHideDialogButton: () => void;
  onClickMultiRecordClone: (arg0: number) => void;
};

const RecordCloneNumberDialog = (props: Props) => {
  const { onClickHideDialogButton, onClickMultiRecordClone, records } = props;
  const [cloneNumber, setCloneNumber] = useState(1);
  const isError =
    parseInt(String(cloneNumber)) * records.length > MAX_CLONE_NUMBER;

  return (
    <DialogFrame
      title={msg().Exp_Lbl_CloneMultiple}
      hide={onClickHideDialogButton}
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            disabled={isError || !cloneNumber}
            onClick={() => onClickMultiRecordClone(cloneNumber)}
          >
            {msg().Exp_Lbl_Clone}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <p>{msg().Exp_Lbl_RecordCloneNumberOfDays}</p>
        <div className={`${ROOT}__body`}>
          <AmountField
            className={`${ROOT}__inputbox`}
            fractionDigits={0}
            value={cloneNumber}
            onBlur={(value) => setCloneNumber(Number(value))}
          />
        </div>
        <div className={`${ROOT}__error`}>
          {isError && msg().Exp_Msg_CloneRecordsNumberError}
        </div>
      </div>
    </DialogFrame>
  );
};

export default RecordCloneNumberDialog;
