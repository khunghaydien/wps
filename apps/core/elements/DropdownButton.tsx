import * as React from 'react';

import styled from 'styled-components';

import { Color, Font } from '../styles';

interface Props {
  'aria-haspopup': 'listbox';
  'data-testid'?: string;
  className?: string;
  label?: React.ReactNode;
  hasEmptyOption?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  isOpen: boolean;
  isValueSelected: boolean;
  onClick: (e: React.SyntheticEvent<HTMLElement>) => void;
}

const S = {
  Wrapper: styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
  `,
  Mark: styled.div`
    content: ' ';
    width: 8px;
    height: 5px;
    border: 5px solid transparent;
    border-color: #666 transparent transparent transparent;
    margin: 5px 0 0 0;
  `,
  Button: styled.button<{ readOnly?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    outline: none;
    background: #fff;
    border: 1px solid ${Color.border3};
    box-sizing: border-box;
    border-radius: 4px;
    appearance: none;
    width: 100%;
    height: 32px;
    color: ${Color.primary};
    font-size: ${Font.size.L};
    line-height: normal;
    padding: 0 13px 0 17px;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: ${Color.hover};
    }
    &:active,
    &:focus {
      border: 1px solid ${Color.action};
      box-shadow: 0 0 3px #0070d2;
    }
    &[readonly] {
      background: ${Color.background};
    }
  `,
  Label: styled.div<{ isSelected: boolean }>`
    &,
    & > * {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 4px 0 0;
    }

    width: 100%;
    ${({ isSelected }): undefined | string => !isSelected && 'color: #999;'}
  `,
};

const DropdownButton = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      'data-testid': testId,
      label,
      isOpen,
      isValueSelected,
      disabled,
      readOnly,
      onClick,
      ...props
    }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <S.Wrapper ref={ref}>
        <S.Button
          {...props}
          onClick={onClick}
          disabled={disabled}
          readOnly={readOnly}
          data-testid={testId}
          aria-expanded={isOpen}
          aria-disabled={disabled}
          aria-readonly={readOnly}
        >
          <S.Label
            data-testid={testId ? `${testId}__label` : undefined}
            isSelected={isValueSelected}
          >
            {label}
          </S.Label>
          {!disabled && <S.Mark />}
        </S.Button>
      </S.Wrapper>
    );
  }
);

export default DropdownButton;
