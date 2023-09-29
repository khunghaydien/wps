import * as React from 'react';

import styled from 'styled-components';

import DateUtil from '@apps/commons/utils/DateUtil';

export { default as Dialog } from '@apps/core/blocks/Dialog';

/**
 * このコンポーネントは廃止予定のダイアログと移行先のダイアログを共存させるためのコンポーネントです。
 * 移行が完了したら @apps/core/hook/useModal を使用することをおすすめします。
 *
 * 廃止： @apps/commons/components/dialogs/DialogFrame
 * 移行先： @apps/core/blocks/Dialog
 */
export const Screen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 500000 !important;
  background-color: rgba(151, 163, 173, 0.75);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.div`
  color: #52678c;
  font-size: 18px;
  font-weight: bold;
`;

const TargetDateContainer = styled.div`
  color: #53688c;
  font-size: 14px;
`;

const TargetDate: React.FC<{
  targetDate: string;
}> = ({ targetDate }) => {
  if (!targetDate) {
    return null;
  }

  const displayYMDd = [
    DateUtil.formatYMD(targetDate),
    `(${DateUtil.formatWeekday(targetDate)})`,
  ].join(' ');

  return (
    <TargetDateContainer>
      <time dateTime={new Date(targetDate).toISOString()}>{displayYMDd}</time>
    </TargetDateContainer>
  );
};

export const DialogHeaderContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 15px 20px;
`;

export const DialogHeader: React.FC<{
  title: string;
  targetDate: string;
}> = ({ title, targetDate }) => {
  return (
    <DialogHeaderContainer>
      <TitleContainer>{title}</TitleContainer>
      <TargetDate targetDate={targetDate} />
    </DialogHeaderContainer>
  );
};

export const DialogFooter = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  padding: 14px 20px;
  button:nth-child(2) {
    margin-left: 16px;
  }
`;
