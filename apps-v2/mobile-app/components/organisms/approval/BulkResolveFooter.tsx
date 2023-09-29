import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import TextArea from '../../molecules/commons/Fields/VariableRowsTextArea';

import Button from '../../atoms/Button';
import { colors, unit } from '@mobile/styles/variables';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: ${unit.smallSize};
  border-top: 2px solid ${colors.border};
  background: #fff;

  .mobile-app-atoms-button {
    padding: 0;
    min-width: 50%;
  }
`;

const CommentArea = styled.div`
  padding-bottom: ${unit.mediumSize};
`;

const ButtonArea = styled.div`
  padding: 0;
`;

export type Props = {
  comment: string;
  onChangeComment: (arg0: string) => void;
  onClickApproveButton: () => void;
};

const BulkResolveFooter: React.FC<Props> = ({
  comment,
  onChangeComment: $onChangeComment,
  onClickApproveButton,
}) => {
  const onChangeComment = React.useCallback(
    (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      $onChangeComment(event.currentTarget.value || '');
    },
    [$onChangeComment]
  );
  return (
    <Container>
      <CommentArea>
        <TextArea
          placeholder={msg().Appr_Lbl_Comments}
          value={comment}
          onChange={onChangeComment}
        />
      </CommentArea>
      <ButtonArea>
        <Button
          key="approve"
          priority="primary"
          variant="neutral"
          onClick={onClickApproveButton}
        >
          {msg().Appr_Btn_Approve}
        </Button>
      </ButtonArea>
    </Container>
  );
};

export default BulkResolveFooter;
