import React from 'react';

import styled from 'styled-components';

import msg from '../../commons/languages';
import { Button } from '../../core';

type Props = {
  readOnly?: boolean;
  isLoading: boolean;
  isDelegated: boolean;
  hasLeave: boolean;
  onSave: (e: React.SyntheticEvent<HTMLElement>) => void;
  onClose: (e: React.SyntheticEvent<HTMLElement>) => void;
  onSaveAndLeave: (e: React.SyntheticEvent<HTMLElement>) => void;
};

const S = {
  Wrapper: styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  `,
  Button: styled(Button)`
    padding: 0 16px;
    margin-left: 16px;
  `,
};

const Footer = (props: Props) => {
  return (
    <S.Wrapper>
      {!props.isLoading && (
        <>
          <S.Button onClick={props.onClose}>{msg().Com_Btn_Cancel}</S.Button>
          {!props.readOnly && (
            <S.Button color="primary" onClick={props.onSave}>
              {msg().Com_Btn_Save}
            </S.Button>
          )}
          {!props.isDelegated && props.hasLeave && (
            <S.Button color="primary" onClick={props.onSaveAndLeave}>
              {msg().Cal_Btn_SaveAndRecordEndTimestamp}
            </S.Button>
          )}
        </>
      )}
    </S.Wrapper>
  );
};

export default Footer;
