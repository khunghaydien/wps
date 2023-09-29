import React from 'react';

import styled, { css } from 'styled-components';

import msg from '@apps/commons/languages';
import { Text } from '@apps/core';

import AddJobButton from './AddJobButton';
import DestinationTask from './DestinationTask';
import Period from './Period';
import SourceTask from './SourceTask';
import { useDestinationTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDestinationTask';

const border = css`
  border-bottom: 1px solid #d8dde6;
`;
const padding = css`
  padding: 4px 26px;
`;

const S = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
  `,
  ColumnHeader: styled.div`
    height: 26px;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    ${border}
    ${padding}
  `,
  DateColumn: styled.div`
    height: 64px;
    display: flex;
    align-items: center;
    ${border}
    ${padding}
  `,
  TaskColumn: styled.div`
    /* TaskRow Height is 48 */
    height: ${48 * 2}px;

    :last-of-type {
      border-bottom: none;
    }

    ${border}
  `,
  TaskRow: styled.div`
    display: flex;
    align-content: center;
    height: 48px;
    border-bottom: 1px solid #d8dde6;
    padding: 4px 26px;
  `,
  EmptyTaskColumn: styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    ${padding}
  `,
  Spacer: styled.div<{ width: string }>`
    width: ${(props): string => props.width}px;
  `,
  Text: styled(Text)<{ width: string }>`
    width: ${(props): string => props.width}px;
  `,
};

const Content: React.FC = () => {
  const [{ jobId }] = useDestinationTask();
  return (
    <S.Wrapper>
      <S.ColumnHeader>
        <S.Text width="160" color="secondary">
          {msg().Trac_Lbl_StartDate}
        </S.Text>
        <S.Spacer width="76" />
        <Text color="secondary">{msg().Trac_Lbl_EndDate}</Text>
      </S.ColumnHeader>
      <S.DateColumn>
        <Period />
      </S.DateColumn>
      <S.ColumnHeader>
        <S.Text width="270" color="secondary">
          {msg().Trac_Lbl_SourceJob}
        </S.Text>
        <S.Spacer width="40" />
        <Text color="secondary">{msg().Trac_Lbl_WorkCategory}</Text>
      </S.ColumnHeader>
      <S.TaskColumn>
        <S.TaskRow>
          <SourceTask />
        </S.TaskRow>
      </S.TaskColumn>
      <S.ColumnHeader>
        <S.Text width="270" color="secondary">
          {msg().Trac_Lbl_DestinationJob}
        </S.Text>
        <S.Spacer width="40" />
        <Text color="secondary">{msg().Trac_Lbl_WorkCategory}</Text>
      </S.ColumnHeader>
      <S.TaskColumn>
        {jobId ? (
          <S.TaskRow>
            <DestinationTask />
          </S.TaskRow>
        ) : (
          <S.EmptyTaskColumn>
            <AddJobButton />
          </S.EmptyTaskColumn>
        )}
      </S.TaskColumn>
    </S.Wrapper>
  );
};

export default Content;
