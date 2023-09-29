import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import colors from '@apps/commons/styles/exp/variables/_colors.scss';

import { State } from '@apps/finance-approval-pc/modules';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import TextField from '../../../../fields/TextField';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export type Props = {
  onClickDeleteSearchCondition: () => void;
  onClickHideDialogButton: () => void;
};

const DeleteSearchConditionDialog = ({
  onClickDeleteSearchCondition,
  onClickHideDialogButton,
}: Props) => {
  const inputError = useSelector(
    (state: State) => state.ui.FinanceApproval.dialog.searchCondition.inputError
  );
  const selectedConditionName = useSelector(
    (state: State) =>
      state.ui.FinanceApproval.RequestList.selectedSearchCondition
  );

  return (
    <DialogContainer
      title={msg().Exp_Btn_DeleteSearchCondition}
      hide={onClickHideDialogButton}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button type="destructive" onClick={onClickDeleteSearchCondition}>
            {msg().Com_Btn_Delete}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <DialogContents>
        <Label>{msg().Exp_Lbl_SearchConditionName}</Label>

        <Value value={selectedConditionName} disabled />
      </DialogContents>

      {inputError && <ErrorMessage>{inputError}</ErrorMessage>}
    </DialogContainer>
  );
};

export default DeleteSearchConditionDialog;

const DialogContainer = styled(DialogFrame)`
  width: 580px;
`;

const DialogContents = styled.div`
  padding: 40px;
`;

const Label = styled.div`
  padding-bottom: 5px;
  color: ${colors.textModest};
`;

const Value = styled(TextField)`
  color: ${colors.textModest} !important;
`;

const ErrorMessage = styled.div`
  margin-right: 100px;
  margin-bottom: 10px;
  color: red;
  font-size: 15px;
  text-align: right;
`;
