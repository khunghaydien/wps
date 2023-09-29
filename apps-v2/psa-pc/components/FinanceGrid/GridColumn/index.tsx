import React from 'react';

import styled from 'styled-components';

import StyledBasicCell from '@psa/components/FinanceGrid/BasicCell';

export type MainItem = {
  value: string;
  className?: string;
  divider?: boolean;
  background?: string;
};

export type Props = {
  items: Array<any>;
  width?: string;
  setActiveCellId?: (cellId) => void;
  activeCellId?: string;
  onChangeCellValue?: (id: string, value: string) => void;
  updatePosition?: (
    posX,
    posY,
    offsetLeft,
    offsetTop,
    width,
    height,
    noteId,
    summaryInfo,
    detailInfo
  ) => void;
};

export const ROOT = 'main-view';

const StyledGridCellContainer = styled.div.attrs((props: any) => props)`
  background: #fff5d9;
  display: inline-flex;
  height: auto;
  width: ${(props) => props.props.width};
`;

const StyledGridCell = styled.div.attrs((props: any) => props)`
  height: ${(props) => props.props.items.length * 25}px;
  width: ${(props) => props.props.width};
`;

const GridColumn = (props: Props) => {
  return (
    <StyledGridCellContainer props={props}>
      <StyledGridCell props={props}>
        {props.items &&
          props.items.map((item) => {
            return (
              <StyledBasicCell
                key={item.id}
                id={item.id}
                title={item.value}
                width={`${props.width || '120px'}`}
                divider={item.divider}
                background={item.background}
                textAlign="right"
                padding="0 8px 0 0"
                editable={item.editable}
                setActiveCellId={props.setActiveCellId}
                activeCellId={props.activeCellId}
                onChangeCellValue={props.onChangeCellValue}
                cellType={item.cellType}
                currencyDecimal={item.currencyDecimal}
                clickable={item.onClickable}
                onClick={item.onClick}
                allowNegative={item.allowNegative}
                updatePosition={props.updatePosition}
                noteId={item.noteId}
                summaryInfo={item.summaryInfo}
                detailInfo={item.detailInfo}
              >
                {item.value}
              </StyledBasicCell>
            );
          })}
      </StyledGridCell>
    </StyledGridCellContainer>
  );
};

export default GridColumn;
