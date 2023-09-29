import React, { forwardRef } from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';

import ListBox from '../../elements/ListBox';
import QuickSearchField from '../../elements/QuickSearchField';
import Spinner from '../../elements/Spinner';
import { Color } from '../../styles';

export const MENU_MAX_HEIGHT = 384;
/* px */

type Option = {
  id?: string;
  value: any;
  label?: React.ReactNode;
};

interface Props {
  className?: string;
  role: 'listbox';
  'data-testid'?: string;
  isOpen: boolean;
  isLoading?: boolean;
  term: string;
  options: ReadonlyArray<Option>;
  selectedOption: Option;
  onChange: (
    event: React.SyntheticEvent<HTMLInputElement>,
    terms?: string[]
  ) => void;
  onSelect: (option: Option) => void;
}

const S = {
  ListBox: styled.div<{ isOpen?: boolean }>`
    display: ${({ isOpen }): string => (isOpen ? 'flex' : 'none')};
    flex-flow: column nowrap;
    background: #fff;
    border: 1px solid ${Color.border3};
    box-sizing: border-box;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    max-height: ${MENU_MAX_HEIGHT}px;
    padding: 8px 0 8px 0;
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: pre-wrap;
  `,
  QuickSearchFieldContainer: styled.div`
    padding: 13px 13px 9px 13px;
  `,
  OverflowContainer: styled.div`
    max-height: 346px;
    overflow-y: auto;
  `,
  SpinnerContainer: styled.div`
    height: 236px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

const QuickSearchableListBox: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props> & React.RefAttributes<HTMLDivElement>
> = forwardRef(
  (
    {
      'data-testid': testId,
      className,
      onChange,
      term,
      isOpen,
      isLoading,
      ...props
    }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <S.ListBox ref={ref} className={className} isOpen={isOpen}>
        <S.QuickSearchFieldContainer>
          <QuickSearchField
            data-testid={testId ? `${testId}__quick-search-field` : undefined}
            placeholder={msg().Com_Lbl_Search}
            onChange={onChange}
            value={term}
            debounce={false}
          />
        </S.QuickSearchFieldContainer>
        <S.OverflowContainer>
          {!isLoading ? (
            <ListBox
              data-testid={testId ? `${testId}__list-box` : undefined}
              {...props}
            />
          ) : (
            <S.SpinnerContainer>
              <Spinner size="small" />
            </S.SpinnerContainer>
          )}
        </S.OverflowContainer>
      </S.ListBox>
    );
  }
);

export default QuickSearchableListBox;
