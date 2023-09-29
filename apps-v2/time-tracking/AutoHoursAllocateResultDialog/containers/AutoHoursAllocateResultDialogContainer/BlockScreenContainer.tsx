import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import { State } from '../../modules';

const Screen = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.75);
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease, visibility 0s;
  transition-delay: 0s, 0.3s;
  z-index: 50001;
`;

const BlockScreenContainer = () => {
  const active = useSelector((state: State) => state.ui.blocking.enabled);

  return <>{active && <Screen />}</>;
};

export default BlockScreenContainer;
