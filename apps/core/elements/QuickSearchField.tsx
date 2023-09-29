import React from 'react';

import styled from 'styled-components';

import { useDebouncedHandleChange, useKey } from '../hooks/index';
import { Icons } from '../index';
import { Color } from '../styles';

interface Props extends React.ComponentProps<'input'> {
  onChange: (
    e: React.SyntheticEvent<HTMLInputElement>,
    terms?: string[]
  ) => void;
  value: string;
  debounce: boolean;
  // specify milliseconds. ignored if debounce is false.
  wait?: number;
}

const S = {
  OuterInput: styled.div<{ readOnly: boolean; disabled: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    background: ${({ readOnly, disabled }) =>
      readOnly || disabled ? Color.background : Color.base};
    border: 1px solid ${Color.border3};
    border-radius: 4px;
    padding: 0 8px;

    :focus-within {
      border: 1px solid ${Color.accent};
      box-shadow: 0 0 3px #0070d2;
    }
  `,

  InnerInput: styled.input.attrs(() => ({
    type: 'text',
  }))`
    height: 100%;
    width: 100%;
    border: none;
    margin-left: 8px;
    outline: none;
    font-size: 13px;
    line-height: 19px;
    color: ${Color.primary};
    background-color: transparent;

    ::placeholder {
      color: ${Color.disable};
    }
  ` as React.ComponentType<Props>,

  SearchIcon: styled(Icons.Search)`
    height: 12px;
    width: 12px;
  `,
};

const QuickSearchField = ({ onChange, wait = 500, ...props }: Props) => {
  const iconKey = useKey();
  const inputKey = useKey();
  const handleChange = useDebouncedHandleChange(props.debounce, wait, onChange);

  return (
    <S.OuterInput readOnly={props.readOnly} disabled={props.disabled}>
      <S.SearchIcon key={iconKey} color="disable" />
      <S.InnerInput key={inputKey} {...props} onChange={handleChange} />
    </S.OuterInput>
  );
};

export default QuickSearchField;
