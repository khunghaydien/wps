import React, { FC, useEffect, useRef } from 'react';

import Button from '@commons/components/buttons/Button';
import DialogFrame from '@commons/components/dialogs/DialogFrame';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import TextAreaField from '@commons/components/fields/TextAreaField';
import msg from '@commons/languages';

import './index.scss';

const ROOT = 'commons-dialog-exp-copy-schedule-dialog';

type Props = {
  isOpen: boolean;
  scheduleSummary: string;
  hide: () => void;
};

const ExpCopyScheduleDialog: FC<Props> = ({
  hide,
  isOpen,
  scheduleSummary,
}) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const contentCurrent = contentRef.current;
    if (isOpen && contentCurrent) {
      const textareaElem = contentCurrent.children[1];
      textareaElem.select();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <DialogFrame
      className={ROOT}
      footer={
        <Button className={`${ROOT}__close-btn`} onClick={hide}>
          {msg().Com_Btn_Close}
        </Button>
      }
      hide={hide}
      title={msg().Exp_Lbl_Schedule}
    >
      <div ref={contentRef} className={`${ROOT}__content`}>
        <LabelWithHint
          className={`${ROOT}__label`}
          text={msg().Exp_Msg_CopyPasteScheduleSummary}
        />
        <TextAreaField
          className={`${ROOT}__textarea`}
          value={scheduleSummary}
        />
      </div>
    </DialogFrame>
  );
};

export default ExpCopyScheduleDialog;
