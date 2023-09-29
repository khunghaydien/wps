import React, { FC } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';

import useClickOutside from '@apps/daily-summary/components/hooks/useClickOutside';

type Props = {
  children: React.ReactNode;
  isOpen?: boolean;
  left: number | string;
  top: number | string;
  onClickOutside?: () => void;
};

const Window = styled.div<Props>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 6000001;
`;

const Portal = ({ children }: { children: React.ReactNode }) => {
  const container = 'expense-calendar-popup';
  const ref: { current: Element | null | undefined } = React.useRef<
    Element | null | undefined
  >(document.createElement('div'));
  React.useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute('id', container);
    }
    if (document.body && !document.getElementById(container) && ref.current) {
      document.body.appendChild(ref.current);
    }
    return () => {
      if (document.body && ref.current) {
        document.body.removeChild(ref.current);
      }
    };
  }, [ref.current]);
  return ref.current ? ReactDOM.createPortal(children, ref.current) : null;
};

const Popup: FC<Props> = ({ onClickOutside, ...props }) => {
  const ref = React.useRef();
  useClickOutside(ref, () => {
    if (onClickOutside) {
      onClickOutside();
    }
  });

  if (!props.isOpen) return null;
  return (
    <Portal>
      <Window {...props} ref={ref} />
    </Portal>
  );
};

export default Popup;
