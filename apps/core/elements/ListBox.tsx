import React from 'react';

import styled from 'styled-components';

import { Color } from '../styles';
import { Check } from './Icons';

export type Option = {
  id?: string;
  value: any;
  label?: React.ReactNode;
};

interface Props {
  'data-testid'?: string;
  role: 'listbox';
  className?: string;
  selectedOption?: Option;
  options: ReadonlyArray<Option>;
  onSelect: (value: Option) => void;
}

const S = {
  ListBox: styled.ul``,
  Option: styled.li`
    min-height: 30px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 13px;
    line-height: 17px;
    padding: 6px 0;
    color: ${Color.primary};
    white-space: normal;
    cursor: pointer;

    &[aria-selected='true'] {
      font-weight: bold;
      padding: 6px 0;
    }
    &[aria-selected='false'] {
      font-weight: normal;
      padding: 6px 0 6px 29px;
    }

    :hover {
      background: ${Color.hover};
    }
  `,
  CheckMarkContainer: styled.div`
    padding: 0 8px;
    width: 29px;
  `,
  CheckMark: styled.svg`
    fill: #008eb6;
    width: 12px;
  `,
};

const ListBox: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props> & React.RefAttributes<HTMLUListElement>
> = React.forwardRef(
  (
    {
      'data-testid': testId,
      role,
      options,
      selectedOption = { value: undefined },
      onSelect,
      ...props
    }: Props,
    ref: React.Ref<HTMLUListElement>
  ) => {
    return (
      <S.ListBox role={role} {...props} ref={ref}>
        {options.map((option, index) => (
          <S.Option
            role="option"
            aria-selected={option.value === selectedOption.value}
            data-testid={testId ? `${testId}__item-${index}` : undefined}
            id={option.id}
            onClick={() => onSelect(option)}
          >
            {option.value === selectedOption.value && (
              <S.CheckMarkContainer aria-hidden>
                <S.CheckMark as={Check} />
              </S.CheckMarkContainer>
            )}
            {/* flowlint sketchy-null-number:off */}
            <div>{option.label || option.value}</div>
          </S.Option>
        ))}
      </S.ListBox>
    );
  }
);

export default ListBox;
