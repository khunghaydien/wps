import * as React from 'react';

import isNil from 'lodash/isNil';

import styled, { css, FlattenInterpolation } from 'styled-components';

import { useKey } from '../hooks';
import { Color } from '../styles';

interface Props extends React.ComponentProps<'input'> {
  disabled?: boolean;
  readOnly?: boolean;
  checked: boolean;
  'data-testid'?: string;
}

const S = {
  Input: styled.input.attrs(() => ({
    type: 'checkbox',
  }))`
    display: none;
  ` as React.ComponentType<Props>,

  Box: styled.div<Props>`
    position: relative;
    width: 16px;
    height: 16px;
    border: 1px solid ${Color.border1};
    background: ${Color.base};
    border-radius: 4px;
    content: '';
    ${({ checked }): FlattenInterpolation<Props> =>
      checked &&
      css`
        border: none;
        background: ${Color.accent};
      `}

    ${({ disabled }): FlattenInterpolation<Props> =>
      disabled &&
      css`
        background: #f3f2f2;
      `}

    ${({ readOnly }): FlattenInterpolation<Props> =>
      readOnly &&
      css`
        border: none;
        background: #e0e5ee;
      `}
  ` as React.ComponentType<Props>,
  Check: styled.div`
    position: absolute;
    top: 3px;
    left: 5px;
    display: block;
    width: 6px;
    height: 8px;
    border-right: 2px solid ${Color.base};
    border-bottom: 2px solid ${Color.base};
    content: '';
    transform: rotate(40deg);
  ` as React.ComponentType<Props>,

  CheckBox: styled.label`
    display: flex;
    align-items: center;
  `,

  Label: styled.span`
    margin-left: 8px;
  `,
};

const CheckBox: React.FC<Props> = ({
  'data-testid': dataTestId,
  children,
  onClick: $onClick,
  ...props
}: Props) => {
  const onClick = React.useMemo(
    () =>
      props.readOnly || props.disabled
        ? (e) => {
            e.preventDefault();
          }
        : $onClick,
    [$onClick, props.disabled, props.readOnly]
  );
  const inputKey = useKey();
  const boxKey = useKey();
  const labelKey = useKey();
  return (
    <S.CheckBox>
      <S.Input
        key={inputKey}
        data-testid={dataTestId}
        {...props}
        onClick={onClick}
      />
      <S.Box key={boxKey} {...props} onClick={onClick}>
        {props.checked && <S.Check {...props} onClick={onClick} />}
      </S.Box>
      {!isNil(children) && <S.Label key={labelKey}>{children}</S.Label>}
    </S.CheckBox>
  );
};

CheckBox.defaultProps = {
  disabled: false,
  readOnly: false,
};

export default CheckBox;
