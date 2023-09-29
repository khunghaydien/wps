import React, { useState } from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import msg from '@apps/commons/languages';
import { Check } from '@apps/core/elements/Icons';

import { RecordTypes } from '@custom-request-pc/types';

export const StyledFrame = {
  Dialog: styled(DialogFrame)`
    width: 600px;
  `,
  Header: styled.div`
    color: #333;
    font-size: 13px;
    line-height: 17px;
    height: 30px;
    padding: 0 16px;
    background: #f4f6f9;
    font-weight: 700;
    align-items: center;
    align-content: center;
    display: flex;
  `,
  Form: styled.form`
    height: 500px;
    overflow: auto;
  `,
};

const S = {
  Row: styled.div<{ isSelected?: boolean }>`
    padding: 8px 16px;
    border-bottom: 1px solid #ddd;
    background: ${({ isSelected }): string => (isSelected ? '#E6F4F8' : '')};
    cursor: pointer;
  `,
  Name: styled.div<{ isSelected?: boolean }>`
    color: ${({ isSelected }): string => (isSelected ? '#2782ED' : '#333')};
    font-size: 13px;
    line-height: 17px;
  `,
  Content: styled.div`
    color: #666;
    font-size: 12px;
    line-height: 15px;
  `,
  CheckMark: styled.svg`
    fill: #2782ed;
    width: 12px;
    margin-right: 10px;
  `,
};

export type Props = {
  selectedRecordTypeIdx: number;
  recordTypeList: RecordTypes;
  onHide: () => void;
  onClickNext: (id: string) => void;
};

const Row = ({ name, description, isSelected, onClick }) => (
  <S.Row onClick={onClick} isSelected={isSelected}>
    <S.Name isSelected={isSelected}>
      {isSelected && <S.CheckMark as={Check} />}
      {name}
    </S.Name>
    {description && <S.Content>{description}</S.Content>}
  </S.Row>
);

const Dialog = (props: Props) => {
  const [selectedIdx, setSelectedIdx] = useState(props.selectedRecordTypeIdx);
  const onClickNext = () => {
    if (props.recordTypeList[selectedIdx]) {
      props.onClickNext(props.recordTypeList[selectedIdx].id);
    }
  };
  const disabled = selectedIdx < 0;
  return (
    <StyledFrame.Dialog
      title={msg().Exp_Lbl_NewCustomRequest}
      hide={props.onHide}
      footer={
        <DialogFrame.Footer>
          <Button onClick={props.onHide}>{msg().Com_Btn_Close}</Button>
          <Button type={'primary'} onClick={onClickNext} disabled={disabled}>
            {msg().Com_Lbl_NextButton}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <StyledFrame.Header>{msg().Exp_Lbl_SelectRecordType}</StyledFrame.Header>
      {props.recordTypeList.map((x, idx) => (
        <Row
          name={x.name}
          isSelected={idx === selectedIdx}
          description={x.description}
          onClick={() => setSelectedIdx(idx)}
        />
      ))}
    </StyledFrame.Dialog>
  );
};

export default Dialog;
