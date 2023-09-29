import * as React from 'react';

import styled from 'styled-components';

import CloseButton from '../blocks/buttons/CloseButton';

interface Props {
  'data-testid'?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

const S = {
  PopupFrame: styled.div`
    background: #fff;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    min-width: 386px;
  `,
  Header: styled.div`
    height: 68px;
    position: relative;
  `,
  ButtonPositioning: styled.div`
    position: absolute;
    right: 0;
    margin: 12px 12px 0 0;
  `,
  Footer: styled.div`
    height: 72px;
  `,
};

const PopupFrame = (props: Props) => {
  return (
    <S.PopupFrame
      data-testid={
        props['data-testid'] ? `${props['data-testid']}__icon` : undefined
      }
    >
      <S.Header>
        <S.ButtonPositioning>
          <CloseButton onClick={props.onClose} />
        </S.ButtonPositioning>
        {props.header}
      </S.Header>
      {props.children}
      <S.Footer>{props.footer}</S.Footer>
    </S.PopupFrame>
  );
};

export default PopupFrame;
