import React from 'react';

import styled from 'styled-components';

import { Spinner } from '../../../core';

type Props = {
  active: boolean;
};

const Block = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease, visibility 0s;
  transition-delay: 0s, 0.3s;
  z-index: 1;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
`;

const LoadingScreen = ({ active }: Props): React.ReactElement => {
  return (
    <>
      {active && (
        <Block>
          <Spinner />
        </Block>
      )}
    </>
  );
};

export default LoadingScreen;
