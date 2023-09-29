import * as React from 'react';

import styled from 'styled-components';

import { Color } from '../styles';

type ButtonProps = Omit<React.ComponentProps<'button'>, 'children' | 'ref'>;

interface Props extends ButtonProps {
  'data-testid'?: string;
  alt?: string;
  icon: React.ComponentType<Record<string, unknown>>;
  color?: string;
}

const Icon = styled.svg<{ disabled?: boolean; color: string }>`
  width: 12px;
  outline: none;
  appearance: none;
  border: none;
  fill: ${({ disabled, color }): string => (disabled ? Color.disable : color)};
`;

const Button = styled.button`
  outline: none;
  appearance: none;
  border: none;
  background: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  padding: 0;

  :hover {
    background: ${Color.hover};
  }

  :active {
    background: ${Color.click};
  }

  :disabled,
  :disabled:active,
  :disabled:hover {
    color: ${Color.bgDisabled};
    background: none;
  }
`;

const IconButton: React.FC<Props> = ({
  icon,
  color = '#000',
  onClick,
  ...props
}: Props) => {
  return (
    <Button color={color} onClick={onClick} {...props}>
      <Icon
        as={icon}
        color={color}
        {...props}
        data-testid={
          props['data-testid'] ? `${props['data-testid']}__icon` : undefined
        }
      />
    </Button>
  );
};

export default IconButton;
