import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import TextArea from '@mobile/components/molecules/commons/Fields/VariableRowsTextArea';

import {
  ACTIONS_FOR_FIX,
  ActionsForFix,
} from '@attendance/domain/models/AttFixSummaryRequest';

import $Button from '@mobile/components/atoms/Button';

import color from '@mobile/styles/variables/_colors.scss';
import unit from '@mobile/styles/variables/_unit.scss';

export const ROOT =
  'mobile-app-components-organisms-attendance-monthly-list-footer';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: ${unit.smallSize};
  border-top: 2px solid ${color.border};
  background: #fff;
`;

const CommentContainer = styled.div`
  padding-bottom: ${unit.mediumSize};
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Button = styled($Button)`
  &&& {
    margin: auto;
  }
`;

const RequestButton: React.FC<{
  performableActionForFix: Props['performableActionForFix'];
  onClick: Props['onClickSendAttendanceRequest'];
}> = ({ performableActionForFix, onClick }) => {
  const testId = `${ROOT}_send_attendance_request`;
  switch (performableActionForFix) {
    case ACTIONS_FOR_FIX.Submit:
      return (
        <Button
          testId={testId}
          variant="add"
          priority="primary"
          onClick={onClick}
        >
          {msg().Att_Btn_SubmitFixMonthlyRequest}
        </Button>
      );
    case ACTIONS_FOR_FIX.CancelRequest:
      return (
        <Button
          testId={testId}
          variant="alert"
          priority="secondary"
          onClick={onClick}
        >
          {msg().Com_Btn_RequestCancel}
        </Button>
      );
    case ACTIONS_FOR_FIX.CancelApproval:
      return (
        <Button
          testId={testId}
          variant="alert"
          priority="secondary"
          onClick={onClick}
        >
          {msg().Com_Btn_ApprovalCancel}
        </Button>
      );
    default:
      return null;
  }
};

type Props = {
  comment: string;
  performableActionForFix: ActionsForFix;
  onChangeComment: (arg0: string) => void;
  onClickSendAttendanceRequest: () => void;
};

const Footer: React.FC<Props> = ({
  comment,
  performableActionForFix,
  onChangeComment,
  onClickSendAttendanceRequest,
}) => {
  const $onChangeComment = React.useCallback(
    (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      onChangeComment(event.currentTarget.value || '');
    },
    [onChangeComment]
  );
  if (performableActionForFix === ACTIONS_FOR_FIX.None) {
    return null;
  }
  return (
    <Container>
      <CommentContainer>
        <TextArea
          testId={`${ROOT}_comment`}
          placeholder={msg().Appr_Lbl_Comments}
          value={comment}
          onChange={$onChangeComment}
        />
      </CommentContainer>
      <ButtonContainer>
        <RequestButton
          performableActionForFix={performableActionForFix}
          onClick={onClickSendAttendanceRequest}
        />
      </ButtonContainer>
    </Container>
  );
};

export default Footer;
