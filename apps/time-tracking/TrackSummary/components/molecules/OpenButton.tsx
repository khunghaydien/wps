import * as React from 'react';
import { animated, useSpring } from 'react-spring';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import variables from '../../../../commons/styles/wsp.scss';

import OpenButtonIcon from '../../icons/open-button.svg';
import Button from '../atoms/Button';

type Props = Readonly<{
  disableMotion?: boolean;
  isOpen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}>;

const Block = styled.button`
  border-radius: unset;
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  padding: 0;
  margin: 0;
  width: 60px;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 100%;
  font-size: ${variables['text-button-font-size']};
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
  fill: ${(props: Record<string, any>) => variables[`color-${props.color}`]};
`;

const Text = styled.div`
  font-size: ${variables['text-button-font-size']};
  line-height: ${variables['text-button-line-height']};
  color: ${(props: Record<string, any>) => variables[`color-${props.color}`]};
`;

const Rotate = (props: {
  trigger: boolean;
  rotate: string;
  children: React.ReactNode;
}) => {
  const { transform } = useSpring({
    from: {
      transform: props.trigger ? `rotate(${props.rotate})` : 'rotate(0deg)',
    },
    to: {
      transform: props.trigger ? 'rotate(0deg)' : `rotate(${props.rotate})`,
    },
  }) as any;

  return (
    <animated.div style={{ transform, display: 'inherit' }}>
      {props.children}
    </animated.div>
  );
};

const IconBlock = styled.div`
  margin: 0 4px 0 0;
  display: inherit;
  height: 100%;
`;

const _OpenButton: React.FC<Props> = (props) => (
  <Block onClick={props.onClick}>
    <Row>
      <IconBlock>
        {props.disableMotion ? (
          <Icon as={OpenButtonIcon} color="primary" />
        ) : (
          <Rotate trigger={!props.isOpen} rotate="180deg">
            <Icon as={OpenButtonIcon} color="primary" />
          </Rotate>
        )}
      </IconBlock>
      <Text color="primary">
        {props.isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
      </Text>
    </Row>
  </Block>
);

const OpenButton: React.FC<Props> = (props: Props) => (
  <Button {...props} as={_OpenButton} />
);

export default OpenButton;
