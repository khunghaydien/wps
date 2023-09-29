import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import msg from '@apps/commons/languages';

import './index.scss';

const ROOT = 'ts-psa__role-memo-dialog';

type FormikProps = {
  setFieldValue: (key: string, value: string) => void;
  values: {
    memo: string;
  };
};

type Props = {
  handleSubmit: () => void;
  hideDialog: () => void;
  memoType: string;
} & FormikProps;

const MEMO_TRANSLATIONS = {
  MEMO_FOR_ALL: 'Psa_Lbl_RoleMemoForAll',
  MEMO_FOR_MANAGERS: 'Psa_Lbl_RoleMemoForManagers',
  MEMO_FOR_RM: 'Psa_Lbl_RoleMemoForRM',
};

const RoleMemoDialog = (props: Props) => {
  const { values, memoType } = props;
  const initialTextLength = values.memo ? values.memo.length : 0;
  const [textAreaLength, setTextAreaLength] = useState(initialTextLength);

  const onChangeTextArea = (e: any) => {
    const text = e.target.value;
    props.setFieldValue('memo', text.substring(0, 1000));
    setTextAreaLength(text.length > 1000 ? 1000 : text.length);
  };

  return (
    <DialogFrame
      title={msg()[MEMO_TRANSLATIONS[memoType]]}
      hide={props.hideDialog}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            onClick={props.hideDialog}
            data-testid={`${ROOT}__btn--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            onClick={props.handleSubmit}
            data-testid={`${ROOT}__btn--save`}
          >
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <TextAreaField
          placeholder={msg().Psa_Lbl_RoleMemoPlaceholder}
          onChange={onChangeTextArea}
          value={values.memo || ''}
          resize="none"
        />
        <span className={`${ROOT}__textarea-countdown`}>
          {`${textAreaLength}/1000`}
        </span>
      </div>
    </DialogFrame>
  );
};

export default RoleMemoDialog;
