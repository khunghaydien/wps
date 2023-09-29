import * as React from 'react';

import styled, { css } from 'styled-components';

import { Text } from '../../../../core';

type Props = {
  isOpen: boolean;
  addon?: React.ReactNode;
  message: string;
  align?: 'top' | 'bottom';
};

const Align = {
  top: css`
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
  `,
  bottom: css`
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
  `,
};

const S = {
  Container: styled.div<{ align: 'top' | 'bottom' }>`
    ${({ align }) => Align[align]};
  `,
  Content: styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 224px;
    height: 36px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 17px;
  `,
  Addon: styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    margin: 0 12px 0 0;
  `,
};

const Snackbar = ({ isOpen, addon, message, align = 'top' }: Props) => {
  const snackbar = React.useMemo(() => {
    return (
      <S.Container align={align}>
        <S.Content>
          <S.Addon>{addon}</S.Addon>
          <Text color="base" size="large">
            {message}
          </Text>
        </S.Content>
      </S.Container>
    );
  }, [addon, message]);

  return <>{isOpen && snackbar}</>;
};

export default Snackbar;
