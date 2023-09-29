import React from 'react';

import styled, { keyframes } from 'styled-components';

import msg from '../../commons/languages';

type Props = {
  loading: boolean;
  className?: string;
};

const loadingAnimations = keyframes`
  0%, 80%, 100% { 
  opacity: 0; 
 }
  40% { 
 opacity: 1; 
 }
`;

const S = {
  Container: styled.div`
    z-index: 2;
    background-color: #ffffffbf;
  `,
  Loader: styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    & > div {
      margin: 5px;
      width: 6px;
      height: 6px;
      background-color: #b0adab;
      border-radius: 6px;
      display: inline-block;
    }
  `,
  DotA: styled.div`
    animation: ${loadingAnimations} 1.4s ease-in-out 0ms infinite;
  `,
  DotB: styled.div`
    animation: ${loadingAnimations} 1.4s ease-in-out 160ms infinite;
  `,
  DotC: styled.div`
    animation: ${loadingAnimations} 1.4s ease-in-out 320ms infinite;
  `,
};

const DotLoader = (props: Props) => {
  const { loading, className } = props;
  const propClassName = className || '';
  return (
    (loading && (
      <S.Container className={`${propClassName}`}>
        <S.Loader role="status" className="slds-dot-loader">
          <span className="slds-assistive-text">{msg().Com_Lbl_Loading}</span>
          <S.DotA className="slds-dot-loader__dot-a"></S.DotA>
          <S.DotB className="slds-dot-loader__dot-b"></S.DotB>
          <S.DotC className="slds-dot-loader__dot-c"></S.DotC>
        </S.Loader>
      </S.Container>
    )) ||
    null
  );
};
export default DotLoader;
