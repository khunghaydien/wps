import * as React from 'react';

import fieldSize from '../../../constants/fieldSize';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import DateField from '../../../../commons/components/fields/DateField';
import Label from '../../../../commons/components/fields/Label';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';

import './HistoryDialog.scss';

const ROOT = 'admin-pc-contents-detail-pane__dialog';

const { useState } = React;

type Props = {
  onClickCancelButton: () => void;
  onClickSaveButton: (arg0: { targetDate: string; comment: string }) => void;
  title: string;
};

const HistoryDialog = (props: Props) => {
  const [targetDate, setTargetDate] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  return (
    <DialogFrame
      className={`${ROOT}`}
      title={props.title}
      hide={props.onClickCancelButton}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={props.onClickCancelButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            disabled={!targetDate}
            onClick={() => props.onClickSaveButton({ targetDate, comment })}
          >
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__body`}>
        <Label
          text={msg().Admin_Lbl_RevisionDate}
          childCols={fieldSize.SIZE_MEDIUM}
        >
          <DateField
            className="ts-text-field slds-input"
            onChange={setTargetDate}
            value={targetDate}
          />
        </Label>
        <Label
          text={msg().Admin_Lbl_ReasonForRevision}
          childCols={fieldSize.SIZE_MEDIUM}
        >
          <TextField
            className={`${ROOT}__item-name`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
        </Label>
      </div>
    </DialogFrame>
  );
};

export default HistoryDialog;
