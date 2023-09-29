import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Card, LinkButton, Text } from '@apps/core';
import { Color } from '@apps/core/styles';

import BasicSetting, { Props as BasicSettingProps } from './BasicSetting';

const S = {
  Wrapper: styled.div`
    flex: 0 0 0;
    width: 100%;
  `,
  Header: styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: 100%;
    height: 40px;
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

export type Props = BasicSettingProps & {
  defaultOpen?: boolean;
};

const BasicSettingCard: React.FC<Props> = ({
  defaultOpen = true,
  ...props
}) => {
  const Header = ({
    onToggle,
    isOpen,
  }: {
    onToggle: () => void;
    isOpen: boolean;
  }) => (
    <S.Header>
      <Text size="xl" color="primary" bold>
        {msg().Time_Lbl_BaseSettings}
      </Text>
      <div>
        <S.ToggleButton as={LinkButton} size="large" onClick={onToggle}>
          {isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
        </S.ToggleButton>
      </div>
    </S.Header>
  );

  return (
    <S.Wrapper>
      <S.Divider />
      <Card defaultOpen={defaultOpen} header={Header}>
        <S.Divider />
        <S.Content>
          <BasicSetting {...props} />
        </S.Content>
      </Card>
    </S.Wrapper>
  );
};

export default BasicSettingCard;
