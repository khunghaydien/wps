import React from 'react';

import styled from 'styled-components';

import StyledBasicCell from '@psa/components/FinanceGrid/BasicCell';

export type LabelItem = {
  id?: string;
  name: string;
  className?: string;
  mergedRows?: number;
  divider?: boolean;
  background?: string;
};

export type Props = {
  id?: string;
  title: string;
  children?: React.ReactNode;
  items?: Array<LabelItem>;
  mergedRows?: number;
  background?: string;
  fontWeight?: string;
  onClick?: (id) => void;
  divider?: boolean;
  padding?: string;
  cellClassName?: string;
};
const StyledLeftTitleContainer = styled.div`
  display: inline-flex;
  height: auto;
  width: 100%;
`;

const TitleColumn = (props: Props) => {
  const rows = props.mergedRows ? props.mergedRows : 1;
  return (
    <StyledLeftTitleContainer>
      <StyledBasicCell
        id={props.id}
        onClick={() => props.onClick && props.onClick(props.id)}
        width="calc(100% - 90px)"
        height={`${rows * 25}px`}
        background={props.background}
        fontWeight={props.fontWeight || 'bold'}
        padding={props.padding || '0 8px 0 16px'}
        clickable={!!props.onClick}
        divider={props.divider}
        title={props.title}
        cellClassName={props.cellClassName}
      >
        {props.children ? (
          props.children
        ) : (
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {props.title}
          </span>
        )}
      </StyledBasicCell>

      <div>
        {props.items &&
          props.items.map((item) => {
            const cellHeight = item.mergedRows ? item.mergedRows * 25 : 25;
            return (
              <StyledBasicCell
                key={item.id}
                id={item.id}
                height={`${cellHeight}px`}
                divider={item.divider}
                background={item.background || props.background}
              >
                {item.name}
              </StyledBasicCell>
            );
          })}
      </div>
    </StyledLeftTitleContainer>
  );
};

export default TitleColumn;
