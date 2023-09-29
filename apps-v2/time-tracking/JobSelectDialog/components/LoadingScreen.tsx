import React from 'react';

import styled from 'styled-components';

import { Spinner } from '@apps/core';

type Props = {
  isLoading?: boolean;
};

const S = {
  Wrapper: styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    z-index: 50002;
  `,
};

const LoadingScreen = ({ isLoading = false }: Props) => {
  return (
    <>
      {isLoading && (
        <S.Wrapper>
          <Spinner />
        </S.Wrapper>
      )}
    </>
  );
};

export default LoadingScreen;
