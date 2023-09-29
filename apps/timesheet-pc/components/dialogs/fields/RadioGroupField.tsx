import React from 'react';

import styled from 'styled-components';

import Radio from '../../../../core/blocks/Radio';

const S = {
  Item: styled.div`
    line-height: 100%;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  `,
};

type Props<V> = Readonly<{
  value?: V;
  options: Array<{
    label: string;
    value: V;
  }>;
  onChange: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}>;

const RadioGroupField = <V extends string | number | string[]>({
  value,
  options,
  onChange,
  disabled,
}: Props<V>): React.ReactElement => (
  <>
    {options.map((option) => (
      <S.Item>
        <Radio
          label={option.label}
          value={option.value}
          onChange={onChange}
          checked={value === option.value}
          disabled={disabled}
        />
      </S.Item>
    ))}
  </>
);

export default RadioGroupField;
