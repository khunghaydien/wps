import * as React from 'react';
import AnimateHeight from 'react-animate-height';

import styled from 'styled-components';

import { Color } from '../styles';

interface HeaderProps {
  onToggle: () => void;
  isOpen: boolean;
}

interface Props {
  children: React.ReactNode;
  header: React.ComponentType<HeaderProps>;
  defaultOpen?: boolean;
}

const S = {
  Wrapper: styled.div`
    background-color: ${Color.base};
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  `,
};

const useAnimateHeight = (initialValue): [boolean, string, () => void] => {
  const [isOpen, setIsOpen] = React.useState(initialValue);

  const height = React.useMemo(() => {
    return isOpen ? 'auto' : '0';
  }, [isOpen]);

  const toggle = React.useCallback(() => {
    setIsOpen((state) => !state);
  }, [setIsOpen]);

  return [isOpen, height, toggle];
};

const Card: React.FC<Props> = ({ defaultOpen = false, ...props }: Props) => {
  const [isOpen, height, toggle] = useAnimateHeight(defaultOpen);
  const Header = props.header;
  return (
    <S.Wrapper {...props}>
      <Header onToggle={toggle} isOpen={isOpen} />
      <AnimateHeight height={height}>{props.children}</AnimateHeight>
    </S.Wrapper>
  );
};

export default Card;
