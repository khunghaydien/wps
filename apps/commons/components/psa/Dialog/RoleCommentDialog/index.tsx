import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import msg from '@apps/commons/languages';

import './index.scss';

const ROOT = 'ts-psa__comment-role-dialog';

type FormikProps = {
  setFieldValue: (key: string, value: string) => void;
  values: {
    comments: string;
  };
};

type Props = {
  handleSubmit: () => void;
  hideDialog: () => void;
  primaryAction: string;
} & FormikProps;

const RoleCommentDialog = (props: Props) => {
  const { values, primaryAction } = props;
  const [textAreaLength, setTextAreaLength] = useState(0);

  const onChangeTextArea = (e: any) => {
    const text = e.target.value;
    props.setFieldValue('comments', text.substring(0, 1000));
    setTextAreaLength(text.length > 1000 ? 1000 : text.length);
  };

  return (
    <DialogFrame
      title={msg()[`Psa_Lbl_RoleCommentHeader${primaryAction}`]}
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
            {msg().Psa_Lbl_RoleCommentBtn}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <TextAreaField
          placeholder={msg().Psa_Lbl_RoleCommentPlaceholder}
          onChange={onChangeTextArea}
          value={values.comments}
          resize="none"
        />
        <span className={`${ROOT}__textarea-countdown`}>
          {`${textAreaLength}/1000`}
        </span>
      </div>
    </DialogFrame>
  );
};

export default RoleCommentDialog;
