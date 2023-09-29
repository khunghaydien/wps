import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

export type Props = {
  id?: string;
  noBorder?: boolean;
  children: React.ReactNode;
  title?: string;
  width?: string;
  height?: string;
  divider?: boolean;
  background?: string;
  fontWeight?: string;
  textAlign?: string;
  padding?: string;
  onClick?: (id) => void;
  clickable?: boolean;
  editable?: boolean;
  onValueChange?: (val) => void;
  setActiveCellId?: (cellId) => void;
  activeCellId?: string;
  onChangeCellValue?: (id: string, value: string) => void;
  currencyDecimal?: number;
  cellType?: string;
  allowNegative?: boolean;
  cellClassName?: string;
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
  noteId?: string;
  summaryInfo?: object;
  detailInfo?: object;
};

export const ROOT = 'ts-psa_basic-cell';

const CellContainer = styled.div<{
  id?: string;
  activeCellId?: string;
  width?: string;
  height?: string;
  background?: string;
  textAlign?: string;
  divider?: boolean;
  cursor: string;
  highlightable?: boolean;
  noBorder?: boolean;
}>`
  width: ${(props) => props.width || '90px'};
  height: ${(props) => props.height || '25px'};
  background: ${(props) => props.background || ''};
  display: flex;
  align-items: center;
  text-align: ${(props) => props.textAlign};
  border-bottom: ${(props) => (props.divider ? '4px' : '1px')} solid #ddd;
  &:hover {
    cursor: ${(props) => props.cursor};
  }
  border: ${(props) => (props.noBorder ? '' : 'solid')}
    ${(props) =>
      props.highlightable && props.id === props.activeCellId
        ? '2px #2782ED'
        : '0.5px #DDD'};
`;
const Cell = styled.div<{
  fontWeight?: string;
  padding?: string;
  clickable?: boolean;
  textAlign?: string;
}>`
  font-weight: ${(props) => props.fontWeight || 'normal'};
  width: 100%;
  padding: ${(props) => props.padding || '0 8px 0 8px'};
  text-align: ${(props) => props.textAlign};
  color: ${(props) => (props.clickable ? '#2782ED' : '#333')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Input = styled.input`
  max-width: 104px;
  margin-left: 4px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  height: 19px;
`;

const Triangle = styled.div`
  position: relative;
  top: -35%;
  left: 89%;
  width: 16px;
  height: 8px;
  background: #2782ed;
  clip-path: polygon(50% 0, 100% 0, 100% 100%);
`;

const PropsChild = styled.span<{
  cursor: string;
}>`
  &:hover {
    cursor: ${(props) => props.cursor};
  }
`;
const BasicCell = (props: Props) => {
  const [cellvalue, setCellValue] = useState('' + props.children);

  // encoded strin is using edit.svg
  // tool used is https://yoksel.github.io/url-encoder/
  const encodedCursor = `url("data:image/svg+xml;utf8,%3Csvg width='16' height='15' viewBox='0 0 16 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.9008 9.77693L5.63926 12.5154C5.76233 12.6385 5.94695 12.6385 6.07003 12.5154L12.9008 5.65385C13.0239 5.53077 13.0239 5.34616 12.9008 5.22308L10.1931 2.51539C10.07 2.39231 9.88541 2.39231 9.76233 2.51539L2.9008 9.37693C2.77772 9.5 2.77772 9.68462 2.9008 9.77693V9.77693ZM11.0854 1.25385C10.9623 1.37693 10.9623 1.56154 11.0854 1.68462L13.7931 4.39231C13.9162 4.51539 14.1008 4.51539 14.2239 4.39231L14.9931 3.62308C15.4854 3.16154 15.4854 2.42308 14.9931 1.93077L13.5469 0.484618C13.0546 -0.00768995 12.2854 -0.00768995 11.7931 0.484618L11.0854 1.25385V1.25385ZM0.623873 14.3308C0.562334 14.6385 0.839257 14.9154 1.14695 14.8538L4.5008 14.0538C4.62387 14.0231 4.71618 13.9615 4.77772 13.9L4.83926 13.8385C4.9008 13.7769 4.93156 13.5615 4.80849 13.4385L2.03926 10.6692C1.91618 10.5462 1.7008 10.5769 1.63926 10.6385L1.57772 10.7C1.48541 10.7923 1.45464 10.8846 1.42387 10.9769L0.623873 14.3308V14.3308Z' fill='%232782ED'/%3E%3C/svg%3E%0A") 0 16,auto;`;
  const shouldMemoAvailable =
    !!props.updatePosition &&
    !props.editable &&
    props.id &&
    !props.id.startsWith('undefined');

  let containerCursor = '';
  if (props.onClick && props.clickable) {
    if (shouldMemoAvailable) {
      containerCursor = encodedCursor;
    } else {
      containerCursor = 'text';
    }
  } else {
    if (shouldMemoAvailable) {
      containerCursor = encodedCursor;
    } else {
      containerCursor = '';
    }
  }
  const childCursor = props.onClick && props.clickable ? 'pointer' : 'text';
  const inputElement = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    setCellValue('' + props.children);
  }, [props.editable]);

  useEffect(() => {
    // use boolean flag to determine active or not
    // this is due to dynamically generated cell. need to set the focus manually
    if (
      props.editable &&
      props.id === props.activeCellId &&
      inputElement.current
    ) {
      inputElement.current.focus();
      setCellValue(cellvalue);
    }
  }, [cellvalue]);

  const handleOnFocus = () => {
    props.setActiveCellId(props.id);
    inputElement.current.focus();
  };

  const updateCellValue = (id, val) => {
    props.onChangeCellValue(id, val);
  };

  const handleOnChange = (e) => {
    const val = e.target.value;
    const { allowNegative } = props;

    const negativePattern = allowNegative ? '(-?)' : '';
    if (props.cellType === 'string') {
      setCellValue(val);
      updateCellValue(props.id, val);
    } else if (val === '') {
      setCellValue(val);
      updateCellValue(props.id, val);
    } else if (
      props.currencyDecimal === 2 &&
      val.match(new RegExp(`^${negativePattern}(\\d{1,10}(\\.\\d{0,2})?)?$`))
    ) {
      // Allow to type partial decimal number
      if (val.match(new RegExp(`^${negativePattern}(\\d*(\\.\\d+)?)?$`))) {
        setCellValue(val);
        updateCellValue(props.id, val);
      } else {
        setCellValue(val);
      }
    } else if (val.match(new RegExp(`^${negativePattern}(\\d{1,10}?)?$`))) {
      setCellValue(val);
      updateCellValue(props.id, val);
    }
  };

  const handleOnSpanClick = (e) => {
    e.stopPropagation();
    if (props.onClick) {
      props.onClick(props.id);
    }
  };

  const handleOnCellClick = () => {
    if (
      props.id &&
      !props.id.startsWith('undefined') &&
      !props.editable &&
      !!props.updatePosition
    ) {
      const posX = boxRef.current.offsetLeft + boxRef.current.clientWidth + 5;
      const posY = boxRef.current.offsetTop;

      props.updatePosition(
        posX,
        posY,
        boxRef.current.offsetLeft,
        boxRef.current.offsetTop,
        boxRef.current.clientWidth,
        boxRef.current.clientHeight,
        props.noteId,
        props.summaryInfo,
        props.detailInfo
      );
      if (props.setActiveCellId) {
        props.setActiveCellId(props.id);
      }
    }
  };

  return (
    <CellContainer
      id={props.id}
      activeCellId={props.activeCellId}
      highlightable={!props.editable && !!props.updatePosition}
      ref={boxRef}
      width={props.width}
      height={props.height}
      background={props.background}
      textAlign={props.textAlign}
      divider={props.divider}
      cursor={containerCursor}
      onClick={handleOnCellClick}
      noBorder={props.noBorder}
    >
      {props.noteId && !props.editable && <Triangle />}
      <Cell
        fontWeight={props.fontWeight}
        padding={props.padding}
        clickable={props.clickable}
        textAlign={props.textAlign}
        title={props.title}
        data-testid={`${ROOT}__${props.id}`}
        className={props.cellClassName}
      >
        {props.editable ? (
          <Input
            ref={inputElement}
            id={props.id}
            value={cellvalue}
            onFocus={props.editable && handleOnFocus}
            onChange={props.editable && handleOnChange}
          />
        ) : (
          <PropsChild onClick={handleOnSpanClick} cursor={childCursor}>
            {props.children}
          </PropsChild>
        )}
      </Cell>
    </CellContainer>
  );
};

BasicCell.defaultProps = {
  allowNegative: false,
};

export default BasicCell;
