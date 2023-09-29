import * as React from 'react';

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
  top: ${({ top }): number | string => top};
  left: ${({ left }): number | string => left};
  display: ${({ isOpen }): string => (isOpen ? 'block' : 'none')};
  z-index: 500001;
`;

const Popup: React.FC<Props> = (props: Props) => {
  const ref = React.useRef();
  useClickOutside(ref, () => {
    if (props.onClickOutside) {
      props.onClickOutside();
    }
  });

  return <>{props.isOpen && <Window {...props} ref={ref} />}</>;
};

export default Popup;
