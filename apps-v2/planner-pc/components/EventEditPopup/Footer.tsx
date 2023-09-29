import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import { Button } from '../../../core';

type Props = Readonly<{
  hasDelete: boolean;
  onClickSave: () => void;
  onClickDelete: () => void;
  onClickClose: () => void;
}>;

const S = {
  Container: styled.footer`
    width: 100%;
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  Button: styled(Button)`
    width: 80px;
    white-space: nowrap;
    padding: 0;

    :not(:last-child) {
      margin-right: 16px;
    }
  `,
};

const Footer: React.ComponentType<Props> = React.memo((props: Props) => {
  return (
    <S.Container>
      <div>
        {props.hasDelete && (
          <S.Button
            data-testid="event-edit-popup__delete"
            onClick={props.onClickDelete}
            color="danger"
          >
            {msg().Com_Btn_Delete}
          </S.Button>
        )}
      </div>
      <div>
        <S.Button onClick={props.onClickClose}>{msg().Com_Btn_Cancel}</S.Button>
        <S.Button
          data-testid="event-edit-popup__submit"
          onClick={props.onClickSave}
          color="primary"
        >
          {msg().Com_Btn_Save}
        </S.Button>
      </div>
    </S.Container>
  );
});

export default Footer;
