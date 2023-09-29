import * as React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import Close from '../../assets/icons-generic/close.svg';
import { useTestId } from '../../hooks';

interface Props {
  'data-testid'?: string;
  className?: string;
  title?: string;
  header?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  onClose: (arg0: React.SyntheticEvent<HTMLElement>) => void;
}

const S = {
  Container: styled.div`
    background: transparent;
  `,
  ButtonContainer: styled.div`
    background: transparent;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  `,
  Button: styled.button`
    appearance: none;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0 0 12px 0;

    &:hover {
      cursor: pointer;
    }
  `,
  CloseIcon: styled(Close)`
    width: 20px;
    height: 20px;
    fill: #fff;
  `,
  Dialog: styled.div`
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    border-radius: 4px;
  `,
  Header: styled.div`
    height: 60px;
    background: #f4f6f9;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #d8dde6;
  `,
  Title: styled.h2`
    color: #53688c;
    font-size: 20px;
    font-weight: bold;
    padding: 15px 0 16px 20px;
  `,
  Content: styled.div``,
  Footer: styled.div`
    height: 60px;
    background: #f4f6f9;
    border-top: 1px solid #d8dde6;
    border-radius: 0 0 4px 4px;
  `,
};

const ModalDialog: React.FC<Props> = ({
  className,
  title,
  content,
  footer,
  onClose,
  header,
  ...props
}: Props) => {
  const rootTestId = useTestId(props);
  const closeTestId = useTestId(props, (testId) => `${testId}__close-button`);
  return (
    <S.Container data-testid={rootTestId} className={className}>
      <S.ButtonContainer>
        <S.Button data-testid={closeTestId} onClick={onClose}>
          <S.CloseIcon />
        </S.Button>
      </S.ButtonContainer>
      <S.Dialog>
        <S.Header>
          {isNil(header) ? <S.Title>{title}</S.Title> : header}
        </S.Header>
        <S.Content>{content}</S.Content>
        {!isNil(footer) && <S.Footer>{footer}</S.Footer>}
      </S.Dialog>
    </S.Container>
  );
};

export default ModalDialog;
