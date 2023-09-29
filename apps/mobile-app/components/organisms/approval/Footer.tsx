import * as React from 'react';

import msg from '../../../../commons/languages';

import Button from '../../atoms/Button';
import TextArea from '../../atoms/Fields/TextArea';

import './Footer.scss';

const ROOT = 'mobile-app-organisms-approval-footer';

export type Props = {
  comment: string;
  onChangeComment: (arg0: string) => void;
  onClickApproveButton: () => void;
  onClickRejectButton: () => void;
};

export default (props: Props) => {
  const [isCommentFocused, setIsCommentFocused] = React.useState(false);
  const onChangeComment = React.useCallback(
    (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      props.onChangeComment(event.currentTarget.value || '');
    },
    [props.onChangeComment]
  );
  return (
    <section className={ROOT}>
      <div className={`${ROOT}__comment-area`}>
        <TextArea
          className={`${ROOT}__comment`}
          placeholder={msg().Appr_Lbl_Comments}
          rows={isCommentFocused ? 2 : 1}
          value={props.comment}
          onChange={onChangeComment}
          onFocus={() => setIsCommentFocused(true)}
          onBlur={() => setIsCommentFocused(false)}
        />
      </div>
      <div className={`${ROOT}__button-area`}>
        <Button
          key="reject"
          className={`${ROOT}__reject-button`}
          priority="primary"
          variant="alert"
          onClick={props.onClickRejectButton}
        >
          {msg().Appr_Btn_Reject}
        </Button>
        <Button
          key="approve"
          priority="primary"
          variant="neutral"
          onClick={props.onClickApproveButton}
        >
          {msg().Appr_Btn_Approve}
        </Button>
      </div>
    </section>
  );
};
