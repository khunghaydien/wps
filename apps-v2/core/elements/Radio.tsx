import * as React from 'react';

import styled, { css } from 'styled-components';

import { Color } from '../styles';

interface Props extends React.ComponentProps<'input'> {
  disabled?: boolean;
  readOnly?: boolean;
  checked?: boolean;
  'aria-labelledby'?: string;
  'data-testid'?: string;
}

const Interaction = {
  Cursor: css<{ disabled?: boolean; readOnly?: boolean }>`
    :hover {
      cursor: ${({ disabled, readOnly }): string =>
        disabled || readOnly ? 'default' : 'pointer'};
    }
  `,
};

const S = {
  Radio: styled.div`
    position: relative;
    display: inline-block;
    height: 16px;
    width: 16px;
    min-height: 16px;
    min-width: 16px;
    border: #dddbda solid 1px;
    border-radius: 50%;
    background: ${Color.base};
    ${Interaction.Cursor};
  `,
  Input: styled.input<Props>`
    appearance: none;
    outline: none;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    ${Interaction.Cursor};

    &[disabled] {
      background: #fef2f2;
    }
  ` as React.ComponentType<Props>,
  Checked: styled.div<{ readOnly?: boolean }>`
    position: absolute;
    top: 2px;
    left: 2px;
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: ${Color.accent};

    &[readonly] {
      background: #e0e5ee;
    }
  `,
};

const Radio: React.FC<Props> = ({ onChange, ...props }: Props) => {
  return (
    <S.Radio
      role="radio"
      aria-checked={props.checked}
      aria-labelledby={props['aria-labelledby']}
    >
      <>
        <S.Input
          {...props}
          type="radio"
          onChange={
            onChange
            /* Ensure controlled component */
          }
          aria-hidden
        />
        {props.checked && <S.Checked aria-hidden readOnly={props.readOnly} />}
      </>
    </S.Radio>
  );
};

export default Radio;
