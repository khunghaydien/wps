import * as React from 'react';
import { FixedSizeList as List } from 'react-window';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

type Props<T> = {
  children: (item: T) => React.ReactNode;
  items: ReadonlyArray<T>;
  width?: number;
  height?: number;
  itemSize?: number;
};

const S = {
  Wrapper: styled.div<{ width?: number; height?: number }>`
    width: ${({ width }) => (isNil(width) ? '240px' : `${width}px`)};
    height: ${({ height }) => (isNil(height) ? '346px' : `${height}px`)};
  `,
};

const VirtualizedList = <T,>({ items = [], ...props }: Props<T>) => {
  return (
    <S.Wrapper>
      <List
        style={{
          overflowX: 'hidden',
        }}
        itemData={items}
        height={props.height || 346}
        width="100%"
        itemSize={props.itemSize || 44}
        itemCount={items.length}
      >
        {({ data, index, style }) => (
          <div style={style}>{props.children(data[index])}</div>
        )}
      </List>
    </S.Wrapper>
  );
};

export default VirtualizedList;
