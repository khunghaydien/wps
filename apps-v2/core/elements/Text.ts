import styled, { StyledComponentBase } from 'styled-components';

import { Color } from '../styles';

const Size = {
  xxxl: '24px',
  xxl: '20px',
  xl: '16px',
  large: '13px',
  medium: '12px',
  small: '10px',
};

export type TextSize = keyof typeof Size;

interface Props {
  color?: keyof typeof Color;
  size?: TextSize;
  bold?: boolean;
  style?: Record<string, any>;
  children: string | ReadonlyArray<string>;
}

const Text: StyledComponentBase<'span', any, Props, never> = styled.span<Props>`
  /* stylelint-disable font-family-no-missing-generic-family-keyword */
  font-family: 'Salesforce Sans';
  /* stylelint-enable */
  font-weight: ${({ bold }): string => (bold ? 'bold' : 'normal')};
  font-size: ${({ size = 'medium' }): string => Size[size]};
  color: ${({ color = 'primary' }): string => Color[color]};
  line-height: 1.5;
  overflow: inherit;
  white-space: inherit;
  text-overflow: inherit;
`;

export default Text;
