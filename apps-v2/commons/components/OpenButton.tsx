import * as React from 'react';
import { animated, useSpring } from 'react-spring';

import styled from 'styled-components';

import OpenButtonIcon from '../images/icons/open-button.svg';
import msg from '../languages';

import variables from '../styles/wsp.scss';

type Props = Readonly<{
  isDisabled?: boolean;
  isOpen: boolean;
  onClick: (e?: any) => void;
  testId?: string;
}>;

const Button = styled.button`
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
  // @ts-ignore
  const { transform } = useSpring({
    from: {
      transform: props.trigger ? `rotate(${props.rotate})` : 'rotate(0deg)',
    },
    to: {
      transform: props.trigger ? 'rotate(0deg)' : `rotate(${props.rotate})`,
    },
  });

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

const OpenButton = (props: Props) => (
  <Button
    disabled={props.isDisabled}
    type="button"
    onClick={props.onClick}
    data-testid={props.testId}
  >
    <Row>
      <IconBlock>
        <Rotate trigger={!props.isOpen} rotate="180deg">
          <Icon as={OpenButtonIcon} color="primary" />
        </Rotate>
      </IconBlock>
      <Text color="primary">
        {props.isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
      </Text>
    </Row>
  </Button>
);

export default OpenButton;
