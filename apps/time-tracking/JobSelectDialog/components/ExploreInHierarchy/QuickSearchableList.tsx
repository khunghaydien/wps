import * as React from 'react';

import styled from 'styled-components';

import { QuickSearchField } from '@apps/core';
import { Color } from '@apps/core/styles';
import VirtualizedList from '@commons/components/VirtualizedList';
import msg from '@commons/languages';

const STANDARD_MAX_LENGTH_OF_SEARCH_FIELD = 100;

type Props<T> = {
  items: ReadonlyArray<T>;
  isLoadDone?: boolean;
  children: (arg0: T) => React.ReactNode;
  onSearch: (arg0: string) => void;
  initialSearchWord?: string;
  isTall: boolean;
};

const S = {
  Wrapper: styled.div`
    height: 418px;
    width: 240px;
    background: ${Color.base};
    overflow-x: hidden;
  `,

  SearchFieldWrapper: styled.div`
    width: 100%;
    height: 72px;
    padding: 20px;
  `,

  NotFound: styled.div`
    width: 100%;
    height: calc(100% - 72px);
    text-align: center;

    ::before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  `,
};

const QuickSearchableList = <T,>({
  items = [],
  isLoadDone = true,
  initialSearchWord = '',
  onSearch,
  ...props
}: Props<T>) => {
  const [keyword, setKeyword] = React.useState<string>(initialSearchWord);

  const onPressEnter = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch(e.currentTarget.value);
      }
    },
    [onSearch]
  );

  return (
    <S.Wrapper>
      <S.SearchFieldWrapper>
        <QuickSearchField
          debounce={false}
          value={keyword}
          onChange={(e) => setKeyword(e.currentTarget.value)}
          onKeyPress={onPressEnter}
          placeholder={msg().Time_Lbl_SearchOnEnter}
          maxLength={STANDARD_MAX_LENGTH_OF_SEARCH_FIELD}
          autoFocus
        />
      </S.SearchFieldWrapper>
      {isLoadDone && items.length === 0 ? (
        <S.NotFound>{msg().Time_Lbl_JobIsNotFound}</S.NotFound>
      ) : (
        <VirtualizedList itemSize={props.isTall ? 56 : null} items={items}>
          {props.children}
        </VirtualizedList>
      )}
    </S.Wrapper>
  );
};

export default QuickSearchableList;
