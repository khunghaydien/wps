import React from 'react';

import styled from 'styled-components';

import { Color } from '../styles';

interface Props {
  children: React.ReactNode;
  backgroundColor: keyof typeof Color;
  color?: keyof typeof Color;
}

const Block = styled.div<Props>`
  color: ${(props: Props): string =>
    props.color ? Color[props.color] : Color.base};
  background-color: ${(props: Props): string => Color[props.backgroundColor]};
  font-size: 12px;
  width: 120px;
  height: 20px;
  border-radius: 2px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`;

const Label: React.FC<Props> = (props: Props) => (
  <Block color={props.color} backgroundColor={props.backgroundColor}>
    {props.children}
  </Block>
);

export default Label;
