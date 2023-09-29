import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Check } from '@apps/core/elements/Icons';
import { Color } from '@apps/core/styles';

import { getJctRegistrationNumber } from '@apps/domain/models/exp/Vendor';

import { Option } from './QuickSearchContext';

interface Props {
  className?: string;
  cursor?: number;
  'data-testid'?: string;
  options: ReadonlyArray<Option>;
  role: 'listbox';
  selectedOption?: Option;
  useJctRegistrationNumber?: boolean;
  onSelect: (value: Option) => void;
}

const S = {
  ListBox: styled.ul``,
  Option: styled.li<{ active?: boolean }>`
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
    background: ${({ active }): string => (active ? Color.hover : 'auto')};

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

    > svg {
      zoom: 0.6;
      margin-right: 10px;
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
  EmptyList: styled.div`
    text-align: center;
    color: grey;
  `,
};

const ListBox = ({
  'data-testid': testId,
  role,
  options = [],
  selectedOption = { value: undefined },
  onSelect,
  useJctRegistrationNumber,
  ...props
}: Props) => {
  const [listRefs, setListRefs] = useState({});
  const ref = useRef();
  useEffect(() => {
    const refs = options.reduce((acc, current, index) => {
      acc[index] = React.createRef();
      return acc;
    }, {});
    setListRefs(refs);
  }, []);

  useEffect(() => {
    if (props.cursor > 0 && listRefs[props.cursor]) {
      listRefs[props.cursor].current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [props.cursor]);

  const noOptions = options.length === 0;

  return (
    <S.ListBox role={role} {...props} ref={ref}>
      {(noOptions && <S.EmptyList> {msg().Com_Lbl_NoOption}</S.EmptyList>) ||
        options.map((option: Option, index) => (
          <S.Option
            role="option"
            aria-selected={option.value === selectedOption.value}
            data-testid={testId ? `${testId}__item-${index}` : undefined}
            id={option.id}
            onClick={() => onSelect(option)}
            active={index === props.cursor}
            ref={listRefs[index]}
            key={option.id}
          >
            {option.value === selectedOption.value && (
              <S.CheckMarkContainer aria-hidden>
                <S.CheckMark as={Check} />
              </S.CheckMarkContainer>
            )}
            {option.icon} {option.label || option.value}{' '}
            {useJctRegistrationNumber &&
              `[${getJctRegistrationNumber(
                option.jctRegistrationNumber,
                option.isJctQualifiedInvoiceIssuer
              )}]`}
          </S.Option>
        ))}
    </S.ListBox>
  );
};

export default ListBox;
