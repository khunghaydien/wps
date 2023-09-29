import * as React from 'react';

import styled, { css } from 'styled-components';

import { Color, Font } from '../styles';

export type Theme = 'primary' | 'secondary' | 'danger' | 'default';

export interface Props extends React.ComponentProps<'button'> {
  color?: Theme;
}

const themes: Record<Theme, any> = {
  primary: css`
    background: ${Color.accent};
    color: #fff;
    border: none;

    :hover {
      background: #1b59c9;
    }

    :active {
      background: #144399;
    }

    :disabled {
      background: #abbacd;
    }
  `,
  secondary: css`
    background: #05ae06;
    color: #fff;
    border: none;

    :hover {
      background: #037b04;
    }

    :active {
      background: #025703;
    }

    :disabled {
      background: #92af92;
    }
  `,
  danger: css`
    background: ${Color.error};
    color: #fff;
    border: none;

    :hover {
      background: #8e2724;
    }

    :active {
      background: #6b1d1b;
    }

    :disabled {
      background: #bfa8a7;
    }
  `,
  default: css`
    background: #fff;
    color: ${Color.accent};
    border: 1px solid ${Color.border3};

    :hover {
      background: ${Color.hover};
    }

    :active {
      background: ${Color.click};
    }

    :disabled {
      background: #fff;
      color: #d9d9d9;
    }
  `,
};

const Button: React.ComponentType<Props> = styled.button<Props>`
  min-height: 32px;
  border-radius: 4px;
  outline: none;
  appearance: none;
  padding: 0 16px;
  font-size: ${Font.size.L};
  line-height: 17px;
  ${({ color = 'default' }): any => themes[color]};
`;

export default Button;
