import React from 'react';

import styled from 'styled-components';

import { Color } from '../styles';
import Button, { Props as ButtonProps } from './Button';
import { IconType } from './Icons';

interface Props extends ButtonProps {
  icon: IconType;
}

const S = {
  Button: styled(Button)`
    width: 32px;
    height: 32px;
    padding: 0;
  ` as typeof Button,
};

const ActionIconButton: React.FC<Props> = ({
  icon: Icon,
  color = 'default',
  disabled,
  ...props
}: Props) => {
  let iconColor: keyof typeof Color = 'base';
  if (color === 'default') {
    iconColor = disabled ? 'disable' : 'accent';
  }
  return (
    <S.Button {...props} color={color} disabled={disabled}>
      <Icon color={iconColor} />
    </S.Button>
  );
};

export default ActionIconButton;
