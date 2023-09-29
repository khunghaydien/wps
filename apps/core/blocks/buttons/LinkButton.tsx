import React from 'react';

import styled from 'styled-components';

import { IconType } from '../../elements/Icons';
import { Color } from '../../styles';

const Size = {
  xxxl: '24px',
  xxl: '20px',
  xl: '16px',
  large: '13px',
  medium: '12px',
  small: '10px',
};

interface Props extends React.PropsWithoutRef<React.ComponentProps<'button'>> {
  'data-testid'?: string;
  size?: keyof typeof Size;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
}

const S = {
  Wrapper: styled.button.attrs<Props>(() => ({ type: 'button' }))`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    background: transparent;
    border: none;
    outline: none;
    appearance: none;
    padding: 0;
    color: ${Color.action};

    :disabled,
    [disabled='true'] {
      color: ${Color.disable};
    }
    :hover {
      text-decoration-line: underline;
      cursor: pointer;
    }
    :disabled:hover,
    [disabled='true']:hover {
      cursor: default;
    }
  `,
  TextLink: styled.div<{ size?: keyof typeof Size }>`
    font-size: ${({ size }): string => Size[size || 'medium']};
    line-height: 1.5;
  `,
  Icon: styled.svg<{ iconPosition: 'left' | 'right' }>`
    fill: currentColor;

    /**
     * TODO
     * Define other font sizes when those will be needed
     */
    height: 12px;
    width: 12px;

    &[iconPosition='left'] {
      margin: 0 8px 0 0;
    }
    &[iconPosition='right'] {
      margin: 0 0 0 8px;
    }
  `,
};

const LinkButton: React.ComponentType<Props> = ({
  'data-testid': dataTestId,
  iconPosition = 'left',
  size,
  icon,
  children,
  ...props
}: Props) => {
  return (
    <S.Wrapper {...props}>
      {iconPosition === 'left' && icon && (
        <S.Icon as={icon} iconPosition={iconPosition} />
      )}
      <S.TextLink data-testid={dataTestId} size={size}>
        {children}
      </S.TextLink>
      {iconPosition === 'right' && icon && (
        <S.Icon as={icon} iconPosition={iconPosition} />
      )}
    </S.Wrapper>
  );
};

export default LinkButton;
