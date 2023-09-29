import React from 'react';

import styled from 'styled-components';

import msg from '../../commons/languages';
import { Card, LinkButton, Text, TextField } from '../../core';
import { Color } from '../../core/styles';

type Props = Readonly<{
  'data-testid'?: string;
  defaultOpen?: boolean;
  readOnly?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}>;

const S = {
  Wrapper: styled.div`
    width: 100%;
  `,
  Header: styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: 100%;
    height: 56px;
  `,
  ToggleButton: styled.a`
    font-size: 13px;
  `,
  Divider: styled.hr`
    color: ${Color.border1};
    margin: 0;
    padding: 0;
  `,
  Content: styled.div`
    padding: 20px;
  `,
};

const Header = ({
  onToggle,
  isOpen,
}: {
  onToggle: () => void;
  isOpen: boolean;
}) => {
  return (
    <S.Header>
      <Text size="xl" color="primary" bold>
        {msg().Cal_Lbl_WorkReport}
      </Text>
      <div>
        <S.ToggleButton as={LinkButton} size="large" onClick={onToggle}>
          {isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
        </S.ToggleButton>
      </div>
    </S.Header>
  );
};

const WorkReportCard = ({
  'data-testid': testId,
  defaultOpen = false,
  readOnly = false,
  value,
  onChange,
}: Props) => {
  return (
    <S.Wrapper>
      <Card defaultOpen={defaultOpen} data-testid={testId} header={Header}>
        <S.Divider />
        <S.Content>
          <TextField
            data-testid={testId ? `${testId}__textfield` : undefined}
            readOnly={readOnly}
            resize="vertical"
            maxRows={3}
            minRows={3}
            value={value}
            onChange={onChange}
          />
        </S.Content>
      </Card>
    </S.Wrapper>
  );
};

export default WorkReportCard;
