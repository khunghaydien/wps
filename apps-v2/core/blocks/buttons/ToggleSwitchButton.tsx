import React from 'react';

import styled from 'styled-components';

import { IconType } from '../../elements/Icons';
import { useId, useKey } from '../../hooks';
import { Color } from '../../styles';

export type Switch = {
  /**
   * Label for switch.
   * This property is used for a11y.
   */
  label?: string;

  /**
   * Icon of switch
   */
  icon: IconType;

  /**
   * Value of switch
   */
  value: any;
};

interface Props {
  'data-testid'?: string;
  'aria-labelledby'?: string;
  disabled?: boolean;
  options: [Switch, Switch];
  value: any;
  onClick: (value: any) => void;
}

const S = {
  Wrapper: styled.div`
    display: flex;
    align-items: center;
    width: 64px;
    height: 32px;
    border-radius: 4px;
  `,
  Button: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    appearance: none;
    border: none;
    height: 100%;
    width: 50%;
    padding: 0;

    &[aria-checked='false'] {
      color: #999;
      fill: #999;
      border: 1px solid ${Color.border3};
      background: white;
    }
    :hover {
      background: ${Color.hover};
    }
    :active {
      background: ${Color.click};
    }
    :disabled {
      color: ${Color.bgDisabled};
      fill: ${Color.bgDisabled};
      border: 1px solid ${Color.bgDisabled};
      background: white;
    }

    &[aria-checked='true'] {
      color: white;
      fill: white;
      border: 1px solid ${Color.accent};
      background: ${Color.accent};
      cursor: default;
      pointer-events: none;
    }

    &[aria-checked='true']:disabled {
      background: #abbacd;
      border: 1px solid #abbacd;
    }
  `,
  Icon: styled.div`
    color: inherit;
    fill: currentColor;
  `,
  Label: styled.label`
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `,
  Left: styled.div`
    border-radius: 4px 0 0 4px;
  `,
  Right: styled.div`
    border-radius: 0 4px 4px 0;
  `,
};

interface SwitchButtonProps extends Switch {
  role?: string;
  disabled?: boolean;
  className?: string;
  onClick: (value: any) => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  label,
  icon,
  value,
  onClick,
  ...props
}: SwitchButtonProps) => {
  const onClickHandler = React.useCallback(() => {
    onClick(value);
  }, [value, onClick]);
  const id = useId();
  return (
    <>
      <S.Button onClick={onClickHandler} {...props} aria-labelledby={id}>
        <S.Icon as={icon} />
      </S.Button>
      {label && (
        <S.Label aria-label={label} id={id}>
          {label}
        </S.Label>
      )}
    </>
  );
};

const ToggleSwitchButton: React.FC<Props> = ({
  'aria-labelledby': label,
  disabled,
  value,
  options,
  onClick,
}: Props) => {
  const leftKey = useKey();
  const rightKey = useKey();
  const [leftSwitch, rightSwitch] = options;
  return (
    <S.Wrapper role="radiogroup" aria-labelledby={label}>
      <React.Fragment key={leftKey}>
        <S.Left
          key={leftKey}
          as={SwitchButton}
          role="radio"
          aria-checked={value === leftSwitch.value}
          {...leftSwitch}
          onClick={onClick}
          disabled={disabled}
        />
      </React.Fragment>
      <React.Fragment key={rightKey}>
        <S.Right
          key={rightKey}
          as={SwitchButton}
          role="radio"
          aria-checked={value === rightSwitch.value}
          {...rightSwitch}
          onClick={onClick}
          disabled={disabled}
        />
      </React.Fragment>
    </S.Wrapper>
  );
};

export default ToggleSwitchButton;
