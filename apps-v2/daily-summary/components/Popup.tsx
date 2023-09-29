import * as React from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';

import useClickOutside from './hooks/useClickOutside';

type Props = {
  top: number | string;
  left: number | string;
  isOpen?: boolean;
  onClickOutside?: () => void;
  children: React.ReactNode;
};

const Window = styled.div<Props>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 6000001;
`;

const Portal = ({ children }: { children: React.ReactNode }) => {
  const container = 'daily-summary-popup';
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

const Popup: React.FC<Props> = ({ onClickOutside, ...props }) => {
  const ref = React.useRef();
  useClickOutside(ref, () => {
    if (onClickOutside) {
      onClickOutside();
    }
  });

  return (
    <>
      {props.isOpen && (
        <Portal>
          <Window {...props} ref={ref} />
        </Portal>
      )}
    </>
  );
};

export default Popup;
