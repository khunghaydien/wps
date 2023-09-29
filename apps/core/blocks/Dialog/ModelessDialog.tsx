import * as React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import { useTestId } from '../../hooks';
import { Color } from '../../styles';
// TODO: Eliminate dependency on blocks
import CloseButton from '../buttons/CloseButton';

interface Props {
  'data-testid'?: string;
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  onClose: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const S = {
  Dialog: styled.div`
    background: #fff;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    min-width: 386px;
  `,
  Header: styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 52px;
    border-bottom: 1px ${Color.border1} solid;
  `,
  Title: styled.h2`
    font-size: 16px;
    color: ${Color.secondary};
    padding: 15px 0 16px 20px;
  `,
  ButtonPositioning: styled.div`
    margin: 12px 12px 0 0;
  `,
  Footer: styled.div`
    border-top: 1px ${Color.border1} solid;
    height: 60px;
  `,
};

const ModelessDialog: React.FC<Props> = ({
  title,
  content,
  footer,
  onClose,
  ...props
}: Props) => {
  const rootTestId = useTestId(props);
  const closeTestId = useTestId(props, (testId) => `${testId}__close-button`);
  return (
    <S.Dialog data-testid={rootTestId}>
      <S.Header>
        <S.Title>{title}</S.Title>
        <S.ButtonPositioning>
          <CloseButton onClick={onClose} data-testid={closeTestId} />
        </S.ButtonPositioning>
      </S.Header>
      {content}
      {!isNil(footer) && <S.Footer>{footer}</S.Footer>}
    </S.Dialog>
  );
};

export default ModelessDialog;
