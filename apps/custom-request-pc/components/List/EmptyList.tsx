import React from 'react';

import styled from 'styled-components';

import backgroundImg from '@apps/commons/images/iconbackGround.png';
import msg from '@apps/commons/languages';
import colors from '@apps/commons/styles/exp/variables/_colors.scss';

const S = {
  EmptyList: styled.div`
    height: 100%;
    padding-top: 400px;
    background-image: url(${backgroundImg});
    background-position: 50% 100px;
    background-repeat: no-repeat;
    color: ${colors.textModest};
    font-size: 15px;
    text-align: center;
  `,
};

const EmptyList = () => (
  <S.EmptyList>{msg().Exp_Msg_CreateNewCustomRequest}</S.EmptyList>
);

export default EmptyList;
